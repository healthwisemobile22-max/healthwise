import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  sendAdminCancellationAlert,
  sendAdminRescheduleAlert,
  sendCancellationEmail,
  sendRescheduleRequestEmail,
} from "@/lib/email";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = String(body.action || "").trim();
    const appointmentId = String(body.appointmentId || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const reason = String(body.reason || "").trim();
    const requestedDate = String(body.requestedDate || "").trim();
    const requestedTime = String(body.requestedTime || "").trim();

    if (!appointmentId || !email || !action) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const db = getAdminClient();

    const { data: appt, error: apptError } = await db
      .from("appointments")
      .select("*, patients(*)")
      .eq("id", appointmentId)
      .single();

    if (apptError || !appt) {
      return NextResponse.json(
        { ok: false, error: "Appointment not found." },
        { status: 404 }
      );
    }

    const patient = Array.isArray(appt.patients) ? appt.patients[0] : appt.patients;
    const patientEmail = String(patient?.email || "").toLowerCase();

    if (!patientEmail || patientEmail !== email) {
      return NextResponse.json(
        { ok: false, error: "Appointment reference and email do not match." },
        { status: 403 }
      );
    }

    const patientName = `${patient?.first_name || ""} ${patient?.last_name || ""}`.trim();

    if (action === "cancel") {
      if (appt.status === "Cancelled") {
        return NextResponse.json(
          { ok: false, error: "This appointment is already cancelled." },
          { status: 400 }
        );
      }

      const { error: updateError } = await db
        .from("appointments")
        .update({
          status: "Cancelled",
          cancelled_at: new Date().toISOString(),
          cancelled_reason: reason || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      if (updateError) {
        return NextResponse.json(
          { ok: false, error: updateError.message },
          { status: 500 }
        );
      }

      await db.from("audit_logs").insert({
        user_email: patientEmail,
        action: "Appointment Cancelled by Patient",
        details: `${patientName} cancelled ${appt.service} on ${appt.requested_date}`,
      });

      try {
        await sendCancellationEmail({
          patientName,
          patientEmail,
          service: appt.service,
          date: appt.requested_date,
          time: appt.requested_time,
          reason: reason || undefined,
        });

        await sendAdminCancellationAlert({
          patientName,
          patientEmail,
          appointmentId,
          service: appt.service,
          date: appt.requested_date,
          time: appt.requested_time,
          reason: reason || undefined,
        });
      } catch (emailErr) {
        console.error("Cancellation email error:", emailErr);
      }

      return NextResponse.json({ ok: true, message: "Appointment cancelled." });
    }

    if (action === "reschedule") {
      if (!requestedDate) {
        return NextResponse.json(
          { ok: false, error: "Please choose a new preferred date." },
          { status: 400 }
        );
      }

      const { error: updateError } = await db
        .from("appointments")
        .update({
          reschedule_requested_date: requestedDate,
          reschedule_requested_time: requestedTime || null,
          reschedule_reason: reason || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      if (updateError) {
        return NextResponse.json(
          { ok: false, error: updateError.message },
          { status: 500 }
        );
      }

      await db.from("audit_logs").insert({
        user_email: patientEmail,
        action: "Appointment Reschedule Requested by Patient",
        details: `${patientName} requested to move ${appt.service} from ${appt.requested_date}${appt.requested_time ? ` at ${appt.requested_time}` : ""} to ${requestedDate}${requestedTime ? ` at ${requestedTime}` : ""}`,
      });

      try {
        await sendRescheduleRequestEmail({
          patientName,
          patientEmail,
          currentDate: appt.requested_date,
          currentTime: appt.requested_time,
          requestedDate,
          requestedTime: requestedTime || undefined,
          reason: reason || undefined,
        });

        await sendAdminRescheduleAlert({
          patientName,
          patientEmail,
          appointmentId,
          currentDate: appt.requested_date,
          currentTime: appt.requested_time,
          requestedDate,
          requestedTime: requestedTime || undefined,
          reason: reason || undefined,
        });
      } catch (emailErr) {
        console.error("Reschedule email error:", emailErr);
      }

      return NextResponse.json({
        ok: true,
        message: "Reschedule request submitted.",
      });
    }

    return NextResponse.json(
      { ok: false, error: "Invalid action." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}