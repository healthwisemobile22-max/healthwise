import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Health Wise Mobile Phlebotomy & Lab Services",
  description: "We bring the lab to you. Professional mobile phlebotomy services in Nassau, Bahamas.",
  keywords: "phlebotomy, mobile lab, blood draw, Nassau, Bahamas, Health Wise",
  openGraph: {
    title: "Health Wise Mobile Phlebotomy & Lab Services",
    description: "We bring the lab to you.",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased bg-brand-offwhite">
        {children}
      </body>
    </html>
  );
}