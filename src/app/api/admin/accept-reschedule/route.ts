import { NextResponse } from "next/server";
import { requireAdmin, getServiceRoleClient } from "@/lib/requireAdmin";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) {
      return NextResponse.json(
        { ok: false, error: admin.error },
        { status: admin.status }
      );
    }

    const body = await req.json();
    const { appointmentId } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { ok: false, error: "Appointment ID is required." },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data: appt, error: fetchError } = await supabase
      .from("appointments")
      .select("reschedule_requested_date, reschedule_requested_time")
      .eq("id", appointmentId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { ok: false, error: fetchError.message },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("appointments")
      .update({
        requested_date: appt.reschedule_requested_date,
        requested_time: appt.reschedule_requested_time,
        reschedule_requested_date: null,
        reschedule_requested_time: null,
        reschedule_reason: null,
      })
      .eq("id", appointmentId);

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      newDate: appt.reschedule_requested_date,
      newTime: appt.reschedule_requested_time,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to accept reschedule." },
      { status: 500 }
    );
  }
}