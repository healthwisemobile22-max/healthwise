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

export async function sendBookingReceivedEmail(data: {
  patientName: string;
  patientEmail: string;
  service: string;
  date: string;
  time?: string;
  address: string;
  appointmentId: string;
}) {
  return await transporter.sendMail({
    from: `"Health Wise Mobile Phlebotomy" <${ADMIN}>`,
    to: data.patientEmail,
    subject: "Appointment Request Received - Health Wise",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f766e;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">We Received Your Appointment Request</h1>
          <p style="margin:4px 0 0;opacity:0.8;font-size:14px;">Health Wise Mobile Phlebotomy & Lab Services</p>
        </div>
        <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="color:#374151;">Dear <strong>${data.patientName}</strong>,</p>
          <p style="color:#374151;font-size:14px;line-height:1.6;">
            Thank you for booking with Health Wise. We have received your appointment request and will review it shortly.
          </p>
          <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:8px;padding:16px;margin:20px 0;">
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#6b7280;width:140px;">Reference</td><td style="font-weight:600;color:#0f766e;">${data.appointmentId}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Service</td><td style="font-weight:600;color:#0f766e;">${data.service}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Preferred Date</td><td style="font-weight:600;color:#0f766e;">${data.date}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Preferred Time</td><td style="font-weight:600;color:#0f766e;">${data.time || "Any time"}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Visit Address</td><td style="font-weight:600;color:#0f766e;">${data.address}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Status</td><td style="font-weight:600;color:#0f766e;">Pending review</td></tr>
            </table>
          </div>
          <p style="color:#374151;font-size:14px;line-height:1.6;">
            We will contact you once your request has been reviewed and confirmed.
          </p>
          <p style="color:#374151;font-size:14px;"><strong>Please keep your reference number:</strong> ${data.appointmentId}</p>
          <p style="color:#374151;font-size:14px;">Questions? Call <strong>242.807.WISE (9473)</strong> or reply to this email.</p>
          <p style="color:#374151;font-size:14px;font-style:italic;margin-top:24px;">"We bring the lab to you." - Health Wise</p>
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

export async function sendCancellationEmail(data: {
  patientName: string;
  patientEmail: string;
  service: string;
  date: string;
  time?: string;
  reason?: string;
}) {
  return await transporter.sendMail({
    from: `"Health Wise Mobile Phlebotomy" <${ADMIN}>`,
    to: data.patientEmail,
    subject: "Appointment Cancelled - Health Wise",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f766e;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">Your Appointment Has Been Cancelled</h1>
          <p style="margin:4px 0 0;opacity:0.8;font-size:14px;">Health Wise Mobile Phlebotomy & Lab Services</p>
        </div>
        <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="color:#374151;">Dear <strong>${data.patientName}</strong>,</p>
          <p style="color:#374151;font-size:14px;line-height:1.6;">
            This is to confirm that your appointment has been cancelled.
          </p>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0;">
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#6b7280;width:130px;">Service</td><td style="font-weight:600;color:#111827;">${data.service}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Date</td><td style="font-weight:600;color:#111827;">${data.date}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Time</td><td style="font-weight:600;color:#111827;">${data.time || "Any time"}</td></tr>
              ${data.reason ? `<tr><td style="padding:6px 0;color:#6b7280;">Reason</td><td style="font-weight:600;color:#111827;">${data.reason}</td></tr>` : ""}
            </table>
          </div>
          <p style="color:#374151;font-size:14px;">If you need another appointment, please submit a new booking request or contact us directly.</p>
          <p style="color:#374151;font-size:14px;">Questions? Call <strong>242.807.WISE (9473)</strong> or email us.</p>
        </div>
      </div>
    `,
  });
}

export async function sendRescheduleRequestEmail(data: {
  patientName: string;
  patientEmail: string;
  currentDate: string;
  currentTime?: string;
  requestedDate: string;
  requestedTime?: string;
  reason?: string;
}) {
  return await transporter.sendMail({
    from: `"Health Wise Mobile Phlebotomy" <${ADMIN}>`,
    to: data.patientEmail,
    subject: "Reschedule Request Received - Health Wise",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f766e;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">We Received Your Reschedule Request</h1>
          <p style="margin:4px 0 0;opacity:0.8;font-size:14px;">Health Wise Mobile Phlebotomy & Lab Services</p>
        </div>
        <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="color:#374151;">Dear <strong>${data.patientName}</strong>,</p>
          <p style="color:#374151;font-size:14px;line-height:1.6;">
            We received your request to reschedule your appointment. Our team will review the request and contact you to confirm the new appointment time.
          </p>
          <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:8px;padding:16px;margin:20px 0;">
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#6b7280;width:170px;">Current Appointment</td><td style="font-weight:600;color:#0f766e;">${data.currentDate}${data.currentTime ? ` at ${data.currentTime}` : ""}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Requested New Date</td><td style="font-weight:600;color:#0f766e;">${data.requestedDate}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Requested New Time</td><td style="font-weight:600;color:#0f766e;">${data.requestedTime || "Any time"}</td></tr>
              ${data.reason ? `<tr><td style="padding:6px 0;color:#6b7280;">Reason</td><td style="font-weight:600;color:#0f766e;">${data.reason}</td></tr>` : ""}
            </table>
          </div>
          <p style="color:#374151;font-size:14px;">We will follow up as soon as possible.</p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminCancellationAlert(data: {
  patientName: string;
  patientEmail: string;
  appointmentId: string;
  service: string;
  date: string;
  time?: string;
  reason?: string;
}) {
  return await transporter.sendMail({
    from: `"Health Wise Bookings" <${ADMIN}>`,
    to: ADMIN,
    subject: `Appointment Cancelled - ${data.patientName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#991b1b;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">Patient Cancelled Appointment</h1>
        </div>
        <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Patient</td><td style="font-weight:600;color:#111;">${data.patientName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="color:#111;">${data.patientEmail}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Reference</td><td style="color:#111;">${data.appointmentId}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Service</td><td style="color:#111;">${data.service}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Date</td><td style="color:#111;">${data.date}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Time</td><td style="color:#111;">${data.time || "Any time"}</td></tr>
            ${data.reason ? `<tr><td style="padding:8px 0;color:#6b7280;">Reason</td><td style="color:#111;">${data.reason}</td></tr>` : ""}
          </table>
        </div>
      </div>
    `,
  });
}

export async function sendAdminRescheduleAlert(data: {
  patientName: string;
  patientEmail: string;
  appointmentId: string;
  currentDate: string;
  currentTime?: string;
  requestedDate: string;
  requestedTime?: string;
  reason?: string;
}) {
  return await transporter.sendMail({
    from: `"Health Wise Bookings" <${ADMIN}>`,
    to: ADMIN,
    subject: `Reschedule Request - ${data.patientName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f766e;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">Patient Requested Reschedule</h1>
        </div>
        <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#6b7280;width:160px;">Patient</td><td style="font-weight:600;color:#111;">${data.patientName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="color:#111;">${data.patientEmail}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Reference</td><td style="color:#111;">${data.appointmentId}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Current Appointment</td><td style="color:#111;">${data.currentDate}${data.currentTime ? ` at ${data.currentTime}` : ""}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Requested New Date</td><td style="color:#111;">${data.requestedDate}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Requested New Time</td><td style="color:#111;">${data.requestedTime || "Any time"}</td></tr>
            ${data.reason ? `<tr><td style="padding:8px 0;color:#6b7280;">Reason</td><td style="color:#111;">${data.reason}</td></tr>` : ""}
          </table>
        </div>
      </div>
    `,
  });
}
export async function sendAppointmentReminderEmail(data: {
  patientName: string;
  patientEmail: string;
  service: string;
  date: string;
  time?: string;
  address?: string;
}) {
  return await transporter.sendMail({
    from: `"Health Wise Mobile Phlebotomy" <${ADMIN}>`,
    to: data.patientEmail,
    subject: "Appointment Reminder - Health Wise",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f766e;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">Appointment Reminder</h1>
          <p style="margin:4px 0 0;opacity:0.8;font-size:14px;">Health Wise Mobile Phlebotomy & Lab Services</p>
        </div>
        <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="color:#374151;">Dear <strong>${data.patientName}</strong>,</p>
          <p style="color:#374151;font-size:14px;line-height:1.6;">
            This is a friendly reminder about your upcoming appointment with Health Wise.
          </p>

          <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:8px;padding:16px;margin:20px 0;">
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr>
                <td style="padding:6px 0;color:#6b7280;width:130px;">Service</td>
                <td style="font-weight:600;color:#0f766e;">${data.service}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Date</td>
                <td style="font-weight:600;color:#0f766e;">${data.date}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Time</td>
                <td style="font-weight:600;color:#0f766e;">${data.time || "We will call to confirm"}</td>
              </tr>
              ${
                data.address
                  ? `<tr>
                      <td style="padding:6px 0;color:#6b7280;">Location</td>
                      <td style="font-weight:600;color:#0f766e;">${data.address}</td>
                    </tr>`
                  : ""
              }
            </table>
          </div>

          <p style="color:#374151;font-size:14px;"><strong>Please remember to:</strong></p>
          <ul style="color:#374151;font-size:14px;line-height:2;">
            <li>Have a valid photo ID ready</li>
            <li>Fast if required for your specific test</li>
            <li>Drink water beforehand unless instructed otherwise</li>
            <li>Have your lab requisition form if applicable</li>
          </ul>

          <p style="color:#374151;font-size:14px;line-height:1.6;">
            If you need to cancel or request a new date, please use the booking management link or contact us as soon as possible.
          </p>

          <p style="color:#374151;font-size:14px;">
            Questions? Call <strong>242.807.WISE (9473)</strong> or email us.
          </p>
        </div>
      </div>
    `,
  });
}
export async function sendSameDayReminderEmail(data: {
  patientName: string;
  patientEmail: string;
  service: string;
  date: string;
  time: string;
  address?: string;
}) {
  return await transporter.sendMail({
    from: `"Health Wise Mobile Phlebotomy" <${ADMIN}>`,
    to: data.patientEmail,
    subject: "Today’s Appointment Reminder - Health Wise",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f766e;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">Today’s Appointment Reminder</h1>
          <p style="margin:4px 0 0;opacity:0.8;font-size:14px;">Health Wise Mobile Phlebotomy & Lab Services</p>
        </div>
        <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="color:#374151;">Dear <strong>${data.patientName}</strong>,</p>
          <p style="color:#374151;font-size:14px;line-height:1.6;">
            This is a same-day reminder for your appointment with Health Wise today.
          </p>

          <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:8px;padding:16px;margin:20px 0;">
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr>
                <td style="padding:6px 0;color:#6b7280;width:130px;">Service</td>
                <td style="font-weight:600;color:#0f766e;">${data.service}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Date</td>
                <td style="font-weight:600;color:#0f766e;">${data.date}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Time</td>
                <td style="font-weight:600;color:#0f766e;">${data.time}</td>
              </tr>
              ${
                data.address
                  ? `<tr>
                      <td style="padding:6px 0;color:#6b7280;">Location</td>
                      <td style="font-weight:600;color:#0f766e;">${data.address}</td>
                    </tr>`
                  : ""
              }
            </table>
          </div>

          <p style="color:#374151;font-size:14px;line-height:1.6;">
            Please be ready at the scheduled time and have your photo ID and any required requisition forms available.
          </p>

          <p style="color:#374151;font-size:14px;">
            Need help urgently? Call <strong>242.807.WISE (9473)</strong>.
          </p>
        </div>
      </div>
    `,
  });
}
export async function sendRescheduleConfirmedEmail(data: {
  patientName: string;
  patientEmail: string;
  service: string;
  newDate: string;
  newTime?: string;
  address?: string;
}) {
  return await transporter.sendMail({
    from: `"Health Wise Mobile Phlebotomy" <${ADMIN}>`,
    to: data.patientEmail,
    subject: "Appointment Rescheduled & Confirmed - Health Wise",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0f766e;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;">Your Appointment Has Been Rescheduled</h1>
          <p style="margin:4px 0 0;opacity:0.8;font-size:14px;">Health Wise Mobile Phlebotomy & Lab Services</p>
        </div>
        <div style="background:white;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="color:#374151;">Dear <strong>${data.patientName}</strong>,</p>
          <p style="color:#374151;font-size:14px;line-height:1.6;">
            Your reschedule request has been reviewed and confirmed. Your appointment has been moved to the new date below.
          </p>

          <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:8px;padding:16px;margin:20px 0;">
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr>
                <td style="padding:6px 0;color:#6b7280;width:130px;">Service</td>
                <td style="font-weight:600;color:#0f766e;">${data.service}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">New Date</td>
                <td style="font-weight:600;color:#0f766e;">${data.newDate}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">New Time</td>
                <td style="font-weight:600;color:#0f766e;">${data.newTime || "We will call to confirm"}</td>
              </tr>
              ${data.address ? `
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Location</td>
                <td style="font-weight:600;color:#0f766e;">${data.address}</td>
              </tr>` : ""}
            </table>
          </div>

          <p style="color:#374151;font-size:14px;line-height:1.6;">
            Please remember to have your photo ID and any required requisition forms ready.
          </p>
          <p style="color:#374151;font-size:14px;">
            Questions? Call <strong>242.807.WISE (9473)</strong> or reply to this email.
          </p>
          <p style="color:#374151;font-size:14px;font-style:italic;margin-top:24px;">"We bring the lab to you." - Health Wise</p>
        </div>
      </div>
    `,
  });
}