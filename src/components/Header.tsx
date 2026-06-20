'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Train, WifiOff, Menu, User } from 'lucide-react';
import { useAppStore } from '../store';
import Button from './ui/Button';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { isOfflineMode, setOfflineMode, bookings } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'My Bookings', path: '/post-booking', badge: bookings.length > 0 ? bookings.length : undefined },
    { label: 'Ops Dashboard', path: '/admin' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-blue-dark/80 backdrop-blur-md border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none">
            <div className="bg-[linear-gradient(135deg,#ff7e47_0%,#f55a14_100%)] p-2 rounded-xl shadow-md">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                IRCTC
              </span>
              <span className="text-xs sm:text-sm font-bold text-brand-orange-light block -mt-1 tracking-wider uppercase">
                Rail Connect
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
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
                      : 'text-slate-300 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {item.label}
                  {item.badge !== undefined && (
                    <span className="bg-brand-orange text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Controls & Simulation Toggles */}
          <div className="hidden md:flex items-center gap-3">
            {/* Offline Simulation toggle */}
            <button
              onClick={() => setOfflineMode(!isOfflineMode)}
              aria-label="Toggle offline network mode simulation"
              className={`
                px-3 py-1.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 border cursor-pointer
                ${isOfflineMode 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse' 
                  : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10 hover:bg-emerald-500/10'}
              `}
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  Offline Sim
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sim
                </>
              )}
            </button>

            <Button
              variant="glass"
              size="sm"
              leftIcon={<User className="w-4 h-4 text-brand-orange" />}
              className="font-bold"
            >
              Shubham Kumar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setOfflineMode(!isOfflineMode)}
              className={`p-1.5 rounded-lg border text-xs ${isOfflineMode ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' : 'text-slate-400 border-white/5'}`}
            >
              {isOfflineMode ? <WifiOff className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-emerald-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-brand-blue-dark/95 backdrop-blur-lg px-4 py-4 flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-semibold text-slate-200 hover:text-white hover:bg-white/5 flex items-center justify-between"
            >
              {item.label}
              {item.badge !== undefined && (
                <span className="bg-brand-orange text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="h-px bg-white/5 my-2" />
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm font-medium text-slate-400">Shubham Kumar</span>
            <Button variant="glass" size="sm" leftIcon={<User className="w-4 h-4" />}>
              Profile
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
