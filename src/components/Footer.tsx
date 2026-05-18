import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-teal-600 text-white">
      <div className="h-1 bg-yellow-500" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="mb-4">
              <div className="font-bold text-2xl tracking-wide text-white">
                HEALTH WISE
              </div>
              <div className="text-[10px] font-semibold text-yellow-400 tracking-[0.15em] uppercase mt-0.5">
                Mobile Phlebotomy &amp; Lab Services
              </div>
            </div>
            <p className="text-teal-100 text-sm leading-relaxed max-w-xs">
              Professional mobile phlebotomy and lab services delivered directly
              to your home or office in Nassau, Bahamas.
            </p>
            <p className="mt-4 text-yellow-400 font-semibold italic text-base">
              &ldquo;We bring the lab to you.&rdquo;
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-yellow-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Services" },
                { href: "/book", label: "Book Appointment" },
                { href: "/consent", label: "Consent Form" },
                { href: "/policies", label: "Policies" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-teal-100 text-sm hover:text-yellow-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-yellow-400 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-teal-100">
              <li>📞 242.807.WISE (9473)</li>
              <li>✉️ info.healthwisephlebotomy@gmail.com</li>
              <li>📍 Nassau, Bahamas</li>
            </ul>

            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center hover:bg-yellow-500 transition-colors duration-200 text-sm"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center hover:bg-yellow-500 transition-colors duration-200 text-sm"
                aria-label="Instagram"
              >
                in
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-teal-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-teal-300">
          <p>
            © {new Date().getFullYear()} Health Wise Mobile Phlebotomy &amp; Lab Services. All rights reserved.
          </p>
          <p>Nassau, Bahamas</p>
        </div>
      </div>
    </footer>
  );
}