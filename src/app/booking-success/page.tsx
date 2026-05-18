import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const nextSteps = [
  "Our team reviews your request details.",
  "We confirm your appointment by phone or email.",
  "Our phlebotomist arrives at your selected location.",
  "Specimens are handled appropriately and results are routed through the proper channels.",
];

const helpfulNotes = [
  "Your appointment is not fully confirmed until our team contacts you.",
  "Please keep your phone and email available in case we need to confirm details.",
  "If your test requires fasting or special preparation, be sure to follow those instructions before the appointment.",
];

export default function BookingSuccess() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-teal-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="bg-teal-600 text-white px-8 py-10 text-center">
              <div className="w-20 h-20 rounded-full bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl text-yellow-300">✓</span>
              </div>

              <p className="text-yellow-300 text-sm font-semibold tracking-[0.18em] uppercase mb-3">
                Booking Received
              </p>
              <h1 className="font-bold text-3xl md:text-4xl mb-4">
                Appointment Request Submitted
              </h1>
              <p className="text-teal-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Thank you for booking with Health Wise Mobile Phlebotomy &amp; Lab Services. Your request has been received and will be reviewed by our team.
              </p>
            </div>

            <div className="px-6 md:px-8 py-8 md:py-10">
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-yellow-600 mb-2">
                    Current Status
                  </p>
                  <h2 className="text-xl font-bold text-teal-800 mb-2">
                    Waiting for Confirmation
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    We will review your request and aim to confirm your appointment within{" "}
                    <span className="font-semibold text-teal-700">24 hours</span> by phone or email.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-yellow-600 mb-2">
                    Need Help?
                  </p>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Contact Our Team
                  </h2>
                  <div className="space-y-2 text-gray-600">
                    <p>Phone: 242.807.WISE (9473)</p>
                    <p>Email: info.healthwisephlebotomy@gmail.com</p>
                    <p>Location: Nassau, Bahamas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-teal-800 mb-4">
                  What Happens Next
                </h2>
                <div className="space-y-4">
                  {nextSteps.map((step, index) => (
                    <div key={step} className="flex gap-4">
                      <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-600 leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-bold text-teal-800 mb-4">
                  Helpful Reminders
                </h2>
                <div className="space-y-3">
                  {helpfulNotes.map((note) => (
                    <div key={note} className="flex gap-3">
                      <span className="text-yellow-600 font-bold">•</span>
                      <p className="text-gray-700 leading-relaxed">{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-all text-sm text-center"
                >
                  Back to Home
                </Link>

                <Link
                  href="/services"
                  className="border-2 border-teal-600 text-teal-600 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-all text-sm text-center"
                >
                  View Services
                </Link>

                <a
                  href="tel:2428079473"
                  className="border-2 border-yellow-500 text-yellow-700 font-semibold px-6 py-3 rounded-xl hover:bg-yellow-50 transition-all text-sm text-center"
                >
                  Call Us: 242.807.9473
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}