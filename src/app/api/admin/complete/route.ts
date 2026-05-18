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

    const { error } = await supabase
      .from("appointments")
      .update({ status: "Completed" })
      .eq("id", appointmentId);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to complete appointment." },
      { status: 500 }
    );
  }
}