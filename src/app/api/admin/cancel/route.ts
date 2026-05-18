import { NextResponse } from "next/server";
import { requireAdmin, getServiceRoleClient } from "@/lib/requireAdmin";
import { sendDeclineEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) {
      return NextResponse.json(
        { ok: false, error: admin.error },
        { status: admin.status }
      );
    }

    const body = await req.json();
    const { appointmentId, reason } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { ok: false, error: "Appointment ID is required." },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const { error: updateError } = await supabase
      .from("appointments")
      .update({
        status: "Cancelled",
        decline_reason: reason || "Your appointment was cancelled by the admin.",
      })
      .eq("id", appointmentId);

    if (updateError) {
      console.error("CANCEL UPDATE ERROR:", updateError);
      return NextResponse.json(
        { ok: false, error: updateError.message },
        { status: 500 }
      );
    }

    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (appointmentError || !appointment) {
      console.error("FETCH APPOINTMENT ERROR:", appointmentError);
      return NextResponse.json(
        { ok: false, error: appointmentError?.message || "Appointment not found." },
        { status: 500 }
      );
    }

    if (!appointment.patient_id) {
      return NextResponse.json(
        { ok: false, error: "No patient_id found on appointment." },
        { status: 500 }
      );
    }

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .eq("id", appointment.patient_id)
      .single();

    if (patientError || !patient) {
      console.error("FETCH PATIENT ERROR:", patientError);
      return NextResponse.json(
        { ok: false, error: patientError?.message || "Patient not found." },
        { status: 500 }
      );
    }

    const toTitleCase = (value: string) =>
      value
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const fullName = [patient.first_name, patient.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();

    const patientName =
      patient.full_name?.trim()
        ? toTitleCase(patient.full_name.trim())
        : fullName
        ? toTitleCase(fullName)
        : patient.name?.trim()
        ? toTitleCase(patient.name.trim())
        : appointment.patient_name?.trim() || "Patient";

    const patientEmail =
      patient.email ||
      patient.patient_email ||
      patient.contact_email ||
      "";

    if (!patientEmail) {
      return NextResponse.json(
        { ok: false, error: "No patient email found on patients row." },
        { status: 500 }
      );
    }

    try {
      await sendDeclineEmail({
        patientName,
        patientEmail,
        service: appointment.service || "Appointment",
        date: appointment.requested_date || "",
        reason:
          appointment.decline_reason ||
          reason ||
          "Your appointment was cancelled by the admin.",
      });

      return NextResponse.json({
        ok: true,
        message: "Appointment cancelled and email sent.",
      });
    } catch (emailError: any) {
      console.error("CANCELLATION EMAIL ERROR:", emailError);
      return NextResponse.json(
        {
          ok: false,
          error: emailError?.message || "Failed to send cancellation email.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("ADMIN CANCEL ROUTE ERROR:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to cancel appointment." },
      { status: 500 }
    );
  }
}