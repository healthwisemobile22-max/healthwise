"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-teal-600 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-2">Get in Touch</p>
            <h1 className="font-bold text-4xl md:text-5xl mb-4">Contact Us</h1>
            <p className="text-teal-100 text-lg">We&apos;re here to help. Reach out any time.</p>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

            <div>
              <h2 className="font-bold text-2xl text-teal-800 mb-6">Get in Touch</h2>
              <div className="space-y-5">
                {[
                  { label: "Phone", value: "242.807.WISE (9473)", href: "tel:2428079473" },
                  { label: "Email", value: "info.healthwisephlebotomy@gmail.com", href: "mailto:info.healthwisephlebotomy@gmail.com" },
                  { label: "Location", value: "Nassau, Bahamas", href: null },
                  { label: "Hours", value: "Monday – Saturday: 7:00 AM – 6:00 PM", href: null },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      <span className="text-teal-600 text-lg">
                        {item.label === "Phone" ? "📞" : item.label === "Email" ? "✉️" : item.label === "Location" ? "📍" : "🕐"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-teal-700 font-medium text-sm hover:text-teal-500 transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-gray-700 font-medium text-sm">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold text-2xl text-teal-800 mb-6">Send a Message</h2>
              {submitted ? (
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✓</span>
                  </div>
                  <h3 className="font-bold text-teal-800 text-xl mb-2">Message Sent!</h3>
                  <p className="text-teal-600 text-sm">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" value={form.name} onChange={set("name")} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input required type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" value={form.email} onChange={set("email")} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" value={form.phone} onChange={set("phone")} placeholder="242-xxx-xxxx" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea required rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" value={form.message} onChange={set("message")} placeholder="How can we help you?" />
                  </div>
                  <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-3 rounded-xl hover:bg-teal-700 transition-all text-sm">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}