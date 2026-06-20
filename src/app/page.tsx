'use client';

import React from 'react';
import { Sparkles, Globe, Smartphone, Laptop, Award, ShieldCheck, Zap } from 'lucide-react';
import { useAppStore } from '../store';
import { DICTIONARY } from '../locales/dictionary';
import UnifiedSearchBar from '../components/UnifiedSearchBar';
import QuickActions from '../components/QuickActions';
import PopularDestinations from '../components/PopularDestinations';

export default function Home() {
  const { language, setLanguage } = useAppStore();
  const t = DICTIONARY[language];

  // Companion Mockup View toggle ('desktop' | 'mobile')
  const [deviceView, setDeviceView] = React.useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-brand-blue-dark">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40 dark:opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,126,71,0.2),rgba(255,126,71,0))]" />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(59,130,246,0.15),rgba(59,130,246,0))]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-20 relative z-10">
        {/* Top bar with Language Switcher and Device view toggle */}
        <div className="flex justify-between items-center mb-8">
          {/* i18n switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-brand-blue/50 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-brand-orange" />
            <span>{language === 'en' ? 'हिंदी (Hindi)' : 'English'}</span>
          </button>

          {/* Device Mockup Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-brand-blue-dark/65 border border-slate-200 dark:border-slate-800 p-1 rounded-xl backdrop-blur-md">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${deviceView === 'desktop' ? 'bg-white dark:bg-brand-blue text-brand-orange shadow-sm' : 'text-slate-500'}`}
              aria-label="Desktop UI mode"
              title="Desktop Layout"
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${deviceView === 'mobile' ? 'bg-white dark:bg-brand-blue text-brand-orange shadow-sm' : 'text-slate-500'}`}
              aria-label="Companion mobile app view"
              title="Mobile Companion App Mockup"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic device frame conditional wrapper */}
        <div className={`transition-all duration-500 mx-auto ${deviceView === 'mobile' ? 'max-w-[390px] border-[8px] border-slate-900 dark:border-slate-800 rounded-[48px] shadow-2xl overflow-hidden bg-slate-50 dark:bg-brand-blue-dark ring-12 ring-slate-900/10' : 'w-full'}`}>
          <div className={`${deviceView === 'mobile' ? 'p-4 max-h-[80vh] overflow-y-auto' : ''}`}>
            
            {/* HERO SECTION */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 mt-4">
              <div className="inline-flex items-center gap-2 bg-brand-orange/10 dark:bg-brand-orange/15 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-brand-orange uppercase tracking-wider mb-4 animate-pulse-slow">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Redesign Platform</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 dark:text-white mb-4 leading-tight bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                {t.tagline}
              </h1>
              <p className="text-sm sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                {t.subtext}
              </p>
            </div>

            {/* SEARCH BAR CONTAINER */}
            <div className="mb-12 sm:mb-16">
              <UnifiedSearchBar />
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="mb-12 sm:mb-16">
              <div className="mb-4">
                <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-orange" />
                  <span>{t.quickActions}</span>
                </h2>
              </div>
              <QuickActions />
            </div>

            {/* POPULAR JOURNEYS */}
            <div className="mb-8">
              <PopularDestinations />
            </div>

            {/* Key Platform Highlights (Visible only in desktop view) */}
            {deviceView === 'desktop' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-4">
                  <div className="bg-brand-orange/10 p-3 rounded-2xl text-brand-orange h-fit shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">Sub-200ms Search</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Optimistic client-side caching ensures lightning fast inventory load speeds.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-sky-500/10 p-3 rounded-2xl text-sky-500 h-fit shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">Tatkal-Window Ready</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Virtual seat queues ensure 0% failures during heavy booking spike intervals.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500 h-fit shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">100% WCAG Accessible</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Full compliance with screen reader and accessibility standards for equal access.</p>
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
