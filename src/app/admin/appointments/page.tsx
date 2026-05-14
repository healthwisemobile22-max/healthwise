"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Patient = {
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

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "All";
  const dateFilter = searchParams.get("date") || "";

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState(statusFilter);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("appointments")
        .select(
          "id, service, status, requested_date, requested_time, created_at, payment_status, patients(first_name, last_name, phone_mobile, email)"
        )
        .order("created_at", { ascending: false });

      if (data) {
        setAppointments(data as unknown as Appointment[]);
      }

      setLoading(false);
    }

    load();
  }, []);

  const filtered = appointments.filter((a) => {
    const matchStatus = activeStatus === "All" || a.status === activeStatus;
    const matchDate = !dateFilter || a.requested_date === dateFilter;
    const name = `${a.patients?.first_name ?? ""} ${a.patients?.last_name ?? ""}`.toLowerCase();
    const service = a.service?.toLowerCase() ?? "";
    const query = search.toLowerCase();

    const matchSearch = !search || name.includes(query) || service.includes(query);

    return matchStatus && matchDate && matchSearch;
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
          <span className="font-semibold">Appointments</span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="text-teal-200 hover:text-white text-sm transition-colors"
        >
          View Site ↗
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="font-bold text-2xl text-gray-800">All Appointments</h1>
          <input
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64 bg-white"
            placeholder="Search patient or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {["All", "Pending", "Approved", "Completed", "Declined", "Cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeStatus === s
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-teal-300 hover:text-teal-600"
              }`}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({appointments.filter((a) => a.status === s).length})
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
                          {appt.patients?.first_name} {appt.patients?.last_name}
                        </p>
                        <p className="text-gray-400 text-xs">{appt.patients?.phone_mobile}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 text-sm max-w-[200px] truncate">
                          {appt.service}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm tabular-nums">
                          {appt.requested_date || "—"}
                        </p>
                        <p className="text-gray-400 text-xs">{appt.requested_time || ""}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColor[appt.status || ""] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold ${
                            appt.payment_status === "Paid"
                              ? "text-teal-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {appt.payment_status}
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