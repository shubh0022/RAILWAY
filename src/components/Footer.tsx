'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Train, Plane, Hotel, Compass, ShieldCheck, Download, Smartphone, RefreshCw, MapPin, Ticket, Wallet, Activity, HeartHandshake } from 'lucide-react';
import { useAppStore } from '../store';

export const Footer: React.FC = () => {
  const router = useRouter();
  const { setCopilotOpen, addChatMessage, language } = useAppStore();

  const handleQuickAction = (actionType: 'pnr' | 'track' | 'refund' | 'return') => {
    setCopilotOpen(true);
    if (actionType === 'pnr') {
      addChatMessage({
        id: `footer-pnr-${Date.now()}`,
        sender: 'disha',
        text: '🔍 **PNR Query Assistant Active**\n\nPlease type your 10-digit PNR code below to verify your ticket booking confirmation.',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });
    } else if (actionType === 'track') {
      addChatMessage({
        id: `footer-track-${Date.now()}`,
        sender: 'disha',
        text: '📍 **GPS Train Locator Active**\n\nPlease type the 5-digit Train Number (e.g., "12423") to fetch its real-time GPS position.',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });
    } else if (actionType === 'refund') {
      addChatMessage({
        id: `footer-refund-${Date.now()}`,
        sender: 'disha',
        text: '💸 **Refund Center Inquiry**\n\nAll ticket cancellation refunds are credited back to your **National Mobility Wallet** within 2 hours. Type "wallet balance" to check.',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });
    } else if (actionType === 'return') {
      router.push('/');
      addChatMessage({
        id: `footer-return-${Date.now()}`,
        sender: 'disha',
        text: '🔄 **Book Return Journey**\n\nI have redirected you to the booking search widget. Swap the Origin and Destination fields in the search panel to plan your return trip!',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  const handleCategoryClick = (category: string) => {
    if (category === 'assistant') {
      setCopilotOpen(true);
    } else if (category === 'wallet') {
      router.push('/admin');
    } else if (category === 'accessibility') {
      alert('Accessibility Assistant: Reading contrast, text scaling, and ARIA labels are active for screen readers.');
    } else {
      router.push('/');
    }
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-white/5 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* LAYER 1: QUICK ACTIONS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-white/5 pb-8">
          <button
            onClick={() => handleQuickAction('pnr')}
            className="flex items-center gap-3 bg-white/5 border border-white/5 hover:border-brand-orange/30 p-4 rounded-2xl text-left hover:text-white transition-all cursor-pointer group"
          >
            <div className="bg-brand-orange/10 p-2.5 rounded-xl text-brand-orange group-hover:scale-115 transition-transform duration-300">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-black text-white uppercase tracking-wider">PNR Status</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Verify passenger chart</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickAction('track')}
            className="flex items-center gap-3 bg-white/5 border border-white/5 hover:border-brand-orange/30 p-4 rounded-2xl text-left hover:text-white transition-all cursor-pointer group"
          >
            <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-400 group-hover:scale-115 transition-transform duration-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-black text-white uppercase tracking-wider">Track Train</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Real-time GPS status</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickAction('refund')}
            className="flex items-center gap-3 bg-white/5 border border-white/5 hover:border-brand-orange/30 p-4 rounded-2xl text-left hover:text-white transition-all cursor-pointer group"
          >
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 group-hover:scale-115 transition-transform duration-300">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-black text-white uppercase tracking-wider">Refund Status</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Track wallet transfers</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickAction('return')}
            className="flex items-center gap-3 bg-white/5 border border-white/5 hover:border-brand-orange/30 p-4 rounded-2xl text-left hover:text-white transition-all cursor-pointer group"
          >
            <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-400 group-hover:scale-115 transition-transform duration-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-black text-white uppercase tracking-wider">Return Journey</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Quick swap destination</span>
            </div>
          </button>
        </div>

        {/* LAYER 2: SERVICE CATEGORIES GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 border-b border-white/5 pb-8">
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-3">Transit Modes</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold">
              <li><button onClick={() => handleCategoryClick('train')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><Train className="w-3.5 h-3.5" /> Trains (IRCTC)</button></li>
              <li><button onClick={() => handleCategoryClick('flight')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><Plane className="w-3.5 h-3.5" /> Flights Connect</button></li>
              <li><button onClick={() => handleCategoryClick('bus')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Intercity Buses</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-3">Urban & Local</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold">
              <li><button onClick={() => handleCategoryClick('metro')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Metro Booking</button></li>
              <li><button onClick={() => handleCategoryClick('cab')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Local Cab/Auto</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-3">Lifestyles</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold">
              <li><button onClick={() => handleCategoryClick('hotel')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><Hotel className="w-3.5 h-3.5" /> Hotels & Lodging</button></li>
              <li><button onClick={() => handleCategoryClick('meals')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> E-Catering Meals</button></li>
              <li><button onClick={() => handleCategoryClick('tourism')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Bharat Gaurav Tour</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-3">Mobility Hub</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold">
              <li><button onClick={() => handleCategoryClick('wallet')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> National Wallet</button></li>
              <li><button onClick={() => handleCategoryClick('refund')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Refund Center</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-3">Accessibility</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold">
              <li><button onClick={() => handleCategoryClick('accessibility')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><HeartHandshake className="w-3.5 h-3.5" /> AAA Compliance</button></li>
              <li><button onClick={() => handleCategoryClick('assistant')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> AI Travel Copilot</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-3">Contact Support</h4>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold">
              <li><span className="block text-slate-500">General Helpline</span> <span className="text-white font-bold">139</span></li>
              <li><span className="block text-slate-500">Catering Services</span> <span className="text-white font-bold">1800-111-321</span></li>
            </ul>
          </div>
        </div>

        {/* LAYER 3: TRUST & SECURITY BADGES */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-orange-light animate-pulse" />
            <span className="text-xs font-bold text-slate-200">Production Protected Secure Telemetry Pipeline</span>
          </div>

          {/* Custom SVG Badges (RuPay, UPI, Visa, PCI-DSS, ISO) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* RuPay */}
            <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black text-slate-200 tracking-wider">
              RuPay
            </div>
            {/* UPI */}
            <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black text-brand-orange-light tracking-widest">
              UPI
            </div>
            {/* VISA */}
            <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black text-slate-305 italic">
              VISA
            </div>
            {/* PCI-DSS */}
            <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold text-slate-400">
              PCI DSS COMPLIANT
            </div>
            {/* ISO Certifications */}
            <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold text-slate-400">
              ISO 27001 / 9001
            </div>
          </div>
        </div>

        {/* LAYER 4: DOWNLOAD APPS + SOCIAL + COPYRIGHT */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold text-slate-500">
              © 2026 IRCTC Rail Connect Next-Gen Redesign. Government of India Enterprise.
            </p>
            <div className="flex gap-4 mt-2 justify-center sm:justify-start text-[10px] font-bold">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Safety Standards</a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-all" aria-label="Twitter">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
              </svg>
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-all" aria-label="YouTube">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-all" aria-label="Instagram">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-all" aria-label="Facebook">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
