import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSameDayReminderEmail } from "@/lib/email";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function parseTimeToMinutes(time: string) {
  const clean = time.trim().toUpperCase();
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours !== 12) hours += 12;

  return hours * 60 + minutes;
}

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getAdminClient();
    const today = getTodayDateString();
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const { data: appointments, error } = await db
      .from("appointments")
      .select("*, patients(*)")
      .eq("status", "Approved")
      .eq("requested_date", today)
      .not("requested_time", "is", null)
      .is("same_day_reminder_sent_at", null);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const results: Array<{ id: string; ok: boolean; skipped?: boolean; reason?: string }> = [];

    for (const appt of appointments || []) {
      const patient = Array.isArray(appt.patients) ? appt.patients[0] : appt.patients;

      if (!patient?.email) {
        results.push({
          id: appt.id,
          ok: false,
          reason: "Missing patient email",
        });
        continue;
      }

      if (!appt.requested_time) {
        results.push({
          id: appt.id,
          ok: false,
          reason: "Missing appointment time",
        });
        continue;
      }

      const appointmentMinutes = parseTimeToMinutes(appt.requested_time);

      if (appointmentMinutes === null) {
        results.push({
          id: appt.id,
          ok: false,
          reason: "Unrecognized time format",
        });
        continue;
      }

      const diff = appointmentMinutes - nowMinutes;

      if (false) {
        results.push({
          id: appt.id,
          ok: true,
          skipped: true,
          reason: "Not in 2-to-3 hour reminder window",
        });
        continue;
      }

      try {
        const patientName =
          `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || "Patient";

        await sendSameDayReminderEmail({
          patientName,
          patientEmail: patient.email,
          service: appt.service,
          date: appt.requested_date,
          time: appt.requested_time,
          address: patient.address || "",
        });

        await db
          .from("appointments")
          .update({ same_day_reminder_sent_at: new Date().toISOString() })
          .eq("id", appt.id);

        await db.from("audit_logs").insert({
          user_email: patient.email,
          action: "Same-Day Appointment Reminder Sent",
          details: `${patientName} - ${appt.service} on ${appt.requested_date} at ${appt.requested_time}`,
        });

        results.push({ id: appt.id, ok: true });
      } catch (err: any) {
        results.push({
          id: appt.id,
          ok: false,
          reason: err?.message || "Same-day reminder send failed",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      today,
      total: appointments?.length || 0,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}