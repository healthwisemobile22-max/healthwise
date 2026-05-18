"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const statusColor: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-teal-100 text-teal-700",
  Declined: "bg-red-100 text-red-700",
  Completed: "bg-gray-100 text-gray-600",
  Cancelled: "bg-gray-100 text-gray-500",
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

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const supabase = useMemo(() => createClient(), []);

  const [appt, setAppt] = useState<any>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [notes, setNotes] = useState("");
  const [savedNotePreview, setSavedNotePreview] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [successMsg, setSuccessMsg] = useState("");
  const [authError, setAuthError] = useState("");

  const refreshAppointment = async () => {
    const appointmentId = Array.isArray(id) ? id[0] : id;

    const [{ data, error }, { data: fileData, error: fileError }] = await Promise.all([
      supabase
        .from("appointments")
        .select("*, patients(*)")
        .eq("id", appointmentId)
        .single(),
      supabase
        .from("files")
        .select("id, bucket, path, file_name, document_type, notes, created_at, file_size")
        .eq("appointment_id", appointmentId)
        .order("created_at", { ascending: false }),
    ]);

    if (!error && data) {
      setAppt(data);
      setNotes(data.notes || "");
      setSavedNotePreview(data.notes || "");
      setPaymentStatus(data.payment_status || "Unpaid");
      setDeclineReason(data.decline_reason || "");
    }

    if (fileError) {
      console.error("LOAD APPOINTMENT FILES ERROR:", fileError);
      setFiles([]);
    } else {
      setFiles((fileData as FileRecord[]) || []);
    }
  };

  useEffect(() => {
    async function load() {
      await refreshAppointment();
      setLoading(false);
    }

    load();
  }, [id]);

  const handleUnauthorized = (status: number) => {
    const msg =
      status === 401
        ? "Your admin session has expired. Redirecting to login..."
        : "You are signed in, but this account is not allowed to perform admin actions.";

    setAuthError(msg);

    if (status === 401) {
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    }
  };

  const postAdmin = async (url: string, body: any) => {
    setAuthError("");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 401 || res.status === 403) {
      handleUnauthorized(res.status);
      return { ok: false, authBlocked: true, data: null };
    }

    const data = await res.json();
    return { ok: res.ok && data.ok, authBlocked: false, data };
  };

  const updateStatus = async (status: string, reason?: string) => {
    setSaving(true);
    try {
      const result = await postAdmin("/api/admin/update-status", {
        appointmentId: id,
        status,
        reason,
        notes,
        paymentStatus,
      });

      if (result.authBlocked) return;
      if (!result.ok) throw new Error(result.data?.error || "Failed to update status.");

      await refreshAppointment();
      setShowDeclineForm(false);
      setSuccessMsg(`Status updated to ${status}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e: any) {
      setSuccessMsg(e.message || "Update failed");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      const result = await postAdmin("/api/admin/save-notes", {
        appointmentId: id,
        notes,
        paymentStatus,
      });

      if (result.authBlocked) return;
      if (!result.ok) throw new Error(result.data?.error || "Failed to save notes.");

      await refreshAppointment();
      setSuccessMsg("Notes saved");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e: any) {
      setSuccessMsg(e.message || "Save failed");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const acceptReschedule = async () => {
    setSaving(true);
    try {
      const result = await postAdmin("/api/admin/accept-reschedule", {
        appointmentId: id,
      });

      if (result.authBlocked) return;
      if (!result.ok) throw new Error(result.data?.error || "Failed to accept reschedule.");

      setAppt((a: any) => ({
        ...a,
        requested_date: result.data.newDate,
        requested_time: result.data.newTime || a.requested_time,
        reschedule_requested_date: null,
        reschedule_requested_time: null,
        reschedule_reason: null,
        reminder_sent_at: null,
        same_day_reminder_sent_at: null,
      }));

      setSuccessMsg("Reschedule accepted and patient notified.");
      setTimeout(() => setSuccessMsg(""), 4000);
      await refreshAppointment();
    } catch (err: any) {
      setSuccessMsg(err.message || "Something went wrong.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  const markCompleted = async () => {
    setSaving(true);
    try {
      const result = await postAdmin("/api/admin/complete", {
        appointmentId: id,
      });

      if (result.authBlocked) return;
      if (!result.ok) throw new Error(result.data?.error || "Failed to mark completed.");

      await refreshAppointment();
      setSuccessMsg("Appointment marked completed.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setSuccessMsg(err.message || "Something went wrong.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const cancelAppointment = async () => {
    setSaving(true);
    try {
      const result = await postAdmin("/api/admin/cancel", {
        appointmentId: id,
      });

      if (result.authBlocked) return;
      if (!result.ok) throw new Error(result.data?.error || "Failed to cancel appointment.");

      await refreshAppointment();
      setSuccessMsg("Appointment cancelled.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setSuccessMsg(err.message || "Something went wrong.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  async function handleOpen(file: FileRecord) {
    const { data, error } = await supabase.storage.from(file.bucket).createSignedUrl(file.path, 60);

    if (error || !data?.signedUrl) {
      setSuccessMsg(error?.message || "Could not open file.");
      setTimeout(() => setSuccessMsg(""), 3000);
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );

  if (!appt)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Appointment not found.</p>
      </div>
    );

  const p = appt.patients;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/admin" className="text-teal-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          <span className="text-teal-500">/</span>
          <Link href="/admin/appointments" className="text-teal-300 hover:text-white transition-colors">
            Appointments
          </Link>
          <span className="text-teal-500">/</span>
          <span className="font-semibold">
            {p?.first_name} {p?.last_name}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[appt.status]}`}>
          {appt.status}
        </span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm font-medium">
            {authError}
          </div>
        )}

        {successMsg && (
          <div className="bg-teal-50 border border-teal-200 text-teal-700 px-5 py-3 rounded-xl text-sm font-medium">
            ✓ {successMsg}
          </div>
        )}

        {appt.reschedule_requested_date && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-bold text-yellow-800 mb-1">Pending Reschedule Request</h2>
                <p className="text-yellow-700 text-sm">
                  Patient has requested to move this appointment to{" "}
                  <strong>{appt.reschedule_requested_date}</strong>
                  {appt.reschedule_requested_time ? (
                    <>
                      {" "}
                      at <strong>{appt.reschedule_requested_time}</strong>
                    </>
                  ) : (
                    " (any time)"
                  )}
                  .
                </p>
                {appt.reschedule_reason && (
                  <p className="text-yellow-700 text-sm mt-1">Reason: {appt.reschedule_reason}</p>
                )}
              </div>
              <button
                onClick={acceptReschedule}
                disabled={saving}
                className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-all text-sm disabled:opacity-60 shrink-0"
              >
                ✓ Accept Reschedule
              </button>
            </div>
          </div>
        )}

        {appt.status === "Pending" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Review This Appointment</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => updateStatus("Approved")}
                disabled={saving}
                className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-all text-sm disabled:opacity-60"
              >
                ✓ Approve Appointment
              </button>
              <button
                onClick={() => setShowDeclineForm(true)}
                disabled={saving}
                className="bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition-all text-sm disabled:opacity-60"
              >
                ✕ Decline Appointment
              </button>
            </div>

            {showDeclineForm && (
              <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Reason for declining <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-red-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none bg-white"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g. Outside service area, date unavailable, missing requisition..."
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => updateStatus("Declined", declineReason)}
                    disabled={!declineReason || saving}
                    className="bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-red-600 transition-all text-sm disabled:opacity-60"
                  >
                    Confirm Decline
                  </button>
                  <button
                    onClick={() => setShowDeclineForm(false)}
                    className="border border-gray-200 text-gray-600 font-semibold px-5 py-2.5 rounded-xl hover:border-gray-300 transition-all text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {(appt.status === "Approved" || appt.status === "Completed") && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Update Status</h2>
            <div className="flex flex-wrap gap-3">
              {appt.status === "Approved" && (
                <button
                  onClick={markCompleted}
                  disabled={saving}
                  className="bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-all text-sm disabled:opacity-60"
                >
                  Mark as Completed
                </button>
              )}
              <button
                onClick={cancelAppointment}
                disabled={saving}
                className="border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:border-red-300 hover:text-red-600 transition-all text-sm disabled:opacity-60"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">Patient Information</h2>
            <div className="space-y-3 text-sm">
              {[
                ["Name", `${p?.first_name} ${p?.middle_name || ""} ${p?.last_name}`],
                ["Date of Birth", p?.date_of_birth],
                ["Gender", p?.gender],
                ["Mobile", p?.phone_mobile],
                ["Home Phone", p?.phone_home],
                ["Email", p?.email],
                ["Address", p?.address],
                ["NI Number", p?.national_insurance],
                ["Marital Status", p?.marital_status],
                ["Occupation", p?.occupation],
              ].map(([label, val]) =>
                val ? (
                  <div key={label} className="flex gap-3">
                    <span className="text-gray-400 w-28 shrink-0">{label}</span>
                    <span className="text-gray-800 font-medium">{val}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">Appointment Details</h2>
            <div className="space-y-3 text-sm">
              {[
                ["Service", appt.service],
                ["Requested Date", appt.requested_date],
                ["Requested Time", appt.requested_time],
                ["Special Instructions", appt.special_instructions],
                ["Submitted", new Date(appt.created_at).toLocaleString()],
              ].map(([label, val]) =>
                val ? (
                  <div key={label} className="flex gap-3">
                    <span className="text-gray-400 w-36 shrink-0">{label}</span>
                    <span className="text-gray-800 font-medium">{val}</span>
                  </div>
                ) : null
              )}
            </div>

            {appt.status === "Declined" && appt.decline_reason && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs font-semibold text-red-700 mb-1">Decline Reason</p>
                <p className="text-red-600 text-sm">{appt.decline_reason}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Admin Notes & Payment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Status</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option>Unpaid</option>
                <option>Deposit Paid</option>
                <option>Paid</option>
                <option>Waived</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Internal Notes</label>
            <textarea
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any internal notes about this appointment..."
            />
          </div>

          <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Saved Note Preview
            </p>
            {savedNotePreview ? (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{savedNotePreview}</p>
            ) : (
              <p className="text-sm text-gray-400">No saved internal note yet.</p>
            )}
          </div>

          <button
            onClick={saveNotes}
            disabled={saving}
            className="bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-700 transition-all text-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Notes"}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-bold text-gray-800">Linked Files</h2>
              <p className="text-sm text-gray-500 mt-1">
                Documents attached to this appointment.
              </p>
            </div>

            <Link
              href="/admin/files"
              className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              Upload file →
            </Link>
          </div>

          {files.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center">
              <p className="font-medium text-gray-600">No files linked yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Upload a file and select this appointment to attach it here.
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