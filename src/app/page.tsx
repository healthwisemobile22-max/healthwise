import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const services = [
  { title: "Blood Collection", desc: "Professional venipuncture and capillary blood draws at your location." },
  { title: "Specimen Handling", desc: "Proper collection, labeling, and transport to certified labs across Nassau." },
  { title: "Routine Lab Panels", desc: "CBC, HbA1c, lipid panels, thyroid, SMAC 25, and more." },
  { title: "Flexible Scheduling", desc: "Early morning, evening, and weekend appointments available." },
  { title: "We Come to You", desc: "Home, office, hotel — anywhere in Nassau, Bahamas." },
  { title: "Certified Phlebotomists", desc: "Trained, certified, and compassionate staff for every visit." },
];

const steps = [
  { num: "01", title: "Book Online", desc: "Fill out our simple appointment form with your service and preferred time." },
  { num: "02", title: "Get Confirmed", desc: "We review your request and confirm your appointment by phone or email." },
  { num: "03", title: "We Come to You", desc: "Our certified phlebotomist arrives at your location on time." },
  { num: "04", title: "Results Delivered", desc: "Specimens are transported to your chosen lab and results routed to your provider." },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>

        {/* HERO */}
        <section className="relative bg-teal-600 text-white overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase mb-6">
                Nassau, Bahamas
              </div>
              <h1 className="font-bold text-4xl md:text-6xl leading-tight tracking-tight mb-4">
                We Bring the{" "}
                <span className="text-yellow-400">Lab to You.</span>
              </h1>
              <p className="text-teal-100 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
                Professional mobile phlebotomy and lab services delivered to your home,
                office, or hotel — with care, privacy, and convenience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/book"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
                >
                  Book an Appointment
                </Link>
                <Link
                  href="/services"
                  className="flex items-center gap-2 text-white border-2 border-white/40 hover:border-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
                >
                  View Services
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 mt-10 text-sm text-teal-100">
                <span>✓ Certified Phlebotomists</span>
                <span>✓ Flexible Hours</span>
                <span>✓ Patient-First Care</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#f8fafa"/>
            </svg>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-yellow-600 font-semibold text-sm uppercase tracking-widest mb-2">What We Offer</p>
              <h2 className="font-bold text-teal-800 text-3xl md:text-4xl">
                Lab-Quality Services,<br />Delivered to Your Door
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.title} className="bg-white rounded-2xl shadow-sm border border-teal-50 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-yellow-600 font-semibold text-sm uppercase tracking-widest mb-2">Simple Process</p>
              <h2 className="font-bold text-teal-800 text-3xl md:text-4xl">How It Works</h2>
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

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bold text-3xl md:text-4xl text-white mb-4">
              Ready to Skip the Waiting Room?
            </h2>
            <p className="text-teal-100 text-lg mb-8">
              Book your mobile lab appointment today and get lab-quality care delivered to your door.
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