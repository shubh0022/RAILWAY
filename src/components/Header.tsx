'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WifiOff, Menu, User, Phone, Bell, Shield, Wallet, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAppStore } from '../store';
import Button from './ui/Button';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { isOfflineMode, setOfflineMode, bookings, language, setLanguage, walletBalance } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const navItems = [
    { label: language === 'en' ? 'Trains' : 'ट्रेनें', path: '/' },
    { label: language === 'en' ? 'My Bookings' : 'मेरी बुकिंग', path: '/post-booking', badge: bookings.length > 0 ? bookings.length : undefined },
    { label: language === 'en' ? 'Ops Telemetry' : 'ऑप्स टेलीमेट्री', path: '/admin' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg text-slate-800 dark:text-white">
      {/* TOP ROW: UTILITY BAR (Deep Blue) */}
      <div className="w-full bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/5 flex items-center justify-between">
        {/* Left Links */}
        <div className="flex items-center gap-4 sm:gap-6 font-semibold">
          <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
            <Phone className="w-3.5 h-3.5 text-brand-orange-light" />
            <span className="hidden sm:inline">Support Helpline</span> <span>139</span>
          </a>
          <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
            <Shield className="w-3.5 h-3.5 text-brand-orange-light" />
            <span>Safety Alerts</span>
          </a>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Offline/Online Network simulator */}
          <button
            onClick={() => setOfflineMode(!isOfflineMode)}
            aria-label="Toggle offline network mode simulation"
            className={`
              px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all duration-300 flex items-center gap-1.5 border cursor-pointer
              ${isOfflineMode 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'}
            `}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3 h-3" />
                Offline
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Network
              </>
            )}
          </button>

          {/* i18n switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="font-bold text-xs hover:text-white cursor-pointer"
          >
            {language === 'en' ? 'हिन्दी' : 'ENGLISH'}
          </button>
        </div>
      </div>

      {/* BOTTOM ROW: MAIN HEADER BAR (Navy/White Glassmorphic) */}
      <div className="w-full bg-brand-blue-dark/95 backdrop-blur-md border-b border-white/5 py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Double Branding Logos */}
          <div className="flex items-center gap-3">
            {/* Custom SVG IRCTC Logo */}
            <Link href="/" className="flex items-center gap-2 focus-visible:outline-none shrink-0">
              <div className="bg-brand-blue-light/45 p-1 rounded-xl border border-white/10 hover:border-brand-orange/40 transition-colors">
                <svg className="w-8 h-8 text-brand-orange-light" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M20,20 L50,10 L80,20 L80,60 L50,90 L20,60 Z" fill="none" stroke="currentColor" strokeWidth="4"/>
                  <path d="M42,30 H58 C64,30 68,34 68,40 C68,46 64,50 58,50 H42 M55,50 L70,72" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10,50 Q50,90 90,50" fill="none" stroke="#fb7613" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M15,40 Q50,10 85,40" fill="none" stroke="#fb7613" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="leading-none hidden xs:block">
                <span className="font-extrabold text-lg tracking-tight text-white block">
                  IRCTC
                </span>
                <span className="text-[10px] font-black text-brand-orange-light block tracking-wider uppercase">
                  Rail Connect
                </span>
              </div>
            </Link>

            {/* Splitter Line */}
            <div className="w-px h-8 bg-white/10 hidden xs:block" />

            {/* Indian Railways Circular Emblem */}
            <div className="flex items-center gap-2 shrink-0">
              <svg className="w-8 h-8 text-white hidden xs:block" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2"/>
                <path d="M30,55 L70,55 M35,62 L65,62 M40,69 L60,69" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <rect x="42" y="32" width="16" height="18" rx="2" fill="currentColor"/>
                <circle cx="47" cy="46" r="2" fill="white"/>
                <circle cx="53" cy="46" r="2" fill="white"/>
                <path d="M45,50 L55,50" stroke="white" strokeWidth="1.5"/>
              </svg>
              <div className="leading-none text-left hidden sm:block">
                <span className="text-[9px] font-black text-slate-400 block tracking-wider uppercase">GOVERNMENT OF INDIA</span>
                <span className="text-[10px] font-bold text-white block">INDIAN RAILWAYS</span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2
                    ${isActive 
                      ? 'bg-white/10 text-brand-orange' 
                      : 'text-slate-350 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {item.label}
                  {item.badge !== undefined && (
                    <span className="bg-brand-orange text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Wallet & Profile */}
          <div className="flex items-center gap-3">
            {/* National Mobility Wallet HUD (Module 14) */}
            <div className="bg-brand-blue-light/20 border border-white/5 py-1.5 px-3 rounded-xl flex items-center gap-2 text-white shadow-inner">
              <Wallet className="w-4 h-4 text-brand-orange-light" />
              <div className="text-left leading-none">
                <span className="text-[9px] font-semibold text-slate-400 block">WALLET</span>
                <span className="text-sm font-black text-white">₹{walletBalance.toFixed(2)}</span>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 bg-brand-blue/60 hover:bg-brand-blue/90 border border-white/10 py-1.5 px-3 rounded-xl text-sm font-bold transition-all text-white cursor-pointer select-none"
              >
                <div className="w-5 h-5 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center font-black text-xs border border-brand-orange/20">
                  S
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">Shubham</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-brand-blue-dark border border-white/15 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-1 text-slate-200 text-xs animate-fade-in">
                  <div className="px-3 py-2 border-b border-white/5">
                    <span className="block font-black text-white">Shubham Kumar</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">IRCTC Account: active</span>
                  </div>
                  <button onClick={() => setProfileOpen(false)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
                    <Settings className="w-3.5 h-3.5 text-slate-400" /> Account Settings
                  </button>
                  <button onClick={() => setProfileOpen(false)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
                    <Bell className="w-3.5 h-3.5 text-slate-400" /> Notifications
                  </button>
                  <button onClick={() => setProfileOpen(false)} className="w-full text-left px-3 py-2 hover:bg-rose-500/10 text-rose-400 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
                    <LogOut className="w-3.5 h-3.5" /> Logout Account
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-350 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-brand-blue-dark/95 backdrop-blur-lg px-4 py-4 flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-bold text-slate-200 hover:text-white hover:bg-white/5 flex items-center justify-between"
            >
              {item.label}
              {item.badge !== undefined && (
                <span className="bg-brand-orange text-white text-xs px-2 py-0.5 rounded-full font-black animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="h-px bg-white/5 my-2" />
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-brand-orange-light" />
              <span className="text-xs font-bold text-slate-300">Wallet: ₹{walletBalance.toFixed(2)}</span>
            </div>
            <span className="text-xs font-semibold text-slate-400">Shubham Kumar</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
