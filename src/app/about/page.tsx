import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-teal-600 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-2">Who We Are</p>
            <h1 className="font-bold text-4xl md:text-5xl mb-4">About Health Wise</h1>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto">
              Bringing professional lab services to the comfort of your home since our founding in Nassau, Bahamas.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-yellow-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Mission</p>
              <h2 className="font-bold text-3xl text-teal-800 mb-4">Healthcare Should Come to You</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Health Wise Mobile Phlebotomy & Lab Services was founded with one goal: remove the barriers between patients and the lab work they need. No waiting rooms, no transportation challenges, no uncomfortable clinic visits.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our certified phlebotomists come directly to your home, office, or hotel anywhere in Nassau, Bahamas — bringing the same quality and professionalism you would expect from any top medical facility.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We work closely with ordering physicians and certified labs across Nassau to ensure your specimens are handled correctly and results are delivered promptly to your provider.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { title: "Certified & Trained", desc: "All phlebotomists are certified and undergo rigorous training in specimen collection, handling, and patient care." },
                { title: "Fully Equipped", desc: "We arrive with all necessary equipment — needles, tubes, labels, transport coolers, and PPE." },
                { title: "Lab Partnerships", desc: "We transport to BML, Biotech, CHL, DHS, FMC, KELSO, Oaktree, PMH, Premier, and Neo Cyt Lab." },
                { title: "Patient Privacy", desc: "Your health information is handled with the highest standards of confidentiality and care." },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-teal-700 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-teal-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-bold text-3xl text-white mb-4">Our Lab Partners</h2>
            <p className="text-teal-100 mb-8">We transport specimens to these certified labs across Nassau:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["BML", "Biotech", "CHL", "DHS", "FMC", "KELSO", "Neo Cyt Lab", "Oaktree", "PMH", "Premier"].map((lab) => (
                <span key={lab} className="bg-white/15 border border-white/20 text-white font-medium px-5 py-2 rounded-full text-sm">
                  {lab}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}