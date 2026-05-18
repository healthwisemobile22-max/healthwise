"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Patient = {
  id?: string;
  first_name: string | null;
  last_name: string | null;
  phone_mobile: string | null;
  email: string | null;
};

type Appointment = {
  id: string;
  service: string | null;
  status: string | null;
  requested_date: string | null;
  requested_time: string | null;
  created_at: string | null;
  payment_status: string | null;
  patients: Patient | null;
};

const statusColor: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-teal-100 text-teal-700",
  Declined: "bg-red-100 text-red-700",
  Completed: "bg-gray-100 text-gray-600",
  Cancelled: "bg-gray-100 text-gray-500",
};

const paymentColor: Record<string, string> = {
  Paid: "text-teal-600",
  Pending: "text-yellow-600",
  Unpaid: "text-yellow-600",
  Refunded: "text-gray-500",
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

function formatPatientName(patient: Patient | null) {
  if (!patient) return "Unknown patient";
  const fullName = `${patient.first_name || ""} ${patient.last_name || ""}`.trim();
  return fullName || "Unknown patient";
}

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  const statusFilter = searchParams.get("status") || "All";
  const dateFilter = searchParams.get("date") || "";
  const patientFilter = searchParams.get("patient") || "";

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(patientFilter);
  const [activeStatus, setActiveStatus] = useState(statusFilter);

  useEffect(() => {
    setSearch(patientFilter);
  }, [patientFilter]);

  useEffect(() => {
    setActiveStatus(statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("appointments")
        .select(
          "id, service, status, requested_date, requested_time, created_at, payment_status, patient_id, patients(id, first_name, last_name, phone_mobile, email)"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("LOAD APPOINTMENTS ERROR:", error);
      }

      if (data) {
        setAppointments(data as unknown as Appointment[]);
      }

      setLoading(false);
    }

    load();
  }, [supabase]);

  function updateUrl(paramsToUpdate: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (!value || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  const filtered = appointments.filter((a) => {
    const matchStatus = activeStatus === "All" || a.status === activeStatus;
    const matchDate = !dateFilter || a.requested_date === dateFilter;

    const name = formatPatientName(a.patients).toLowerCase();
    const email = a.patients?.email?.toLowerCase() ?? "";
    const phone = a.patients?.phone_mobile?.toLowerCase() ?? "";
    const service = a.service?.toLowerCase() ?? "";
    const payment = a.payment_status?.toLowerCase() ?? "";
    const query = search.toLowerCase().trim();

    const matchSearch =
      !query ||
      name.includes(query) ||
      email.includes(query) ||
      phone.includes(query) ||
      service.includes(query) ||
      payment.includes(query);

    return matchStatus && matchDate && matchSearch;
  });

  const counts = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "Pending").length,
    approved: appointments.filter((a) => a.status === "Approved").length,
    completed: appointments.filter((a) => a.status === "Completed").length,
    declined: appointments.filter((a) => a.status === "Declined").length,
    cancelled: appointments.filter((a) => a.status === "Cancelled").length,
  };

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
          <span className="font-semibold">Appointments</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/patients"
            className="text-teal-200 hover:text-white text-sm transition-colors"
          >
            Patients
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-teal-200 hover:text-white text-sm transition-colors"
          >
            View Site ↗
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-bold text-2xl text-gray-800">All Appointments</h1>
            {patientFilter ? (
              <p className="text-sm text-gray-500 mt-1">
                Filtered by patient:{" "}
                <span className="font-medium text-gray-700">{patientFilter}</span>
              </p>
            ) : dateFilter ? (
              <p className="text-sm text-gray-500 mt-1">
                Filtered by date: <span className="font-medium text-gray-700">{dateFilter}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                Review, search, and manage incoming appointments.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full lg:w-auto">
            {[
              { label: "Total", value: counts.total },
              { label: "Pending", value: counts.pending },
              { label: "Approved", value: counts.approved },
              { label: "Completed", value: counts.completed },
              { label: "Declined", value: counts.declined },
              { label: "Cancelled", value: counts.cancelled },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
              >
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
                  {item.label}
                </p>
                <p className="text-lg font-bold text-gray-800 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
            <input
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              placeholder="Search patient, email, phone, service, or payment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => updateUrl({ date: e.target.value || null })}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveStatus("All");
                updateUrl({
                  status: null,
                  date: null,
                  patient: null,
                });
              }}
              className="border border-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-xl hover:border-teal-300 hover:text-teal-600 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {["All", "Pending", "Approved", "Completed", "Declined", "Cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setActiveStatus(s);
                updateUrl({ status: s === "All" ? null : s });
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeStatus === s
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-teal-300 hover:text-teal-600"
              }`}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1.5 text-xs opacity-70">
                  (
                  {appointments.filter((a) => a.status === s).length}
                  )
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-white rounded-xl border border-gray-100 animate-pulse"
                />
              ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-semibold text-gray-600 mb-1">No appointments found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left border-b border-gray-100">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Service
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Requested
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800 text-sm">
                          {formatPatientName(appt.patients)}
                        </p>
                        <p className="text-gray-400 text-xs">{appt.patients?.phone_mobile || "—"}</p>

                        {appt.patients?.id ? (
                          <Link
                            href={`/admin/patients/${appt.patients.id}`}
                            className="inline-flex mt-2 text-xs font-medium text-teal-600 hover:text-teal-700"
                          >
                            Open patient record →
                          </Link>
                        ) : null}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-gray-700 text-sm max-w-[220px] truncate">
                          {appt.service || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm tabular-nums">
                          {formatDate(appt.requested_date)}
                        </p>
                        <p className="text-gray-400 text-xs">{appt.requested_time || ""}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColor[appt.status || ""] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {appt.status || "Unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold ${
                            paymentColor[appt.payment_status || ""] || "text-gray-500"
                          }`}
                        >
                          {appt.payment_status || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/appointments/${appt.id}`}
                          className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
                        >
                          Review →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400">
                Showing {filtered.length} of {appointments.length} appointments
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      }
    >
      <AppointmentsContent />
    </Suspense>
  );
}