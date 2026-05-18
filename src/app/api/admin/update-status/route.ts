import { NextResponse } from "next/server";
import { requireAdmin, getServiceRoleClient } from "@/lib/requireAdmin";
import { sendApprovalEmail, sendDeclineEmail } from "@/lib/email";

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
    const { appointmentId, status, reason } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { ok: false, error: "Appointment ID and status are required." },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const updatePayload: Record<string, any> = {
      status,
      decline_reason: status === "Declined" ? reason || "" : null,
    };

    const { error: updateError } = await supabase
      .from("appointments")
      .update(updatePayload)
      .eq("id", appointmentId);

    if (updateError) {
      console.error("UPDATE STATUS ERROR:", updateError);
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

    if (status === "Approved") {
      try {
        await sendApprovalEmail({
          patientName,
          patientEmail,
          service: appointment.service || "Appointment",
          date: appointment.requested_date || "",
          time: appointment.requested_time || "",
          address: appointment.address || "",
        });

        return NextResponse.json({
          ok: true,
          message: "Appointment approved and email sent.",
        });
      } catch (emailError: any) {
        console.error("APPROVAL EMAIL ERROR:", emailError);
        return NextResponse.json(
          {
            ok: false,
            error: emailError?.message || "Failed to send approval email.",
          },
          { status: 500 }
        );
      }
    }

    if (status === "Declined") {
      try {
        await sendDeclineEmail({
          patientName,
          patientEmail,
          service: appointment.service || "Appointment",
          date: appointment.requested_date || "",
          reason: appointment.decline_reason || reason || "No reason provided",
        });

        return NextResponse.json({
          ok: true,
          message: "Appointment declined and email sent.",
        });
      } catch (emailError: any) {
        console.error("DECLINE EMAIL ERROR:", emailError);
        return NextResponse.json(
          {
            ok: false,
            error: emailError?.message || "Failed to send decline email.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Appointment status updated.",
    });
  } catch (error: any) {
    console.error("UPDATE STATUS ROUTE ERROR:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to update appointment status." },
      { status: 500 }
    );
  }
}