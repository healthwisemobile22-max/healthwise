import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendApprovalEmail, sendDeclineEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { status, reason, appointmentId } = await req.json();

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: appt, error: apptError } = await db
    .from("appointments")
    .select("*, patients(*)")
    .eq("id", appointmentId)
    .single();

  if (apptError) {
    console.error("SUPABASE ERROR:", apptError);
    return NextResponse.json({ ok: false, error: apptError.message });
  }

  const patient = Array.isArray(appt?.patients) ? appt.patients[0] : appt?.patients;

  console.log("APPOINTMENT:", appt);
  console.log("PATIENT:", patient);

  if (!appt || !patient?.email) {
    return NextResponse.json({ ok: false, error: "No patient email" });
  }

  const patientName = `${patient.first_name || ""} ${patient.last_name || ""}`.trim();

  try {
    if (status === "Approved") {
      const result = await sendApprovalEmail({
        patientName,
        patientEmail: patient.email,
        service: appt.service,
        date: appt.requested_date,
        time: appt.requested_time,
        address: patient.address || appt.address || "",
      });

      console.log("APPROVAL EMAIL SENT:", result);
    } else if (status === "Declined") {
      const result = await sendDeclineEmail({
        patientName,
        patientEmail: patient.email,
        service: appt.service,
        date: appt.requested_date,
        reason: reason || "Unable to fulfill at this time",
      });

      console.log("DECLINE EMAIL SENT:", result);
    }

    await db.from("audit_logs").insert({
      user_email: "admin",
      action: `Appointment ${status}`,
      details: `${patientName} - ${appt.service} on ${appt.requested_date}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("NOTIFY ERROR:", err);
    return NextResponse.json({ ok: false, error: err.message || String(err) });
  }
}