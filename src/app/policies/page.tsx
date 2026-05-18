import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const policySections = [
  {
    title: "Booking Confirmation",
    content: [
      "Submitting a booking request does not automatically guarantee an appointment time.",
      "All appointment requests are reviewed before confirmation.",
      "You will receive confirmation by phone or email once your appointment has been approved.",
    ],
  },
  {
    title: "Cancellation Policy",
    content: [
      "If you need to cancel your appointment, please contact us as soon as possible.",
      "We recommend giving at least 24 hours’ notice whenever possible.",
      "Providing early notice helps us better accommodate other patients who may need an appointment.",
    ],
  },
  {
    title: "Rescheduling Policy",
    content: [
      "If you need to change your appointment time, please contact us by phone or email.",
      "We will do our best to reschedule you based on availability.",
      "Rescheduling requests should be made as early as possible to improve scheduling options.",
    ],
  },
  {
    title: "Appointment Preparation",
    content: [
      "Please have your lab form or provider instructions available before the visit.",
      "If your test requires fasting or any special preparation, please follow those instructions in advance.",
      "Make sure the appointment location is accessible and that you are available during the scheduled time window.",
    ],
  },
  {
    title: "During the Visit",
    content: [
      "Our mobile phlebotomy team will arrive at your confirmed location for specimen collection.",
      "Please ensure there is a clean, quiet, and safe space available for the appointment.",
      "Patients may be asked to verify identifying information before specimen collection begins.",
    ],
  },
  {
    title: "Results and Lab Processing",
    content: [
      "Collected specimens are handled and transported appropriately for laboratory processing.",
      "Results are typically routed through the appropriate laboratory and/or your healthcare provider.",
      "If you have questions about result timing, please contact your provider or the processing lab when applicable.",
    ],
  },
  {
    title: "Privacy and Confidentiality",
    content: [
      "We respect patient privacy and handle personal information with care.",
      "Any information shared for scheduling and service delivery is used only for appointment-related purposes.",
      "Please avoid sending unnecessary sensitive medical details unless specifically requested.",
    ],
  },
  {
    title: "Need Help?",
    content: [
      "If you need to cancel, reschedule, or clarify any appointment details, please contact us directly.",
      "Phone: 242.807.WISE (9473)",
      "Email: info.healthwisephlebotomy@gmail.com",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-teal-600 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase mb-6">
              Patient Information
            </div>
            <h1 className="font-bold text-4xl md:text-5xl leading-tight tracking-tight mb-4">
              Policies &amp; Appointment Guidelines
            </h1>
            <p className="text-teal-100 text-lg md:text-xl leading-relaxed max-w-3xl">
              Please review these policies before booking or attending your appointment so you know what to expect and how to contact us if anything changes.
            </p>
          </div>
        </section>

        <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {policySections.map((section) => (
              <div
                key={section.title}
                className="bg-white border border-teal-100 rounded-2xl shadow-sm p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-teal-800 mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item) => (
                    <li key={item} className="text-gray-600 leading-relaxed flex gap-3">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="bg-teal-600 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Ready to Book?
              </h2>
              <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
                If you have reviewed the information above and are ready to request an appointment, you can book online now.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/book"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
                >
                  Book an Appointment
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white/40 hover:border-white hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}