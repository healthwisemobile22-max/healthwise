import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const commonReasons = [
  "The booking request was not completed.",
  "The page may have been closed before submission finished.",
  "You may have decided not to continue right now.",
];

const nextOptions = [
  "You can return to the booking form and try again.",
  "You can contact us directly if you need help choosing the right service.",
  "You can call us if you would like immediate assistance.",
];

export default function BookingCancelled() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-red-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="bg-white px-8 py-10 text-center border-b border-red-100">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl text-red-500">✕</span>
              </div>

              <p className="text-red-500 text-sm font-semibold tracking-[0.18em] uppercase mb-3">
                Booking Not Completed
              </p>
              <h1 className="font-bold text-3xl md:text-4xl text-gray-800 mb-4">
                Booking Cancelled
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Your appointment request was not completed, but that&apos;s okay. No appointment has been confirmed, and you can try again whenever you&apos;re ready.
              </p>
            </div>

            <div className="px-6 md:px-8 py-8 md:py-10">
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-500 mb-2">
                    What This Means
                  </p>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    No Active Booking Request
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Since the process was cancelled or not completed, there is no pending appointment request in progress from this page.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-yellow-600 mb-2">
                    Need Help?
                  </p>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
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
                  Common Reasons This Happens
                </h2>
                <div className="space-y-3">
                  {commonReasons.map((reason) => (
                    <div key={reason} className="flex gap-3">
                      <span className="text-red-500 font-bold">•</span>
                      <p className="text-gray-600 leading-relaxed">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-bold text-teal-800 mb-4">
                  What You Can Do Next
                </h2>
                <div className="space-y-3">
                  {nextOptions.map((option) => (
                    <div key={option} className="flex gap-3">
                      <span className="text-teal-600 font-bold">✓</span>
                      <p className="text-gray-700 leading-relaxed">{option}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/book"
                  className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-all text-sm text-center"
                >
                  Try Again
                </Link>

                <Link
                  href="/services"
                  className="border-2 border-teal-600 text-teal-600 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-all text-sm text-center"
                >
                  View Services
                </Link>

                <Link
                  href="/"
                  className="border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:border-teal-300 hover:bg-gray-50 transition-all text-sm text-center"
                >
                  Back to Home
                </Link>
              </div>

              <div className="text-center mt-8">
                <a
                  href="tel:2428079473"
                  className="text-teal-700 font-semibold hover:text-teal-800 transition-colors"
                >
                  Need immediate help? Call 242.807.9473
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