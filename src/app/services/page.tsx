import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const serviceGroups = [
  {
    category: "Blood Collection",
    services: [
      { name: "Venipuncture (Standard Blood Draw)", desc: "Standard arm vein blood collection for most lab tests." },
      { name: "Capillary Blood Draw", desc: "Fingerstick collection for glucose, HbA1c, and point-of-care testing." },
      { name: "Pediatric Blood Collection", desc: "Gentle, specialized collection for children." },
    ],
  },
  {
    category: "Lab Panels",
    services: [
      { name: "CBC with DIFF", desc: "Complete Blood Count with differential — evaluates overall health and detects disorders." },
      { name: "HbA1c", desc: "Measures average blood sugar over 3 months — essential for diabetes management." },
      { name: "Lipid Panel", desc: "Cholesterol and triglyceride levels for cardiovascular risk assessment." },
      { name: "SMAC 25 / Metabolic Panel", desc: "Comprehensive metabolic panel covering kidney, liver, electrolytes, and glucose." },
      { name: "TFT / TSH (Thyroid)", desc: "Full thyroid function testing." },
      { name: "PSA-FT", desc: "Prostate-specific antigen testing." },
      { name: "GTT (Glucose Tolerance Test)", desc: "Multi-draw glucose tolerance test for diabetes diagnosis." },
      { name: "LTT", desc: "Lactose tolerance testing." },
    ],
  },
  {
    category: "Specimen Collection",
    services: [
      { name: "Pap Smear Collection", desc: "Cervical cell collection for cancer screening." },
      { name: "Urine Collection", desc: "Supervised or standard urine specimen collection." },
      { name: "Saliva Collection", desc: "Oral fluid specimen for various diagnostic tests." },
      { name: "Sputum / Mucus Collection", desc: "Respiratory specimen collection." },
      { name: "Stool Collection", desc: "Fecal specimen collection and handling." },
      { name: "Nasal / Throat Swab", desc: "Swab collection for respiratory and infectious disease testing." },
      { name: "Vaginal Swab", desc: "Gynecological specimen collection." },
      { name: "Tissue Biopsy Handling", desc: "Proper handling and transport of tissue specimens." },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-teal-600 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-2">What We Offer</p>
            <h1 className="font-bold text-4xl md:text-5xl mb-4">Our Services</h1>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto">
              Professional mobile specimen collection and lab services delivered directly to you in Nassau, Bahamas.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto space-y-12">
            {serviceGroups.map((group) => (
              <div key={group.category}>
                <h2 className="font-bold text-2xl text-teal-800 mb-6 pb-3 border-b-2 border-teal-100">
                  {group.category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.services.map((service) => (
                    <div key={service.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
                        <span className="text-teal-600 font-bold text-sm">+</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1.5">{service.name}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-4 bg-teal-600">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-bold text-3xl text-white mb-4">Don&apos;t See Your Test?</h2>
            <p className="text-teal-100 mb-8">
              We handle many more test types. Contact us or book with a note about what you need and we&apos;ll confirm if we can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/book" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base">
                Book Appointment
              </Link>
              <Link href="/contact" className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-base">
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