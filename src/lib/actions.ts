"use server";

import { createClient } from "@supabase/supabase-js";
import { sendNewBookingAlert } from "@/lib/email";

export async function submitAppointment(data: {
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
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const db = createClient(url, key);

  const { data: patient, error: patientError } = await db
    .from("patients")
    .insert({
      first_name: data.firstName,
      middle_name: data.middleName || null,
      last_name: data.lastName,
      date_of_birth: data.dateOfBirth,
      gender: data.gender,
      phone_home: data.phoneHome || null,
      phone_mobile: data.phoneMobile,
      email: data.email,
      address: data.address,
      national_insurance: data.nationalInsurance || null,
      marital_status: data.maritalStatus || null,
      occupation: data.occupation || null,
    })
    .select()
    .single();

  if (patientError) throw new Error(patientError.message);

  const { data: appointment, error: apptError } = await db
    .from("appointments")
    .insert({
      patient_id: patient.id,
      service: data.service,
      requested_date: data.requestedDate,
      requested_time: data.requestedTime || null,
      special_instructions: data.specialInstructions || null,
      status: "Pending",
      payment_status: data.paymentStatus || "Unpaid",
    })
    .select()
    .single();

  if (apptError) throw new Error(apptError.message);

  // Send admin notification email
  try {
    await sendNewBookingAlert({
      patientName: `${data.firstName} ${data.lastName}`,
      service: data.service,
      date: data.requestedDate,
      time: data.requestedTime,
      phone: data.phoneMobile,
      email: data.email,
      address: data.address,
      appointmentId: appointment.id,
    });
  } catch (emailErr) {
    console.error("Email send failed:", emailErr);
    // Don't block the booking if email fails
  }

  await db.from("audit_logs").insert({
    user_email: data.email,
    action: "Appointment Submitted",
    details: `${data.firstName} ${data.lastName} requested ${data.service} on ${data.requestedDate}`,
  });

  return { success: true, appointmentId: appointment.id };
}