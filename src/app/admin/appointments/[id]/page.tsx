"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const statusColor: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-teal-100 text-teal-700",
  Declined: "bg-red-100 text-red-700",
  Completed: "bg-gray-100 text-gray-600",
  Cancelled: "bg-gray-100 text-gray-500",
};

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [appt, setAppt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("appointments")
        .select("*, patients(*)")
        .eq("id", id)
        .single();
      if (data) {
        setAppt(data);
        setNotes(data.notes || "");
        setPaymentStatus(data.payment_status || "Unpaid");
        setDeclineReason(data.decline_reason || "");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const updateStatus = async (status: string, reason?: string) => {
    setSaving(true);
    await supabase.from("appointments").update({
      status,
      decline_reason: reason || null,
      notes,
      payment_status: paymentStatus,
    }).eq("id", id);
  
    // Send email to patient
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason, appointmentId: id }),
      });
      if (!res.ok) console.error("Notify failed");
    } catch (e) {
      console.error("Notify error:", e);
    }
  
    setAppt((a: any) => ({ ...a, status, decline_reason: reason || null }));
    setShowDeclineForm(false);
    setSuccessMsg(`Status updated to ${status}`);
    setTimeout(() => setSuccessMsg(""), 3000);
    setSaving(false);
  };

  const saveNotes = async () => {
    setSaving(true);
    await supabase.from("appointments").update({ notes, payment_status: paymentStatus }).eq("id", id);
    setSuccessMsg("Notes saved");
    setTimeout(() => setSuccessMsg(""), 3000);
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!appt) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Appointment not found.</p>
    </div>
  );

  const p = appt.patients;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/admin" className="text-teal-300 hover:text-white transition-colors">Dashboard</Link>
          <span className="text-teal-500">/</span>
          <Link href="/admin/appointments" className="text-teal-300 hover:text-white transition-colors">Appointments</Link>
          <span className="text-teal-500">/</span>
          <span className="font-semibold">{p?.first_name} {p?.last_name}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[appt.status]}`}>
          {appt.status}
        </span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {successMsg && (
          <div className="bg-teal-50 border border-teal-200 text-teal-700 px-5 py-3 rounded-xl text-sm font-medium">
            ✓ {successMsg}
          </div>
        )}

        {/* Action Buttons */}
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
                <label className="block text-sm font-medium text-red-700 mb-2">Reason for declining <span className="text-red-500">*</span></label>
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
                  <button onClick={() => setShowDeclineForm(false)} className="border border-gray-200 text-gray-600 font-semibold px-5 py-2.5 rounded-xl hover:border-gray-300 transition-all text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status change for approved */}
        {(appt.status === "Approved" || appt.status === "Completed") && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Update Status</h2>
            <div className="flex flex-wrap gap-3">
              {appt.status === "Approved" && (
                <button onClick={() => updateStatus("Completed")} disabled={saving} className="bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-all text-sm disabled:opacity-60">
                  Mark as Completed
                </button>
              )}
              <button onClick={() => updateStatus("Cancelled")} disabled={saving} className="border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:border-red-300 hover:text-red-600 transition-all text-sm disabled:opacity-60">
                Cancel Appointment
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Info */}
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
              ].map(([label, val]) => val ? (
                <div key={label} className="flex gap-3">
                  <span className="text-gray-400 w-28 shrink-0">{label}</span>
                  <span className="text-gray-800 font-medium">{val}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Appointment Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">Appointment Details</h2>
            <div className="space-y-3 text-sm">
              {[
                ["Service", appt.service],
                ["Requested Date", appt.requested_date],
                ["Requested Time", appt.requested_time],
                ["Special Instructions", appt.special_instructions],
                ["Submitted", new Date(appt.created_at).toLocaleString()],
              ].map(([label, val]) => val ? (
                <div key={label} className="flex gap-3">
                  <span className="text-gray-400 w-36 shrink-0">{label}</span>
                  <span className="text-gray-800 font-medium">{val}</span>
                </div>
              ) : null)}
            </div>

            {appt.status === "Declined" && appt.decline_reason && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs font-semibold text-red-700 mb-1">Decline Reason</p>
                <p className="text-red-600 text-sm">{appt.decline_reason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes & Payment */}
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
          <button onClick={saveNotes} disabled={saving} className="bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-700 transition-all text-sm disabled:opacity-60">
            {saving ? "Saving..." : "Save Notes"}
          </button>
        </div>

      </div>
    </div>
  );
}