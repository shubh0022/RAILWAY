'use client';

import React from 'react';
import { Sparkles, Globe, Smartphone, Laptop, Award, ShieldCheck, Zap, Bot, Send, X, MessageSquare, Landmark, Info } from 'lucide-react';
import { useAppStore } from '../store';
import { DICTIONARY } from '../locales/dictionary';
import UnifiedSearchBar from '../components/UnifiedSearchBar';
import QuickActions from '../components/QuickActions';
import PopularDestinations from '../components/PopularDestinations';

export default function Home() {
  const { language, setLanguage, chatMessages, addChatMessage, clearChat, walletBalance } = useAppStore();
  const t = DICTIONARY[language];

  // Companion Mockup View toggle ('desktop' | 'mobile')
  const [deviceView, setDeviceView] = React.useState<'desktop' | 'mobile'>('desktop');

  // AI Copilot state
  const [dishaOpen, setDishaOpen] = React.useState(false);
  const [inputVal, setInputVal] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping, dishaOpen]);

  // Handle chatbot send
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    // Append user message
    addChatMessage({
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });

    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(r => setTimeout(r, 900));

    let reply = '';
    const cleanText = userText.toLowerCase();

    if (cleanText.includes('pnr') || cleanText.includes('ticket')) {
      if (/\d{10}/.test(cleanText)) {
        const matchedPnr = cleanText.match(/\d{10}/)?.[0] || '';
        reply = `🔍 Checked PNR Status for **${matchedPnr}**:\n\n**Train:** NDLS HWH Rajdhani (12423)\n**Date:** 2026-06-25\n**Route:** New Delhi (NDLS) ➔ Howrah (HWH)\n**Class:** AC 3 Tier (3A)\n**Status:** CONFIRMED\n**Coach/Berth:** B2, Seat 24 (Shubham Kumar)\n\nEverything is set for your journey!`;
      } else {
        reply = 'Please enter your **10-digit PNR** number (e.g. "check status for PNR 4349832104") to retrieve reservation details.';
      }
    } else if (cleanText.includes('wallet') || cleanText.includes('balance') || cleanText.includes('money')) {
      reply = `💳 **National Mobility Wallet Status:**\n\nYour current wallet balance is **₹${walletBalance.toFixed(2)}**.\nYou have 2 successful deposit records in your transaction ledger.\n\nYou can use this balance to checkout instantly without any payment gateway redirects!`;
    } else if (cleanText.includes('track') || cleanText.includes('live') || cleanText.includes('location')) {
      if (/\d{5}/.test(cleanText)) {
        const trainNo = cleanText.match(/\d{5}/)?.[0] || '';
        reply = `📍 **Live GPS Location for Train ${trainNo}**:\n\n**Train:** KONKAN KANYA EXP (${trainNo})\n**Current Station:** Ratnagiri (RN)\n**Status:** Running on schedule (On Time)\n**Next Station:** Sangameshwar Road (SGR) | ETA: 18:40\n**GPS Status:** Signal strong, updated just now.`;
      } else {
        reply = 'Please enter the **5-digit Train Number** (e.g. "track live status for 10111") to locate its real-time GPS position.';
      }
    } else if (cleanText.includes('tatkal')) {
      reply = '⚡ **Tatkal Booking Guidelines:**\n\n- AC Classes: Tatkal booking window opens at **10:00 AM** daily.\n- Non-AC Classes (Sleeper/2S): Tatkal window opens at **11:00 AM** daily.\n\nOur Next-Gen platform uses a *virtual seat queue* to safeguard your checkout and prevent server-timeout crashes!';
    } else if (cleanText.includes('hello') || cleanText.includes('hi') || cleanText.includes('namaste')) {
      reply = 'Namaste! I am Ask DISHA 2.0. I can help you search for trains, check PNR statuses, track live GPS locations, or view your wallet details. Just type what you need!';
    } else {
      reply = 'I am Ask DISHA 2.0. I can assist you with:\n\n1. Checking PNR status (e.g. "PNR 4349832104")\n2. Real-time GPS Train Tracking (e.g. "track 10111")\n3. Checking Wallet balance (e.g. "wallet balance")\n4. Tatkal booking information\n\nHow can I help you today?';
    }

    addChatMessage({
      id: `msg-${Date.now()}-disha`,
      sender: 'disha',
      text: reply,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });

    setIsTyping(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* SCROLLING NEWS MARQUEE STRIP (Module 13 & 14) */}
      <div className="bg-brand-orange text-white py-1.5 px-4 text-xs font-bold overflow-hidden select-none border-b border-white/5 relative z-25">
        <div className="inline-block animate-marquee whitespace-nowrap uppercase tracking-wider">
          📢 {language === 'en' 
            ? 'TRAVEL ALERT: Special Vande Bharat holiday trains running for festive season. Use National Mobility Wallet for 5% instant cashback on train tickets. Carry authentic ID for boarding verification.' 
            : 'यात्रा अलर्ट: त्योहारों के मौसम के लिए विशेष वंदे भारत ट्रेनें चलाई जा रही हैं। ट्रेन टिकटों पर 5% तत्काल कैशबैक के लिए नेशनल मोबिलिटी वॉलेट का उपयोग करें।'}
        </div>
      </div>

      {/* HERO HERO BACKGROUND WITH PARALLAX VANDE BHARAT PHOTO */}
      <div className="absolute top-0 left-0 w-full h-[640px] pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-102 transition-transform duration-[10s]"
          style={{ backgroundImage: `url('/vande-bharat-hero.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-900/80 to-slate-900" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20 relative z-10">
        {/* Top Control tools for testing */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-brand-orange-light animate-pulse" />
            <span>Interactive Simulator</span>
          </div>

          {/* Device Mockup Toggle */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${deviceView === 'desktop' ? 'bg-brand-orange text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              aria-label="Desktop Layout Mode"
              title="Desktop Layout Preview"
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${deviceView === 'mobile' ? 'bg-brand-orange text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              aria-label="Mobile Layout Mode"
              title="Companion Mobile App Layout Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic device frame conditional wrapper */}
        <div className={`transition-all duration-500 mx-auto ${deviceView === 'mobile' ? 'max-w-[390px] border-[8px] border-slate-950 rounded-[48px] shadow-2xl overflow-hidden bg-slate-900 ring-8 ring-slate-950/50' : 'w-full'}`}>
          <div className={`${deviceView === 'mobile' ? 'p-4 max-h-[82vh] overflow-y-auto' : ''}`}>
            
            {/* HERO TYPOGRAPHY HEADER */}
            <div className="text-center max-w-3xl mx-auto mb-10 mt-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-brand-orange/15 px-3.5 py-1.5 rounded-full text-xs font-black text-brand-orange-light uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Next-Gen Travel Rebuild</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
                {t.tagline}
              </h1>
              <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto font-medium">
                {t.subtext}
              </p>
            </div>

            {/* UNIFIED SEARCH CARD CONTAINER */}
            <div className="mb-12">
              <UnifiedSearchBar />
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="mb-12">
              <div className="mb-4">
                <h2 className="text-base font-black uppercase text-white tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-orange" />
                  <span>{t.quickActions}</span>
                </h2>
              </div>
              <QuickActions />
            </div>

            {/* POPULAR JOURNEYS */}
            <div className="mb-8">
              <PopularDestinations />
            </div>

            {/* Platform Highlights */}
            {deviceView === 'desktop' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-white/5">
                <div className="flex gap-4">
                  <div className="bg-brand-orange/10 p-3 rounded-2xl text-brand-orange h-fit shrink-0">
                    <Zap className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">Tatkal virtual waiting room</h3>
                    <p className="text-sm text-slate-400 mt-1">Virtual queue buffers prevents peak-load database timeouts for 100% tatkal checkout success.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-brand-orange-light/10 p-3 rounded-2xl text-brand-orange-light h-fit shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">Idempotent UPI Gateway</h3>
                    <p className="text-sm text-slate-400 mt-1">Double charging checks shield transactions against connection dropouts.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500 h-fit shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">Multilingual & WCAG AAA</h3>
                    <p className="text-sm text-slate-400 mt-1">High contrast accessible interfaces verified for regional accessibility standard tags.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
