"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const timeSlots = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

type AppointmentData = {
  id: string;
  status: string | null;
  service: string | null;
  requested_date: string | null;
  requested_time: string | null;
  reschedule_requested_date?: string | null;
  reschedule_requested_time?: string | null;
  reschedule_reason?: string | null;
  cancelled_at?: string | null;
  cancelled_reason?: string | null;
  patient: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone_mobile: string | null;
    address: string | null;
  };
};

export default function ManageBookingPage() {
  const [appointmentId, setAppointmentId] = useState("");
  const [email, setEmail] = useState("");
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");

  const lookup = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setAppointment(null);

    try {
      const res = await fetch("/api/manage-booking/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointmentId.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to find booking.");
      }

      setAppointment(data.appointment);
    } catch (err: any) {
      setError(err.message || "Unable to find booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!appointment) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/manage-booking/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          appointmentId: appointment.id,
          email: email.trim().toLowerCase(),
          reason: cancelReason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to cancel appointment.");
      }

      setSuccess("Your appointment has been cancelled.");
      setAppointment((prev) =>
        prev
          ? {
              ...prev,
              status: "Cancelled",
              cancelled_reason: cancelReason.trim() || null,
              cancelled_at: new Date().toISOString(),
            }
          : prev
      );
    } catch (err: any) {
      setError(err.message || "Unable to cancel appointment.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!appointment) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/manage-booking/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reschedule",
          appointmentId: appointment.id,
          email: email.trim().toLowerCase(),
          requestedDate: rescheduleDate,
          requestedTime: rescheduleTime,
          reason: rescheduleReason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to submit reschedule request.");
      }

      setSuccess("Your reschedule request has been submitted.");
      setAppointment((prev) =>
        prev
          ? {
              ...prev,
              reschedule_requested_date: rescheduleDate,
              reschedule_requested_time: rescheduleTime || null,
              reschedule_reason: rescheduleReason.trim() || null,
            }
          : prev
      );
    } catch (err: any) {
      setError(err.message || "Unable to submit reschedule request.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-yellow-600 font-semibold text-sm uppercase tracking-widest mb-1">
              Patient Self-Service
            </p>
            <h1 className="font-bold text-3xl text-teal-800">Manage Your Booking</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Enter your appointment reference and email address to cancel or request a new date.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-700 text-sm">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Appointment Reference
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  placeholder="Paste your reference number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={lookup}
                disabled={loading}
                className="bg-teal-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-teal-700 transition-all text-sm disabled:opacity-60"
              >
                {loading ? "Looking up..." : "Find Booking"}
              </button>
            </div>
          </div>

          {appointment && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="font-bold text-lg text-gray-800 mb-4">Appointment Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-gray-500 mb-1">Patient</span>
                    <span className="font-medium text-gray-800">
                      {appointment.patient.first_name} {appointment.patient.last_name}
                    </span>
                  </div>

                  <div>
                    <span className="block text-gray-500 mb-1">Status</span>
                    <span className="font-medium text-gray-800">{appointment.status}</span>
                  </div>

                  <div>
                    <span className="block text-gray-500 mb-1">Service</span>
                    <span className="font-medium text-gray-800">{appointment.service}</span>
                  </div>

                  <div>
                    <span className="block text-gray-500 mb-1">Date</span>
                    <span className="font-medium text-gray-800">{appointment.requested_date}</span>
                  </div>

                  <div>
                    <span className="block text-gray-500 mb-1">Time</span>
                    <span className="font-medium text-gray-800">
                      {appointment.requested_time || "Any time"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-gray-500 mb-1">Visit Address</span>
                    <span className="font-medium text-gray-800">{appointment.patient.address}</span>
                  </div>
                </div>

                {appointment.reschedule_requested_date && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="font-semibold text-yellow-800 text-sm mb-1">
                      Pending Reschedule Request
                    </p>
                    <p className="text-yellow-700 text-sm">
                      Requested for {appointment.reschedule_requested_date}
                      {appointment.reschedule_requested_time
                        ? ` at ${appointment.reschedule_requested_time}`
                        : " (any time)"}
                    </p>
                    {appointment.reschedule_reason && (
                      <p className="text-yellow-700 text-sm mt-1">
                        Reason: {appointment.reschedule_reason}
                      </p>
                    )}
                  </div>
                )}

                {appointment.status === "Cancelled" && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="font-semibold text-red-800 text-sm mb-1">
                      This appointment has been cancelled
                    </p>
                    {appointment.cancelled_reason && (
                      <p className="text-red-700 text-sm">
                        Reason: {appointment.cancelled_reason}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {appointment.status !== "Cancelled" && (
                <>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="font-bold text-lg text-gray-800 mb-4">Cancel Appointment</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Reason for cancellation (optional)
                        </label>
                        <textarea
                          rows={4}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="Tell us why you need to cancel..."
                        />
                      </div>

                      <button
                        onClick={handleCancel}
                        disabled={actionLoading}
                        className="bg-red-500 text-white font-semibold px-8 py-3 rounded-xl hover:bg-red-600 transition-all text-sm disabled:opacity-60"
                      >
                        {actionLoading ? "Processing..." : "Cancel Appointment"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="font-bold text-lg text-gray-800 mb-4">Request a New Date</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          New Preferred Date
                        </label>
                        <input
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={rescheduleDate}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          New Preferred Time
                        </label>
                        <select
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                          value={rescheduleTime}
                          onChange={(e) => setRescheduleTime(e.target.value)}
                        >
                          <option value="">Any time</option>
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Reason for rescheduling (optional)
                      </label>
                      <textarea
                        rows={4}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        value={rescheduleReason}
                        onChange={(e) => setRescheduleReason(e.target.value)}
                        placeholder="Tell us why you need a different time..."
                      />
                    </div>

                    <button
                      onClick={handleReschedule}
                      disabled={actionLoading}
                      className="bg-teal-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-teal-700 transition-all text-sm disabled:opacity-60"
                    >
                      {actionLoading ? "Submitting..." : "Submit Reschedule Request"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}