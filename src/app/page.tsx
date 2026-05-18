"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const slides = [
  {
    location: "Nassau, Bahamas",
    titleTop: "We Bring the",
    titleHighlight: "Lab to You.",
    description:
      "Professional mobile phlebotomy and lab services delivered to your home, office, or hotel — with care, privacy, and convenience.",
    primaryText: "Book an Appointment",
    primaryHref: "/book",
    secondaryText: "View Services",
    secondaryHref: "/services",
    points: ["Certified Phlebotomists", "Flexible Hours", "Patient-First Care"],
  },
  {
    location: "Convenient & Private",
    titleTop: "Skip the Lines.",
    titleHighlight: "Stay Comfortable.",
    description:
      "Avoid crowded waiting rooms and enjoy professional specimen collection in the privacy of your own space.",
    primaryText: "Book a Visit",
    primaryHref: "/book",
    secondaryText: "Contact Us",
    secondaryHref: "/contact",
    points: ["Home Visits", "Office Visits", "Hotel Visits"],
  },
  {
    location: "Simple Process",
    titleTop: "Book Fast.",
    titleHighlight: "Get Care Delivered.",
    description:
      "Request your appointment online, get confirmed quickly, and let our trained mobile team come directly to you.",
    primaryText: "Get Started",
    primaryHref: "/book",
    secondaryText: "How It Works",
    secondaryHref: "#how-it-works",
    points: ["Easy Booking", "Quick Confirmation", "Reliable Service"],
  },
];

const services = [
  {
    title: "Blood Collection",
    desc: "Professional venipuncture and capillary blood draws at your location.",
  },
  {
    title: "Specimen Handling",
    desc: "Proper collection, labeling, and transport to certified labs across Nassau.",
  },
  {
    title: "Routine Lab Panels",
    desc: "CBC, HbA1c, lipid panels, thyroid, SMAC 25, and more.",
  },
  {
    title: "Flexible Scheduling",
    desc: "Early morning, evening, and weekend appointments available.",
  },
  {
    title: "We Come to You",
    desc: "Home, office, hotel — anywhere in Nassau, Bahamas.",
  },
  {
    title: "Certified Phlebotomists",
    desc: "Trained, certified, and compassionate staff for every visit.",
  },
];

const steps = [
  {
    num: "01",
    title: "Book Online",
    desc: "Fill out our simple appointment form with your service and preferred time.",
  },
  {
    num: "02",
    title: "Get Confirmed",
    desc: "We review your request and confirm your appointment by phone or email.",
  },
  {
    num: "03",
    title: "We Come to You",
    desc: "Our certified phlebotomist arrives at your location on time.",
  },
  {
    num: "04",
    title: "Results Delivered",
    desc: "Specimens are transported to your chosen lab and results routed to your provider.",
  },
];

