"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type StoredFile = {
  id: string;
  bucket: string;
  path: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  document_type: string | null;
  notes: string | null;
  patient_id: string | null;
  appointment_id: string | null;
  created_at: string;
};

type PatientOption = {
  id: string;
  first_name: string | null;
  last_name: string | null;
};

type AppointmentOption = {
  id: string;
  patient_id: string | null;
  service: string | null;
  requested_date: string | null;
  patients: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

const BUCKETS = [
  { value: "patient-docs", label: "Patient Documents" },
  { value: "requisitions", label: "Requisitions" },
  { value: "results", label: "Results" },
];

const DOC_TYPES = [
  "General Document",
  "Lab Result",
  "Requisition",
  "Consent Form",
  "Invoice",
  "Other",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function formatBytes(bytes?: number | null) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatPatientName(patient?: { first_name: string | null; last_name: string | null } | null) {
  if (!patient) return "Unknown patient";
  return `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || "Unknown patient";
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getDefaultDocType(selectedBucket: string) {
  if (selectedBucket === "requisitions") return "Requisition";
  if (selectedBucket === "results") return "Lab Result";
  return "General Document";
}

export default function FilesPage() {
  const supabase = useMemo(() => createClient(), []);

  const [bucket, setBucket] = useState("patient-docs");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("General Document");
  const [notes, setNotes] = useState("");
  const [patientId, setPatientId] = useState("");
  const [appointmentId, setAppointmentId] = useState("");

  const [files, setFiles] = useState<StoredFile[]>([]);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [appointments, setAppointments] = useState<AppointmentOption[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadFiles(activeBucket = bucket) {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("bucket", activeBucket)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LOAD FILES TABLE ERROR:", error);
      setFiles([]);
      setErrorMessage(error.message || "Could not load file records.");
      setLoading(false);
      return;
    }

    setFiles((data || []) as StoredFile[]);
    setLoading(false);
  }

  async function loadOptions() {
    setLoadingOptions(true);

    const { data: patientData, error: patientError } = await supabase
      .from("patients")
      .select("id, first_name, last_name")
      .order("first_name", { ascending: true });

    if (patientError) {
      console.error("LOAD PATIENTS ERROR:", patientError);
    } else {
      setPatients((patientData || []) as PatientOption[]);
    }

    const { data: appointmentData, error: appointmentError } = await supabase
      .from("appointments")
      .select("id, patient_id, service, requested_date, patients(first_name, last_name)")
      .order("created_at", { ascending: false })
      .limit(200);

    if (appointmentError) {
      console.error("LOAD APPOINTMENTS ERROR:", appointmentError);
    } else {
      setAppointments((appointmentData || []) as unknown as AppointmentOption[]);
    }

    setLoadingOptions(false);
  }

  useEffect(() => {
    loadFiles(bucket);
  }, [bucket]);

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    setAppointmentId("");
  }, [patientId]);

  useEffect(() => {
    setDocumentType(getDefaultDocType(bucket));
  }, [bucket]);

  const filteredAppointmentOptions = patientId
    ? appointments.filter((appt) => appt.patient_id === patientId)
    : appointments;

  const filteredFiles = files.filter((file) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      file.file_name.toLowerCase().includes(q) ||
      (file.document_type || "").toLowerCase().includes(q) ||
      (file.notes || "").toLowerCase().includes(q) ||
      file.bucket.toLowerCase().includes(q)
    );
  });

  function validateSelectedFile(file: File | null) {
    if (!file) return "Please choose a file first.";
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File is too large. Maximum allowed size is ${formatBytes(MAX_FILE_SIZE_BYTES)}.`;
    }
    return null;
  }

  async function handleUpload() {
    const validationError = validateSelectedFile(selectedFile);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setUploading(true);
    setMessage(null);
    setErrorMessage(null);

    const safeName = (selectedFile?.name || "file")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    const patientPrefix = patientId || "unassigned";
    const filePath = `${patientPrefix}/${Date.now()}-${safeName}`;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("GET USER ERROR:", userError);
      setErrorMessage(userError.message || "Could not verify current user.");
      setUploading(false);
      return;
    }

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, selectedFile!, {
      cacheControl: "3600",
      upsert: false,
      contentType: selectedFile?.type || "application/octet-stream",
    });

    if (uploadError) {
      console.error("UPLOAD ERROR:", uploadError);
      setErrorMessage(uploadError.message || "Upload failed.");
      setUploading(false);
      return;
    }

    const { error: insertError } = await supabase.from("files").insert({
      bucket,
      path: filePath,
      file_name: selectedFile?.name || "Unnamed file",
      file_type: selectedFile?.type || null,
      file_size: selectedFile?.size || null,
      document_type: documentType,
      notes: notes.trim() || null,
      patient_id: patientId || null,
      appointment_id: appointmentId || null,
      uploaded_by: user?.id || null,
    });

    if (insertError) {
      console.error("FILES TABLE INSERT ERROR:", insertError);
      setErrorMessage(insertError.message || "File uploaded, but metadata save failed.");
      setUploading(false);
      return;
    }

    setMessage("File uploaded and saved successfully.");
    setSelectedFile(null);
    setNotes("");
    setPatientId("");
    setAppointmentId("");
    setDocumentType(getDefaultDocType(bucket));

    const input = document.getElementById("file-upload-input") as HTMLInputElement | null;
    if (input) input.value = "";

    await loadFiles(bucket);
    setUploading(false);
  }

  async function handleOpen(file: StoredFile) {
    setMessage(null);
    setErrorMessage(null);

    const { data, error } = await supabase.storage.from(file.bucket).createSignedUrl(file.path, 60);

    if (error || !data?.signedUrl) {
      console.error("SIGNED URL ERROR:", error);
      setErrorMessage(error?.message || "Could not open file.");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-teal-300 hover:text-white text-sm transition-colors">
            ← Dashboard
          </Link>
          <span className="text-teal-500">/</span>
          <span className="font-semibold">Files</span>
        </div>

        <Link
          href="/admin/patients"
          className="text-teal-200 hover:text-white text-sm transition-colors"
        >
          Patients →
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-bold text-2xl text-gray-800">File Uploads</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload and manage patient documents, requisitions, and results.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select
              value={bucket}
              onChange={(e) => setBucket(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {BUCKETS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>

            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {DOC_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input
              id="file-upload-input"
              type="file"
              onChange={(e) => {
                setMessage(null);
                setErrorMessage(null);
                setSelectedFile(e.target.files?.[0] || null);
              }}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white"
            />

            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={loadingOptions}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select patient (optional)</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {formatPatientName(patient)}
                </option>
              ))}
            </select>

            <select
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              disabled={loadingOptions}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select appointment (optional)</option>
              {filteredAppointmentOptions.map((appt) => (
                <option key={appt.id} value={appt.id}>
                  {formatPatientName(appt.patients)} — {appt.service || "No service"} —{" "}
                  {appt.requested_date || "No date"}
                </option>
              ))}
            </select>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />

            <div className="text-xs text-gray-400">
              Max file size: {formatBytes(MAX_FILE_SIZE_BYTES)}. Selected bucket: {bucket}.
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <p className="text-sm text-gray-500">
            Bucket: <span className="font-medium text-gray-700">{bucket}</span>
          </p>

          <input
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-72 bg-white"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
            <div className="space-y-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-xl" />
                ))}
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="text-4xl mb-3">📁</div>
            <p className="font-semibold text-gray-600 mb-1">No files found</p>
            <p className="text-gray-400 text-sm">Upload the first document to this bucket.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left border-b border-gray-100">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      File
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Type
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Size
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800 text-sm">{file.file_name}</p>
                        <p className="text-xs text-gray-400">{file.notes || "No notes"}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {file.document_type || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatBytes(file.file_size)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(file.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpen(file)}
                          className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
                        >
                          Open →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}