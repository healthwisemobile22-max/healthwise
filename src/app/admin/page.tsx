"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Patient = {
  first_name: string | null;
  last_name: string | null;
  phone_mobile: string | null;
};

type Appointment = {
  id: string;
  service: string | null;
  status: string | null;
  requested_date: string | null;
  created_at: string | null;
  patients: Patient | null;
};

type Stats = {
  total: number;
  pending: number;
  approved: number;
  declined: number;
  completed: number;
  todayCount: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    declined: 0,
    completed: 0,
    todayCount: 0,
  });
  const [recent, setRecent] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split("T")[0];

      const { data: appts } = await supabase
        .from("appointments")
        .select(
          "id, service, status, requested_date, created_at, patients(first_name, last_name, phone_mobile)"
        )
        .order("created_at", { ascending: false });

      if (appts) {
        const typedAppts = appts as unknown as Appointment[];

        setStats({
          total: typedAppts.length,
          pending: typedAppts.filter((a) => a.status === "Pending").length,
          approved: typedAppts.filter((a) => a.status === "Approved").length,
          declined: typedAppts.filter((a) => a.status === "Declined").length,
          completed: typedAppts.filter((a) => a.status === "Completed").length,
          todayCount: typedAppts.filter((a) => a.requested_date === today).length,
        });

        setRecent(typedAppts.slice(0, 8));
      }

      setLoading(false);
    }

    load();
  }, []);

  const statusColor: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-teal-100 text-teal-700",
    Declined: "bg-red-100 text-red-700",
    Completed: "bg-gray-100 text-gray-600",
    Cancelled: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div>
          <div className="font-bold text-lg">Health Wise Admin</div>
          <div className="text-teal-300 text-xs">Management Dashboard</div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/appointments"
            className="text-teal-200 hover:text-white text-sm font-medium transition-colors"
          >
            Appointments
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-teal-200 hover:text-white text-sm font-medium transition-colors"
          >
            View Site ↗
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-bold text-2xl text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse"
                >
                  <div className="h-3 bg-gray-200 rounded w-16 mb-3" />
                  <div className="h-8 bg-gray-200 rounded w-10" />
                </div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Total", value: stats.total, color: "text-gray-800", bg: "bg-white" },
              { label: "Pending", value: stats.pending, color: "text-yellow-600", bg: "bg-yellow-50" },
              { label: "Approved", value: stats.approved, color: "text-teal-600", bg: "bg-teal-50" },
              { label: "Completed", value: stats.completed, color: "text-gray-600", bg: "bg-gray-50" },
              { label: "Declined", value: stats.declined, color: "text-red-500", bg: "bg-red-50" },
              { label: "Today", value: stats.todayCount, color: "text-blue-600", bg: "bg-blue-50" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-5 border border-gray-100 shadow-sm`}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  {s.label}
                </p>
                <p className={`font-bold text-3xl ${s.color} tabular-nums`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "All Appointments", href: "/admin/appointments", emoji: "📋" },
            { label: "Pending Review", href: "/admin/appointments?status=Pending", emoji: "⏳" },
            {
              label: "Today's Schedule",
              href: `/admin/appointments?date=${new Date().toISOString().split("T")[0]}`,
              emoji: "📅",
            },
            { label: "Public Site", href: "/", emoji: "🌐" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.label === "Public Site" ? "_blank" : undefined}
              className="bg-white border border-gray-100 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition-all text-center group"
            >
              <div className="text-2xl mb-2">{action.emoji}</div>
              <p className="text-sm font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">
                {action.label}
              </p>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Recent Appointments</h2>
            <Link
              href="/admin/appointments"
              className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="font-semibold text-gray-600 mb-1">No appointments yet</p>
              <p className="text-gray-400 text-sm">
                Appointments will appear here once patients book.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Service
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Date
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recent.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800 text-sm">
                          {appt.patients?.first_name} {appt.patients?.last_name}
                        </p>
                        <p className="text-gray-400 text-xs">{appt.patients?.phone_mobile}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 text-sm max-w-[180px] truncate">
                          {appt.service}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm tabular-nums">
                          {appt.requested_date || "—"}
                        </p>
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
          )}
        </div>
      </div>
    </div>
  );
}