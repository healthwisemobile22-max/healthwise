import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, email } = await req.json();

    const cleanAppointmentId = String(appointmentId || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanAppointmentId || !cleanEmail) {
      return NextResponse.json(
        { ok: false, error: "Appointment reference and email are required." },
        { status: 400 }
      );
    }

    const db = getAdminClient();

    const { data: appt, error } = await db
      .from("appointments")
      .select("*, patients(*)")
      .eq("id", cleanAppointmentId)
      .single();

    if (error || !appt) {
      return NextResponse.json(
        { ok: false, error: "Appointment not found." },
        { status: 404 }
      );
    }

    const patient = Array.isArray(appt.patients) ? appt.patients[0] : appt.patients;

    if (!patient?.email || patient.email.toLowerCase() !== cleanEmail) {
      return NextResponse.json(
        { ok: false, error: "Appointment reference and email do not match." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      appointment: {
        id: appt.id,
        status: appt.status,
        service: appt.service,
        requested_date: appt.requested_date,
        requested_time: appt.requested_time,
        reschedule_requested_date: appt.reschedule_requested_date,
        reschedule_requested_time: appt.reschedule_requested_time,
        reschedule_reason: appt.reschedule_reason,
        cancelled_at: appt.cancelled_at,
        cancelled_reason: appt.cancelled_reason,
        patient: {
          first_name: patient.first_name,
          last_name: patient.last_name,
          email: patient.email,
          phone_mobile: patient.phone_mobile,
          address: patient.address,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}