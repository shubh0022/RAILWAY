import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AICopilot from "../components/AICopilot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IRCTC Rail Connect — Next-Gen Travel Rebuild",
  description: "Unified, ultra-fast travel booking platform for Trains, Flights, Hotels, Buses, Metro, and Cabs. Experience 2047-grade accessibility, speed, and design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased bg-slate-905 text-slate-100 transition-colors duration-300">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-orange text-white px-4 py-2 rounded-xl font-bold z-[100]"
        >
          Skip to main content
        </a>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main id="main-content" className="flex-grow focus:outline-none" tabIndex={-1}>
            {children}
          </main>
          {/* Global Footer (Travel OS Dashboard) */}
          <Footer />
        </div>
        {/* Global AI Travel Copilot (Floating Assistant) */}
        <AICopilot />
      </body>
    </html>
  );
}
