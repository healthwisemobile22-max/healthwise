"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type PatientRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone_mobile: string | null;
  email: string | null;
  created_at: string | null;
};

type AppointmentRow = {
  id: string;
  patient_id: string | null;
  service: string | null;
  status: string | null;
  requested_date: string | null;
  requested_time: string | null;
  created_at: string | null;
};

type PatientCard = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  createdAt: string | null;
  appointmentCount: number;
  lastAppointmentDate: string | null;
  lastAppointmentStatus: string | null;
};

const statusColor: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-teal-100 text-teal-700",
  Declined: "bg-red-100 text-red-700",
  Completed: "bg-gray-100 text-gray-700",
  Cancelled: "bg-gray-100 text-gray-500",
};

function formatDate(date: string | null) {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-BS", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PatientsContent() {
  const supabase = useMemo(() => createClient(), []);

  const [patients, setPatients] = useState<PatientCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      const [
        { data: patientData, error: patientError },
        { data: appointmentData, error: appointmentError },
      ] = await Promise.all([
        supabase
          .from("patients")
          .select("id, first_name, last_name, phone_mobile, email, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("appointments")
          .select("id, patient_id, service, status, requested_date, requested_time, created_at")
          .order("created_at", { ascending: false }),
      ]);

      if (patientError) {
        console.error("LOAD PATIENTS ERROR:", patientError);
        setLoading(false);
        return;
      }

      if (appointmentError) {
        console.error("LOAD APPOINTMENTS ERROR:", appointmentError);
        setLoading(false);
        return;
      }

      const appointmentsByPatient = new Map<string, AppointmentRow[]>();

      (appointmentData || []).forEach((appt) => {
        if (!appt.patient_id) return;
        const current = appointmentsByPatient.get(appt.patient_id) || [];
        current.push(appt as AppointmentRow);
        appointmentsByPatient.set(appt.patient_id, current);
      });

      const patientCards: PatientCard[] = (patientData || []).map((patient: PatientRow) => {
        const patientAppointments = appointmentsByPatient.get(patient.id) || [];

        const latestAppointment = [...patientAppointments].sort((a, b) => {
          const aTime = new Date(a.created_at || a.requested_date || 0).getTime();
          const bTime = new Date(b.created_at || b.requested_date || 0).getTime();
          return bTime - aTime;
        })[0];

        const firstName = patient.first_name?.trim() || "";
        const lastName = patient.last_name?.trim() || "";
        const fullName = `${firstName} ${lastName}`.trim() || "Unnamed Patient";

        return {
          id: patient.id,
          fullName,
          firstName,
          lastName,
          phone: patient.phone_mobile || "—",
          email: patient.email || "—",
          createdAt: patient.created_at,
          appointmentCount: patientAppointments.length,
          lastAppointmentDate:
            latestAppointment?.requested_date || latestAppointment?.created_at || null,
          lastAppointmentStatus: latestAppointment?.status || null,
        };
      });

      setPatients(patientCards);
      setLoading(false);
    }

    load();
  }, [supabase]);

  const filteredPatients = patients.filter((patient) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      patient.fullName.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      patient.phone.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-teal-300 hover:text-white text-sm transition-colors"
          >
            ← Dashboard
          </Link>
          <span className="text-teal-500">/</span>
          <span className="font-semibold">Patients</span>
        </div>

        <Link
          href="/admin/appointments"
          className="text-teal-200 hover:text-white text-sm transition-colors"
        >
          View Appointments →
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-bold text-2xl text-gray-800">Patients</h1>
            <p className="text-sm text-gray-500 mt-1">
              View patient records and recent appointment activity.
            </p>
          </div>

          <input
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-72 bg-white"
            placeholder="Search name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-44 bg-white rounded-2xl border border-gray-100 animate-pulse"
                />
              ))}
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="text-4xl mb-3">🧑‍⚕️</div>
            <p className="font-semibold text-gray-600 mb-1">No patients found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h2 className="font-semibold text-gray-800 text-lg leading-tight">
                        {patient.fullName}
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">
                        Patient since {formatDate(patient.createdAt)}
                      </p>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700">
                      {patient.appointmentCount} appointment
                      {patient.appointmentCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400">Email</p>
                      <p className="text-sm text-gray-700 break-all">{patient.email}</p>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400">Phone</p>
                      <p className="text-sm text-gray-700">{patient.phone}</p>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400">
                        Latest appointment
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p className="text-sm text-gray-700">
                          {formatDate(patient.lastAppointmentDate)}
                        </p>
                        {patient.lastAppointmentStatus ? (
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              statusColor[patient.lastAppointmentStatus] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {patient.lastAppointmentStatus}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/admin/patients/${patient.id}`}
                      className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      View patient record →
                    </Link>

                    <Link
                      href={`/admin/appointments?patient=${encodeURIComponent(patient.fullName)}`}
                      className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      View related appointments →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-400">
                Showing {filteredPatients.length} of {patients.length} patients
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      }
    >
      <PatientsContent />
    </Suspense>
  );
}