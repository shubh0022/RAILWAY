import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";

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
  description: "Unified, ultra-fast travel booking platform for Trains, Flights, and Hotels. Experience 2030s-grade accessibility, speed, and design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased bg-slate-50 dark:bg-brand-blue-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
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
          {/* Global Footer */}
          <footer className="bg-slate-900 text-slate-400 py-8 border-t border-white/5 mt-16 text-center text-xs font-semibold">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 IRCTC Rail Connect Next-Gen. All Rights Reserved. Built for Shubham.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Help Support</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
