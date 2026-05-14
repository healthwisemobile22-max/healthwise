import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const user = process.env.RESULTS_EMAIL;
  const pass = process.env.RESULTS_EMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return NextResponse.json({
      success: false,
      error: "Missing email environment variables",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    await transporter.verify();

    const result = await transporter.sendMail({
      from: `"Health Wise Test" <${user}>`,
      to: user,
      subject: "Test Email from Health Wise",
      text: "If you receive this, Gmail SMTP is working correctly.",
    });

    return NextResponse.json({
      success: true,
      sentTo: user,
      result,
    });
  } catch (err: any) {
    console.error("EMAIL ERROR:", err);
    return NextResponse.json({
      success: false,
      error: err.message || String(err),
      code: err.code || null,
    });
  }
}