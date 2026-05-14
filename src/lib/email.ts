import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.RESULTS_EMAIL,
    pass: process.env.RESULTS_EMAIL_APP_PASSWORD,
  },
});

const ADMIN = process.env.RESULTS_EMAIL!;

export async function sendNewBookingAlert(data: {
  patientName: string;
  service: string;
  date: string;
  time?: string;
  phone: string;
  email: string;
  address: string;
  appointmentId: string;
}) {
  return await transporter.sendMail({
    from: `"Health Wise Bookings" <${ADMIN}>`,
    to: ADMIN,
    subject: `New Appointment - ${data.patientName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f766e;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">New Appointment Request</h1>
          <p style="margin:4px 0 0;opacity:0.8;font-size:14px;">Health Wise Mobile Phlebotomy</p>
        </div>
        <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Patient</td><td style="font-weight:600;color:#111;">${data.patientName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Service</td><td style="color:#111;">${data.service}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Date</td><td style="color:#111;">${data.date}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Time</td><td style="color:#111;">${data.time || "Any time"}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Phone</td><td style="color:#111;">${data.phone}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="color:#111;">${data.email}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Address</td><td style="color:#111;">${data.address}</td></tr>
          </table>
          <div style="margin-top:20px;text-align:center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/appointments/${data.appointmentId}"
               style="background:#0f766e;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">
              Review Booking
            </a>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendApprovalEmail(data: {
  patientName: string;
  patientEmail: string;
  service: string;
  date: string;
  time?: string;
  address: string;
}) {
  return await transporter.sendMail({
    from: `"Health Wise Mobile Phlebotomy" <${ADMIN}>`,
    to: data.patientEmail,
    subject: "Appointment Confirmed - Health Wise",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f766e;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">Your Appointment is Confirmed!</h1>
          <p style="margin:4px 0 0;opacity:0.8;font-size:14px;">Health Wise Mobile Phlebotomy & Lab Services</p>
        </div>
        <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="color:#374151;">Dear <strong>${data.patientName}</strong>,</p>
          <p style="color:#374151;font-size:14px;line-height:1.6;">Your appointment has been confirmed. Our certified phlebotomist will arrive at your location at the scheduled time.</p>
          <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:8px;padding:16px;margin:20px 0;">
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#6b7280;width:130px;">Service</td><td style="font-weight:600;color:#0f766e;">${data.service}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Date</td><td style="font-weight:600;color:#0f766e;">${data.date}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Time</td><td style="font-weight:600;color:#0f766e;">${data.time || "We will call to confirm"}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Location</td><td style="font-weight:600;color:#0f766e;">${data.address}</td></tr>
            </table>
          </div>
          <p style="color:#374151;font-size:14px;"><strong>Please remember to:</strong></p>
          <ul style="color:#374151;font-size:14px;line-height:2;">
            <li>Have a valid photo ID ready</li>
            <li>Fast if required for your specific test</li>
            <li>Drink plenty of water beforehand</li>
            <li>Have your lab requisition form if applicable</li>
          </ul>
          <p style="color:#374151;font-size:14px;">Questions? Call <strong>242.807.WISE (9473)</strong> or email us.</p>
          <p style="color:#374151;font-size:14px;font-style:italic;margin-top:24px;">"We bring the lab to you." - Health Wise</p>
        </div>
      </div>
    `,
  });
}

export async function sendDeclineEmail(data: {
  patientName: string;
  patientEmail: string;
  service: string;
  date: string;
  reason: string;
}) {
  return await transporter.sendMail({
    from: `"Health Wise Mobile Phlebotomy" <${ADMIN}>`,
    to: data.patientEmail,
    subject: "Regarding Your Appointment Request - Health Wise",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f766e;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">Appointment Update</h1>
          <p style="margin:4px 0 0;opacity:0.8;font-size:14px;">Health Wise Mobile Phlebotomy & Lab Services</p>
        </div>
        <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="color:#374151;">Dear <strong>${data.patientName}</strong>,</p>
          <p style="color:#374151;font-size:14px;line-height:1.6;">
            Thank you for reaching out. Unfortunately we are unable to fulfill your request for <strong>${data.service}</strong> on <strong>${data.date}</strong>.
          </p>
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="margin:0;color:#dc2626;font-size:14px;"><strong>Reason:</strong> ${data.reason}</p>
          </div>
          <p style="color:#374151;font-size:14px;">Please contact us to reschedule:</p>
          <p style="color:#374151;font-size:14px;"><strong>242.807.WISE (9473)</strong><br />info.healthwisephlebotomy@gmail.com</p>
          <p style="color:#374151;font-size:14px;font-style:italic;margin-top:24px;">"We bring the lab to you." - Health Wise</p>
        </div>
      </div>
    `,
  });
}