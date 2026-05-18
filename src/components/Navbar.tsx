"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-teal-100 shadow-sm">
      <div className="bg-teal-600 text-white text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-2 text-center">
          <span>📞 242.807.WISE (9473)</span>
          <span className="mx-2 opacity-40 hidden sm:inline">|</span>
          <span>info.healthwisephlebotomy@gmail.com</span>
          <span className="mx-2 opacity-40 hidden md:inline">|</span>
          <span className="hidden md:inline">Nassau, Bahamas</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link href="/" className="flex items-center gap-4 min-w-0">
            <div className="relative w-[72px] h-[72px] sm:w-[90px] sm:h-[90px] shrink-0 translate-y-[8px]">
              <Image
                src="/logo.png"
                alt="Health Wise logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="flex flex-col justify-center leading-none min-w-0">
              <span className="font-bold text-xl sm:text-2xl text-teal-600 tracking-wide truncate">
                HEALTH WISE
              </span>
              <span className="mt-1 text-[9px] sm:text-[10px] font-semibold text-yellow-600 tracking-[0.18em] uppercase truncate">
                Mobile Phlebotomy &amp; Lab Services
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-teal-50 text-teal-700 font-semibold"
                    : "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="hidden md:block bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-all duration-200"
            >
              Book Appointment
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-teal-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-teal-50 text-teal-700 font-semibold"
                  : "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/book"
            onClick={() => setIsOpen(false)}
            className="block bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-all duration-200 text-center mt-3"
          >
            Book Appointment
          </Link>
        </div>
      )}
    </nav>
  );
}