import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const serviceGroups = [
  {
    category: "Blood Collection",
    intro:
      "Professional specimen collection performed with care, attention to comfort, and proper handling from start to finish.",
    services: [
      {
        name: "Venipuncture (Standard Blood Draw)",
        desc: "Standard arm vein blood collection for most routine and specialized lab tests.",
      },
      {
        name: "Capillary Blood Draw",
        desc: "Fingerstick collection for glucose, HbA1c, and other point-of-care or limited-volume testing.",
      },
      {
        name: "Pediatric Blood Collection",
        desc: "Gentle, patient-focused collection support for children when appropriate.",
      },
    ],
  },
  {
    category: "Lab Panels",
    intro:
      "We support a range of common laboratory collections and panels ordered by providers and laboratories.",
    services: [
      {
        name: "CBC with DIFF",
        desc: "Complete Blood Count with differential used to evaluate overall health and help detect a range of conditions.",
      },
      {
        name: "HbA1c",
        desc: "Measures average blood sugar over the past 2 to 3 months and is commonly used in diabetes management.",
      },
      {
        name: "Lipid Panel",
        desc: "Measures cholesterol and triglyceride levels for cardiovascular risk assessment.",
      },
      {
        name: "SMAC 25 / Metabolic Panel",
        desc: "Comprehensive metabolic testing that may include kidney, liver, electrolyte, and glucose markers.",
      },
      {
        name: "TFT / TSH (Thyroid)",
        desc: "Thyroid-related testing used to assess thyroid function and hormone balance.",
      },
      {
        name: "PSA-FT",
        desc: "Prostate-specific antigen testing as requested by the ordering provider.",
      },
      {
        name: "GTT (Glucose Tolerance Test)",
        desc: "Multi-draw glucose tolerance testing used when more detailed glucose response monitoring is needed.",
      },
      {
        name: "LTT",
        desc: "Lactose tolerance testing collection support.",
      },
    ],
  },
  {
    category: "Specimen Collection",
    intro:
      "We also assist with a variety of non-blood specimen collections and proper specimen handling procedures.",
    services: [
      {
        name: "Pap Smear Collection",
        desc: "Cervical specimen collection for screening when appropriate and arranged.",
      },
      {
        name: "Urine Collection",
        desc: "Supervised or standard urine specimen collection depending on the requested testing process.",
      },
      {
        name: "Saliva Collection",
        desc: "Oral fluid specimen collection for selected diagnostic or screening purposes.",
      },
      {
        name: "Sputum / Mucus Collection",
        desc: "Respiratory specimen collection support.",
      },
      {
        name: "Stool Collection",
        desc: "Fecal specimen collection guidance and handling.",
      },
      {
        name: "Nasal / Throat Swab",
        desc: "Swab collection for respiratory and infectious disease testing as requested.",
      },
      {
        name: "Vaginal Swab",
        desc: "Gynecological specimen collection support.",
      },
      {
        name: "Tissue Biopsy Handling",
        desc: "Proper handling and transport support for tissue specimens when arranged.",
      },
    ],
  },
];

const serviceHighlights = [
  {
    title: "Mobile Convenience",
    desc: "We come to your home, office, or hotel so you can avoid unnecessary travel and waiting rooms.",
  },
  {
    title: "Professional Handling",
    desc: "Specimens are collected, labeled, and prepared with care for proper transport and processing.",
  },
  {
    title: "Flexible Scheduling",
    desc: "We aim to provide appointment options that work around your day whenever possible.",
  },
];

const steps = [
  {
    title: "Send Your Request",
    desc: "Book online and include your preferred appointment details and service needs.",
  },
  {
    title: "We Confirm the Visit",
    desc: "Your request is reviewed and confirmed by phone or email before the appointment.",
  },
  {
    title: "We Come to You",
    desc: "Our mobile service arrives at your confirmed location for collection and support.",
  },
];

const prepItems = [
  "Have your lab form, provider request, or testing instructions ready.",
  "Follow any fasting or preparation instructions given for your specific test.",
  "Make sure the visit location is accessible and that you are available during the confirmed time.",
  "If you are unsure whether a specific test can be collected, contact us before booking or include a note with your request.",
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative bg-teal-600 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,208,0,0.16),transparent_25%)]" />
          <div className="relative max-w-5xl mx-auto text-center">
            <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-3">
              What We Offer
            </p>
            <h1 className="font-bold text-4xl md:text-5xl mb-5">
              Mobile Phlebotomy &amp; Specimen Collection Services
            </h1>
            <p className="text-teal-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Health Wise provides professional mobile specimen collection and lab support services
              in Nassau, Bahamas, helping patients access convenient care at home, at work, or while
              traveling.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/book"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
              >
                Book Appointment
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-base"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceHighlights.map((item) => (
              <div
                key={item.title}
                className="bg-teal-50 border border-teal-100 rounded-2xl p-6"
              >
                <h2 className="font-bold text-xl text-teal-800 mb-3">{item.title}</h2>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto space-y-14">
            {serviceGroups.map((group) => (
              <div key={group.category}>
                <div className="mb-6">
                  <h2 className="font-bold text-2xl md:text-3xl text-teal-800 mb-3 pb-3 border-b-2 border-teal-100">
                    {group.category}
                  </h2>
                  <p className="text-gray-600 max-w-3xl leading-relaxed">
                    {group.intro}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.services.map((service) => (
                    <div
                      key={service.name}
                      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
                        <span className="text-teal-600 font-bold text-sm">+</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1.5">
                        {service.name}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-yellow-600 font-semibold text-sm uppercase tracking-widest mb-2">
                How Service Works
              </p>
              <h2 className="font-bold text-3xl md:text-4xl text-teal-800 mb-6">
                A Simple, Patient-Friendly Process
              </h2>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 bg-gray-50 border border-teal-100 rounded-2xl p-5"
                  >
                    <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-yellow-600 font-semibold text-sm uppercase tracking-widest mb-2">
                Before Your Visit
              </p>
              <h2 className="font-bold text-3xl md:text-4xl text-teal-800 mb-6">
                What to Have Ready
              </h2>

              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6">
                <ul className="space-y-4">
                  {prepItems.map((item) => (
                    <li key={item} className="flex gap-3 text-gray-700 leading-relaxed">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-teal-100">
                  <p className="text-sm text-gray-600 mb-4">
                    If you are not sure whether a test is available, contact us first or include
                    your request when booking.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/contact"
                      className="border-2 border-teal-600 text-teal-600 font-semibold px-5 py-3 rounded-xl hover:bg-teal-100 transition-all duration-200 text-sm"
                    >
                      Ask a Question
                    </Link>
                    <Link
                      href="/book"
                      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 text-sm"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-teal-600">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-bold text-3xl text-white mb-4">
              Don&apos;t See Your Test?
            </h2>
            <p className="text-teal-100 mb-8 text-lg">
              We handle many more collection types and requests. Contact us or book with a note
              about what you need and we&apos;ll confirm whether we can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/book"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base"
              >
                Book Appointment
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-base"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}