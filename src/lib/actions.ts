"use server";

import { createClient } from "@supabase/supabase-js";
import { sendBookingReceivedEmail, sendNewBookingAlert } from "@/lib/email";

type SubmitAppointmentInput = {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneHome?: string;
  phoneMobile: string;
  email: string;
  address: string;
  nationalInsurance?: string;
  maritalStatus?: string;
  occupation?: string;
  service: string;
  requestedDate: string;
  requestedTime?: string;
  specialInstructions?: string;
  paymentStatus?: string;
};

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function submitAppointment(data: SubmitAppointmentInput) {
  const db = getAdminClient();

  const cleaned = {
    firstName: data.firstName.trim(),
    middleName: data.middleName?.trim() || "",
    lastName: data.lastName.trim(),
    dateOfBirth: data.dateOfBirth.trim(),
    gender: data.gender.trim(),
    phoneHome: data.phoneHome?.trim() || "",
    phoneMobile: data.phoneMobile.trim(),
    email: data.email.trim().toLowerCase(),
    address: data.address.trim(),
    nationalInsurance: data.nationalInsurance?.trim() || "",
    maritalStatus: data.maritalStatus?.trim() || "",
    occupation: data.occupation?.trim() || "",
    service: data.service.trim(),
    requestedDate: data.requestedDate.trim(),
    requestedTime: data.requestedTime?.trim() || "",
    specialInstructions: data.specialInstructions?.trim() || "",
    paymentStatus: data.paymentStatus?.trim() || "Unpaid",
  };

  if (!cleaned.firstName) throw new Error("First name is required.");
  if (!cleaned.lastName) throw new Error("Last name is required.");
  if (!cleaned.dateOfBirth) throw new Error("Date of birth is required.");
  if (!cleaned.gender) throw new Error("Gender is required.");
  if (!cleaned.phoneMobile) throw new Error("Mobile phone is required.");
  if (!cleaned.email) throw new Error("Email is required.");
  if (!cleaned.address) throw new Error("Address is required.");
  if (!cleaned.service) throw new Error("Service is required.");
  if (!cleaned.requestedDate) throw new Error("Requested date is required.");

  const { data: patient, error: patientError } = await db
    .from("patients")
    .insert({
      first_name: cleaned.firstName,
      middle_name: cleaned.middleName || null,
      last_name: cleaned.lastName,
      date_of_birth: cleaned.dateOfBirth,
      gender: cleaned.gender,
      phone_home: cleaned.phoneHome || null,
      phone_mobile: cleaned.phoneMobile,
      email: cleaned.email,
      address: cleaned.address,
      national_insurance: cleaned.nationalInsurance || null,
      marital_status: cleaned.maritalStatus || null,
      occupation: cleaned.occupation || null,
    })
    .select()
    .single();

  if (patientError || !patient) {
    throw new Error(patientError?.message || "Failed to create patient record.");
  }

  const { data: appointment, error: apptError } = await db
    .from("appointments")
    .insert({
      patient_id: patient.id,
      service: cleaned.service,
      requested_date: cleaned.requestedDate,
      requested_time: cleaned.requestedTime || null,
      special_instructions: cleaned.specialInstructions || null,
      status: "Pending",
      payment_status: cleaned.paymentStatus,
    })
    .select()
    .single();

  if (apptError || !appointment) {
    throw new Error(apptError?.message || "Failed to create appointment.");
  }

  try {
    await sendNewBookingAlert({
      patientName: `${cleaned.firstName} ${cleaned.lastName}`,
      service: cleaned.service,
      date: cleaned.requestedDate,
      time: cleaned.requestedTime || undefined,
      phone: cleaned.phoneMobile,
      email: cleaned.email,
      address: cleaned.address,
      appointmentId: appointment.id,
    });
  } catch (emailErr) {
    console.error("Admin email send failed:", emailErr);
  }

  try {
    await sendBookingReceivedEmail({
      patientName: `${cleaned.firstName} ${cleaned.lastName}`,
      patientEmail: cleaned.email,
      service: cleaned.service,
      date: cleaned.requestedDate,
      time: cleaned.requestedTime || undefined,
      address: cleaned.address,
      appointmentId: appointment.id,
    });
  } catch (emailErr) {
    console.error("Patient confirmation email failed:", emailErr);
  }

  const { error: auditError } = await db.from("audit_logs").insert({
    user_email: cleaned.email,
    action: "Appointment Submitted",
    details: `${cleaned.firstName} ${cleaned.lastName} requested ${cleaned.service} on ${cleaned.requestedDate}${cleaned.requestedTime ? ` at ${cleaned.requestedTime}` : ""} (Appointment ID: ${appointment.id})`,
  });

  if (auditError) {
    console.error("Audit log failed:", auditError);
  }

  return {
    success: true,
    appointmentId: appointment.id,
  };
}