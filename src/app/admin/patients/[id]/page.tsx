"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type PatientRecord = {
  id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  phone_mobile: string | null;
  phone_home: string | null;
  email: string | null;
  address: string | null;
  national_insurance: string | null;
  marital_status: string | null;
  occupation: string | null;
  created_at: string | null;
};

type AppointmentRecord = {
  id: string;
  service: string | null;
  status: string | null;
  requested_date: string | null;
  requested_time: string | null;
  created_at: string | null;
};

type FileRecord = {
  id: string;
  bucket: string;
  path: string;
  file_name: string;
  document_type: string | null;
  notes: string | null;
  created_at: string;
  file_size: number | null;
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

function formatDateTime(date: string | null) {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleString("en-BS", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatBytes(bytes?: number | null) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function PatientDetailPage() {
  const { id } = useParams();
  const supabase = useMemo(() => createClient(), []);

  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleOpen(file: FileRecord) {
    setErrorMessage("");

    const { data, error } = await supabase.storage.from(file.bucket).createSignedUrl(file.path, 60);

    if (error || !data?.signedUrl) {
      setErrorMessage(error?.message || "Could not open file.");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMessage("");

      const patientId = Array.isArray(id) ? id[0] : id;

      const [
        { data: patientData, error: patientError },
        { data: appointmentData, error: appointmentError },
        { data: fileData, error: fileError },
      ] = await Promise.all([
        supabase.from("patients").select("*").eq("id", patientId).single(),
        supabase
          .from("appointments")
          .select("id, service, status, requested_date, requested_time, created_at")
          .eq("patient_id", patientId)
          .order("created_at", { ascending: false }),
        supabase
          .from("files")
          .select("id, bucket, path, file_name, document_type, notes, created_at, file_size")
          .eq("patient_id", patientId)
          .order("created_at", { ascending: false }),
      ]);

      if (patientError) {
        console.error("LOAD PATIENT ERROR:", patientError);
        setErrorMessage(patientError.message || "Could not load patient.");
        setLoading(false);
        return;
      }

      if (appointmentError) {
        console.error("LOAD PATIENT APPOINTMENTS ERROR:", appointmentError);
      }

      if (fileError) {
        console.error("LOAD PATIENT FILES ERROR:", fileError);
      }

      setPatient((patientData as PatientRecord) || null);
      setAppointments((appointmentData as AppointmentRecord[]) || []);
      setFiles((fileData as FileRecord[]) || []);
      setLoading(false);
    }

    if (id) load();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center max-w-md w-full">
          <p className="text-gray-700 font-semibold mb-2">Patient not found</p>
          <p className="text-sm text-gray-400 mb-5">
            The patient record could not be loaded or may no longer exist.
          </p>
          <Link
            href="/admin/patients"
            className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            ← Back to patients
          </Link>
        </div>
      </div>
    );
  }

  const fullName =
    `${patient.first_name || ""} ${patient.middle_name || ""} ${patient.last_name || ""}`
      .replace(/\s+/g, " ")
      .trim() || "Unnamed Patient";

  const latestAppointment = appointments[0] || null;
  const completedCount = appointments.filter((appt) => appt.status === "Completed").length;
  const pendingCount = appointments.filter((appt) => appt.status === "Pending").length;

  const infoRows: Array<[string, string | null]> = [
    ["Date of Birth", patient.date_of_birth],
    ["Gender", patient.gender],
    ["Mobile", patient.phone_mobile],
    ["Home Phone", patient.phone_home],
    ["Email", patient.email],
    ["Address", patient.address],
    ["NI Number", patient.national_insurance],
    ["Marital Status", patient.marital_status],
    ["Occupation", patient.occupation],
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <Link href="/admin" className="text-teal-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          <span className="text-teal-500">/</span>
          <Link href="/admin/patients" className="text-teal-300 hover:text-white transition-colors">
            Patients
          </Link>
          <span className="text-teal-500">/</span>
          <span className="font-semibold">{fullName}</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/admin/appointments?patient=${encodeURIComponent(fullName)}`}
            className="text-teal-200 hover:text-white text-sm transition-colors"
          >
            View Appointments →
          </Link>
          <Link
            href="/admin/files"
            className="text-teal-200 hover:text-white text-sm transition-colors"
          >
            Upload Files →
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="font-bold text-2xl text-gray-800 mb-1">{fullName}</h1>
              <p className="text-sm text-gray-500">Patient since {formatDate(patient.created_at)}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {patient.phone_mobile ? (
                  <a
                    href={`tel:${patient.phone_mobile}`}
                    className="inline-flex items-center rounded-full bg-teal-50 text-teal-700 px-3 py-1.5 text-xs font-semibold"
                  >
                    {patient.phone_mobile}
                  </a>
                ) : null}

                {patient.email ? (
                  <a
                    href={`mailto:${patient.email}`}
                    className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1.5 text-xs font-semibold"
                  >
                    {patient.email}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              {[
                { label: "Appointments", value: appointments.length },
                { label: "Pending", value: pendingCount },
                { label: "Completed", value: completedCount },
                { label: "Files", value: files.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-[110px] rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
                    {item.label}
                  </p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
              Patient Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {infoRows.map(([label, value]) => (
                <div key={label}>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">{label}</p>
                  <p className="text-gray-800 font-medium break-words">{value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
              Latest Activity
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">
                  Latest appointment
                </p>
                {latestAppointment ? (
                  <>
                    <p className="font-medium text-gray-800">
                      {latestAppointment.service || "No service"}
                    </p>
                    <p className="text-gray-500 mt-1">
                      {formatDate(latestAppointment.requested_date)}
                      {latestAppointment.requested_time
                        ? ` at ${latestAppointment.requested_time}`
                        : ""}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          statusColor[latestAppointment.status || ""] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {latestAppointment.status || "Unknown"}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">No appointments found.</p>
                )}
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">
                  Latest file upload
                </p>
                {files[0] ? (
                  <>
                    <p className="font-medium text-gray-800">{files[0].file_name}</p>
                    <p className="text-gray-500 mt-1">{formatDateTime(files[0].created_at)}</p>
                  </>
                ) : (
                  <p className="text-gray-400">No files linked yet.</p>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href="/admin/files"
                  className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Upload file for this patient →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-bold text-gray-800">Appointments</h2>
              <p className="text-sm text-gray-500 mt-1">Recent activity and visit history.</p>
            </div>

            <Link
              href={`/admin/appointments?patient=${encodeURIComponent(fullName)}`}
              className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              View all appointments →
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center">
              <p className="font-medium text-gray-600">No appointments found</p>
              <p className="text-sm text-gray-400 mt-1">
                This patient does not have any recorded appointments yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 6).map((appt) => (
                <div
                  key={appt.id}
                  className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{appt.service || "No service"}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(appt.requested_date)}
                      {appt.requested_time ? ` at ${appt.requested_time}` : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Added {formatDateTime(appt.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        statusColor[appt.status || ""] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {appt.status || "Unknown"}
                    </span>

                    <Link
                      href={`/admin/appointments/${appt.id}`}
                      className="text-xs font-medium text-teal-600 hover:text-teal-700"
                    >
                      Open appointment →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-bold text-gray-800">Linked Files</h2>
              <p className="text-sm text-gray-500 mt-1">
                Documents uploaded for this patient.
              </p>
            </div>

            <Link
              href="/admin/files"
              className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              Upload another file →
            </Link>
          </div>

          {files.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center">
              <p className="font-medium text-gray-600">No files linked yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Upload a file and select this patient to attach it here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      File
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Bucket
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Type
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Size
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Uploaded
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {files.map((file) => (
                    <tr key={file.id}>
                      <td className="px-4 py-4">
                        <p className="font-medium text-sm text-gray-800">{file.file_name}</p>
                        <p className="text-xs text-gray-400 mt-1">{file.notes || "No notes"}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{file.bucket}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {file.document_type || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatBytes(file.file_size)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDateTime(file.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleOpen(file)}
                          className="text-sm font-medium text-teal-600 hover:text-teal-700"
                        >
                          Open →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}