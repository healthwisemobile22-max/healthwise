import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendAppointmentReminderEmail } from "@/lib/email";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getTomorrowDateString() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

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
    const targetDate = getTomorrowDateString();

    const { data: appointments, error } = await db
      .from("appointments")
      .select("*, patients(*)")
      .eq("status", "Approved")
      .eq("requested_date", targetDate)
      .is("reminder_sent_at", null);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const results: Array<{ id: string; ok: boolean; error?: string }> = [];

    for (const appt of appointments || []) {
      const patient = Array.isArray(appt.patients) ? appt.patients[0] : appt.patients;

      if (!patient?.email) {
        results.push({
          id: appt.id,
          ok: false,
          error: "Missing patient email",
        });
        continue;
      }

      try {
        const patientName =
          `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || "Patient";

        await sendAppointmentReminderEmail({
          patientName,
          patientEmail: patient.email,
          service: appt.service,
          date: appt.requested_date,
          time: appt.requested_time || undefined,
          address: patient.address || "",
        });

        await db
          .from("appointments")
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq("id", appt.id);

        await db.from("audit_logs").insert({
          user_email: patient.email,
          action: "Appointment Reminder Sent",
          details: `${patientName} - ${appt.service} on ${appt.requested_date}${appt.requested_time ? ` at ${appt.requested_time}` : ""}`,
        });

        results.push({ id: appt.id, ok: true });
      } catch (err: any) {
        results.push({
          id: appt.id,
          ok: false,
          error: err?.message || "Reminder send failed",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      targetDate,
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