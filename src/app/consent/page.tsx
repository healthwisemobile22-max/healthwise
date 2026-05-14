"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ConsentPage() {
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !signature) return;
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-yellow-600 font-semibold text-sm uppercase tracking-widest mb-1">Before Your Visit</p>
            <h1 className="font-bold text-3xl text-teal-800">Patient Consent Form</h1>
            <p className="text-gray-500 mt-2 text-sm">Please read carefully and sign before your appointment.</p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✓</span>
              </div>
              <h2 className="font-bold text-2xl text-teal-800 mb-3">Consent Recorded</h2>
              <p className="text-gray-500 mb-8">Thank you, <strong>{signature}</strong>. Your consent has been recorded.</p>
              <Link href="/book" className="bg-teal-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-teal-700 transition-all text-sm">
                Book Your Appointment
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

              <div className="bg-gray-50 rounded-xl p-6 text-sm text-gray-600 leading-relaxed space-y-4 max-h-72 overflow-y-auto border border-gray-200">
                <h2 className="font-bold text-gray-800 text-base">Informed Consent for Mobile Phlebotomy Services</h2>
                <p>I, the undersigned, hereby authorize Health Wise Mobile Phlebotomy & Lab Services and its certified phlebotomists to perform blood draws and specimen collection services as ordered by my physician or as requested by me.</p>
                <p><strong>I understand and agree that:</strong></p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>The phlebotomist will collect blood and/or other specimens as requested.</li>
                  <li>There are minor risks associated with blood draws including bruising, soreness, dizziness, or fainting.</li>
                  <li>I will inform the phlebotomist of any known allergies, bleeding disorders, or medical conditions prior to collection.</li>
                  <li>Specimens will be transported to a certified laboratory for analysis.</li>
                  <li>Results will be sent directly to my ordering physician or as directed.</li>
                  <li>Health Wise Mobile Phlebotomy will handle my personal health information in strict confidence.</li>
                  <li>I have the right to refuse or stop the procedure at any time.</li>
                  <li>I am 18 years of age or older, or I am the legal guardian of the patient.</li>
                </ul>
                <p>By signing below, I confirm that I have read, understood, and agree to the above terms and consent to the collection of specimens by Health Wise Mobile Phlebotomy & Lab Services.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Legal Name (as signature) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-medium"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Type your full legal name"
                />
                <p className="text-xs text-gray-400 mt-1">Typing your full name acts as your digital signature.</p>
              </div>

              <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl border border-teal-100">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-teal-600 shrink-0"
                />
                <label htmlFor="agree" className="text-sm text-teal-700 cursor-pointer">
                  I have read and understood the consent form above. I voluntarily agree to the collection of specimens by Health Wise Mobile Phlebotomy & Lab Services.
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreed || !signature}
                className="w-full bg-teal-600 text-white font-semibold py-3.5 rounded-xl hover:bg-teal-700 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                I Agree &amp; Sign
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}