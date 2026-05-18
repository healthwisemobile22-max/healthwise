import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendAppointmentReminderEmail, sendSameDayReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return true;
  return authHeader === `Bearer ${cronSecret}`;
}

function formatDateOnly(date: Date) {
  return date.toISOString().split("T")[0];
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const now = new Date();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayString = formatDateOnly(now);
  const tomorrowString = formatDateOnly(tomorrow);

  const results = {
    regularReminderCandidates: 0,
    regularRemindersSent: 0,
    sameDayReminderCandidates: 0,
    sameDayRemindersSent: 0,
    errors: [] as string[],
  };

  try {
    const { data: regularAppointments, error: regularError } = await supabase
      .from("appointments")
      .select("id, requested_date, requested_time, reminder_sent_at, status, patients(*)")
      .eq("status", "Approved")
      .eq("requested_date", tomorrowString)
      .is("reminder_sent_at", null);

    if (regularError) {
      throw new Error(`Regular reminder query failed: ${regularError.message}`);
    }

    results.regularReminderCandidates = regularAppointments?.length || 0;

    for (const appt of regularAppointments || []) {
      try {
        const patient = appt.patients;

        if (!patient?.email) {
          results.errors.push(`Skipped regular reminder for ${appt.id}: missing patient email`);
          continue;
        }

        await sendAppointmentReminderEmail({
          to: patient.email,
          firstName: patient.first_name || "Patient",
          appointmentDate: appt.requested_date || "",
          appointmentTime: appt.requested_time || "",
        });

        const { error: updateError } = await supabase
          .from("appointments")
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq("id", appt.id);

        if (updateError) {
          results.errors.push(`Reminder sent but DB update failed for ${appt.id}: ${updateError.message}`);
          continue;
        }

        results.regularRemindersSent += 1;
      } catch (err: any) {
        results.errors.push(`Regular reminder failed for ${appt.id}: ${err.message || "Unknown error"}`);
      }
    }

    const { data: sameDayAppointments, error: sameDayError } = await supabase
      .from("appointments")
      .select("id, requested_date, requested_time, same_day_reminder_sent_at, status, patients(*)")
      .eq("status", "Approved")
      .eq("requested_date", todayString)
      .is("same_day_reminder_sent_at", null);

    if (sameDayError) {
      throw new Error(`Same-day reminder query failed: ${sameDayError.message}`);
    }

    results.sameDayReminderCandidates = sameDayAppointments?.length || 0;

    for (const appt of sameDayAppointments || []) {
      try {
        const patient = appt.patients;

        if (!patient?.email) {
          results.errors.push(`Skipped same-day reminder for ${appt.id}: missing patient email`);
          continue;
        }

        await sendSameDayReminderEmail({
          to: patient.email,
          firstName: patient.first_name || "Patient",
          appointmentDate: appt.requested_date || "",
          appointmentTime: appt.requested_time || "",
        });

        const { error: updateError } = await supabase
          .from("appointments")
          .update({ same_day_reminder_sent_at: new Date().toISOString() })
          .eq("id", appt.id);

        if (updateError) {
          results.errors.push(`Same-day reminder sent but DB update failed for ${appt.id}: ${updateError.message}`);
          continue;
        }

        results.sameDayRemindersSent += 1;
      } catch (err: any) {
        results.errors.push(`Same-day reminder failed for ${appt.id}: ${err.message || "Unknown error"}`);
      }
    }

    return NextResponse.json({
      ok: true,
      ranAt: now.toISOString(),
      ...results,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err.message || "Cron job failed",
        ...results,
      },
      { status: 500 }
    );
  }
}