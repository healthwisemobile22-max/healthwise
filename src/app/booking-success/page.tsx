import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BookingSuccess() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="font-bold text-3xl text-teal-800 mb-3">Appointment Requested!</h1>
          <p className="text-gray-500 mb-2">Thank you for booking with Health Wise Mobile Phlebotomy.</p>
          <p className="text-gray-500 mb-8">We will review your request and confirm your appointment within <strong className="text-teal-700">24 hours</strong> by phone or email.</p>
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 mb-8 text-sm text-teal-700 text-left space-y-2">
            <p className="font-semibold">What happens next:</p>
            <p>1. Our team reviews your request</p>
            <p>2. We confirm your appointment by phone/email</p>
            <p>3. Our phlebotomist arrives at your location</p>
            <p>4. Results are routed to your provider</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-all text-sm">
              Back to Home
            </Link>
            <a href="tel:2428079473" className="border-2 border-teal-600 text-teal-600 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-all text-sm">
              Call Us: 242.807.9473
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}