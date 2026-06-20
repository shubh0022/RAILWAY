'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Train, Plane } from 'lucide-react';
import Card from './ui/Card';
import { useAppStore } from '../store';
import { searchService } from '../services/searchService';

interface Destination {
  city: string;
  code: string;
  trainCount: number;
  flightCount: number;
  image: string;
}

const DESTINATIONS: Destination[] = [
  {
    city: 'Goa',
    code: 'MAO',
    trainCount: 24,
    flightCount: 42,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'
  },
  {
    city: 'Mumbai',
    code: 'MMCT',
    trainCount: 145,
    flightCount: 289,
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=400&q=80'
  },
  {
    city: 'Kolkata',
    code: 'HWH',
    trainCount: 98,
    flightCount: 154,
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=400&q=80'
  },
  {
    city: 'Chennai',
    code: 'MAS',
    trainCount: 76,
    flightCount: 120,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80'
  }
];

export const PopularDestinations: React.FC = () => {
  const router = useRouter();
  const { setSearchQuery, setResults, setIsLoading } = useAppStore();

  const handleDestinationClick = async (dest: Destination) => {
    setIsLoading(true);
    
    // Default search is Train from New Delhi (NDLS) to Selected City
    const query = {
      type: 'train' as const,
      from: 'New Delhi',
      fromCode: 'NDLS',
      to: dest.city,
      toCode: dest.code,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      travelClass: '3A' as const,
      quota: 'GENERAL' as const
    };

    setSearchQuery(query);

    try {
      const results = await searchService.searchTrains(query);
      setResults('train', results);
      router.push('/search');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Popular Journeys
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
            Top destinations chosen by travellers this week
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {DESTINATIONS.map((dest) => (
          <button
            key={dest.code}
            onClick={() => handleDestinationClick(dest)}
            className="text-left w-full focus:outline-none focus-visible:ring-3 focus-visible:ring-brand-orange rounded-3xl cursor-pointer"
          >
            <Card variant="interactive" className="h-64 flex flex-col relative group border-white/5 dark:bg-brand-blue-dark/40">
              {/* Background Image overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85" />
              
              {/* Card Contents */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white z-10">
                <span className="text-2xl font-black tracking-tight">{dest.city}</span>
                <span className="text-xs text-slate-300 font-semibold block mt-0.5">India</span>
                
                {/* Stats */}
                <div className="flex gap-4 mt-3 pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Train className="w-3.5 h-3.5 text-brand-orange-light" />
                    <span>{dest.trainCount} Trains</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <Plane className="w-3.5 h-3.5 text-sky-400" />
                    <span>{dest.flightCount} Flights</span>
                  </div>
                </div>
              </div>

              {/* Hover active highlight bar */}
              <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-[linear-gradient(90deg,#ff7e47,#f55a14)] transition-all duration-300 group-hover:w-full" />
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularDestinations;
