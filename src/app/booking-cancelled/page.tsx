import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BookingCancelled() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✕</span>
          </div>
          <h1 className="font-bold text-3xl text-gray-800 mb-3">Booking Cancelled</h1>
          <p className="text-gray-500 mb-8">Your appointment request was not completed. No worries — you can try again anytime.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book" className="bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-all text-sm">
              Try Again
            </Link>
            <Link href="/" className="border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:border-teal-300 transition-all text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}