const faqs = [
  {
    question: "What areas do you serve?",
    answer:
      "We provide mobile phlebotomy and lab support in Nassau, Bahamas, bringing professional specimen collection directly to your home, office, or hotel.",
  },
  {
    question: "How does booking work?",
    answer:
      "You submit your appointment request online, we review the details, and then confirm your visit by phone or email before your appointment time.",
  },
  {
    question: "What types of services can I book?",
    answer:
      "We assist with blood collection, specimen handling, and routine lab panel collections, including common tests such as CBC, HbA1c, lipid panels, thyroid panels, SMAC 25, and more.",
  },
  {
    question: "What should I have ready for my appointment?",
    answer:
      "Please have your lab form or test request, a valid contact number, and a clean, comfortable space available for the visit. If there are any fasting or preparation instructions, those should be followed before your appointment.",
  },
  {
    question: "Can I book for my home, office, or hotel?",
    answer:
      "Yes. Our service is designed for convenience, and we can come to your home, office, or hotel in Nassau depending on your appointment details.",
  },
  {
    question: "How do I cancel or reschedule?",
    answer:
      "Right now, the easiest way is to contact us directly by phone or email as soon as possible after booking. A dedicated cancel and reschedule feature will be added soon.",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const activeSlide = slides[currentSlide];

  return (
    <>
      <Navbar />
      <main>
        {/* HERO SLIDESHOW */}
        <section className="relative bg-teal-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,208,0,0.16),transparent_25%)]" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase mb-6">
                  {activeSlide.location}
                </div>

                <h1 className="font-bold text-4xl md:text-6xl leading-tight tracking-tight mb-4 min-h-[140px] md:min-h-[180px]">
                  {activeSlide.titleTop}{" "}
                  <span className="text-yellow-400">{activeSlide.titleHighlight}</span>
                </h1>

                <p className="text-teal-100 text-lg md:text-xl leading-relaxed mb-8 max-w-xl min-h-[96px]">
                  {activeSlide.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href={activeSlide.primaryHref}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
                  >
                    {activeSlide.primaryText}
                  </Link>

                  <Link
                    href={activeSlide.secondaryHref}
                    className="flex items-center gap-2 text-white border-2 border-white/40 hover:border-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
                  >
                    {activeSlide.secondaryText}
                  </Link>
                </div>

                <div className="flex flex-wrap gap-6 mt-10 text-sm text-teal-100">
                  {activeSlide.points.map((point) => (
                    <span key={point}>✓ {point}</span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-[28px] p-6 md:p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-yellow-300 text-xs font-semibold tracking-[0.18em] uppercase mb-2">
                        Health Wise
                      </p>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Mobile Lab Care
                      </h2>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-yellow-400/20 border border-yellow-300/30 flex items-center justify-center text-yellow-300 text-2xl">
                      ✦
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                      <p className="text-xs uppercase tracking-[0.18em] text-teal-100 mb-2">
                        Why Patients Choose Us
                      </p>
                      <p className="text-white font-medium leading-relaxed">
                        Convenient mobile specimen collection with compassionate care,
                        flexible scheduling, and professional service at your location.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                        <p className="text-3xl font-bold text-yellow-300">Home</p>
                        <p className="text-sm text-teal-100 mt-1">Visits available</p>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                        <p className="text-3xl font-bold text-yellow-300">Fast</p>
                        <p className="text-sm text-teal-100 mt-1">Confirmation process</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-4 text-teal-900">
                      <p className="text-xs uppercase tracking-[0.18em] font-semibold mb-2">
                        Book with confidence
                      </p>
                      <p className="font-semibold">
                        Care delivered where you are — home, office, or hotel.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-3 rounded-full transition-all duration-200 ${
                          currentSlide === index
                            ? "w-8 bg-yellow-400"
                            : "w-3 bg-white/40 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={goToPrevious}
                      aria-label="Previous slide"
                      className="w-11 h-11 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-all duration-200"
                    >
                      ←
                    </button>
                    <button
                      onClick={goToNext}
                      aria-label="Next slide"
                      className="w-11 h-11 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-all duration-200"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z"
                fill="#f8fafa"
              />
            </svg>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-yellow-600 font-semibold text-sm uppercase tracking-widest mb-2">
                What We Offer
              </p>
              <h2 className="font-bold text-teal-800 text-3xl md:text-4xl">
                Lab-Quality Services,
                <br />
                Delivered to Your Door
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="bg-white rounded-2xl shadow-sm border border-teal-50 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                    <span className="text-teal-600 text-xl">+</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/services"
                className="border-2 border-teal-600 text-teal-600 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-all duration-200 text-sm"
              >
                See All Services
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-yellow-600 font-semibold text-sm uppercase tracking-widest mb-2">
                Simple Process
              </p>
              <h2 className="font-bold text-teal-800 text-3xl md:text-4xl">
                How It Works
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step) => (
                <div key={step.num} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600 text-white font-bold text-lg mb-4 shadow-sm">
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-teal-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-yellow-600 font-semibold text-sm uppercase tracking-widest mb-2">
                Frequently Asked Questions
              </p>
              <h2 className="font-bold text-teal-800 text-3xl md:text-4xl">
                Answers Before You Book
              </h2>
              <p className="text-gray-600 text-base md:text-lg mt-4 max-w-2xl mx-auto">
                Here are some of the most common questions patients ask before scheduling a mobile appointment.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={faq.question}
                    className="bg-white border border-teal-100 rounded-2xl shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-gray-800 text-base md:text-lg">
                        {faq.question}
                      </span>
                      <span className="text-2xl text-teal-600 leading-none shrink-0">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <p className="text-gray-600 mb-4">
                Still have questions before booking?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="border-2 border-teal-600 text-teal-600 font-semibold px-6 py-3 rounded-xl hover:bg-teal-100 transition-all duration-200 text-sm"
                >
                  Contact Us
                </Link>
                <Link
                  href="/book"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bold text-3xl md:text-4xl text-white mb-4">
              Ready to Skip the Waiting Room?
            </h2>
            <p className="text-teal-100 text-lg mb-8">
              Book your mobile lab appointment today and get lab-quality care delivered to your
              door.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/book"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
              >
                Book an Appointment
              </Link>
              <a
                href="tel:2428079473"
                className="text-white border-2 border-white/40 hover:border-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}