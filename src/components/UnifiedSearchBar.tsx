'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Train, Plane, Hotel, Calendar, MapPin, Search, ArrowRightLeft } from 'lucide-react';
import { useAppStore } from '../store';
import { searchService } from '../services/searchService';
import { BookingType, TrainQuota, TrainClass } from '../types';
import Button from './ui/Button';
import Tabs from './ui/Tabs';

// Station details for autocompletes
const TRAIN_STATIONS = [
  { name: 'New Delhi', code: 'NDLS' },
  { name: 'Kolkata Howrah', code: 'HWH' },
  { name: 'Mumbai Central', code: 'MMCT' },
  { name: 'Madgaon (Goa)', code: 'MAO' },
  { name: 'KSR Bengaluru', code: 'SBC' },
  { name: 'Bhopal Habibganj', code: 'RKMP' }
];

const FLIGHT_AIRPORTS = [
  { name: 'New Delhi', code: 'DEL' },
  { name: 'Mumbai', code: 'BOM' },
  { name: 'Goa', code: 'GOI' },
  { name: 'Bengaluru', code: 'BLR' },
  { name: 'Kolkata', code: 'CCU' }
];

const HOTEL_CITIES = [
  { name: 'Mumbai', code: 'BOM' },
  { name: 'Goa', code: 'GOI' },
  { name: 'Kolkata', code: 'CCU' },
  { name: 'New Delhi', code: 'DEL' }
];

export const UnifiedSearchBar: React.FC = () => {
  const router = useRouter();
  const { setSearchQuery, setResults, setIsLoading } = useAppStore();
  
  const [activeTab, setActiveTab] = React.useState<BookingType>('train');
  const [fromText, setFromText] = React.useState('');
  const [fromCode, setFromCode] = React.useState('');
  const [toText, setToText] = React.useState('');
  const [toCode, setToCode] = React.useState('');
  const [date, setDate] = React.useState('');
  const [travelClass, setTravelClass] = React.useState<TrainClass>('3A');
  const [quota, setQuota] = React.useState<TrainQuota>('GENERAL');
  
  const [showFromSuggestions, setShowFromSuggestions] = React.useState(false);
  const [showToSuggestions, setShowToSuggestions] = React.useState(false);

  // Suggestions depending on active tab
  const getSuggestions = () => {
    if (activeTab === 'train') return TRAIN_STATIONS;
    if (activeTab === 'flight') return FLIGHT_AIRPORTS;
    return HOTEL_CITIES;
  };

  const filteredFromSuggestions = getSuggestions().filter(
    item => item.name.toLowerCase().includes(fromText.toLowerCase()) || 
            item.code.toLowerCase().includes(fromText.toLowerCase())
  );

  const filteredToSuggestions = getSuggestions().filter(
    item => item.name.toLowerCase().includes(toText.toLowerCase()) || 
            item.code.toLowerCase().includes(toText.toLowerCase())
  );

  // Set default search parameters
  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);

    if (activeTab === 'train') {
      setFromText('New Delhi');
      setFromCode('NDLS');
      setToText('Madgaon (Goa)');
      setToCode('MAO');
    } else if (activeTab === 'flight') {
      setFromText('New Delhi');
      setFromCode('DEL');
      setToText('Goa');
      setToCode('GOI');
    } else {
      setFromText('Anywhere');
      setFromCode('');
      setToText('Goa');
      setToCode('GOI');
    }
  }, [activeTab]);

  // Swap fields
  const swapFromTo = () => {
    const tempText = fromText;
    const tempCode = fromCode;
    setFromText(toText);
    setFromCode(toCode);
    setToText(tempText);
    setToCode(tempCode);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const query = {
      type: activeTab,
      from: fromText,
      fromCode,
      to: toText,
      toCode,
      date,
      travelClass,
      quota
    };

    setSearchQuery(query);

    try {
      if (activeTab === 'train') {
        const results = await searchService.searchTrains(query);
        setResults('train', results);
      } else if (activeTab === 'flight') {
        const results = await searchService.searchFlights(query);
        setResults('flight', results);
      } else if (activeTab === 'hotel') {
        const results = await searchService.searchHotels(query);
        setResults('hotel', results);
      }
      
      router.push('/search');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabItems = [
    { id: 'train', label: 'Trains', icon: <Train className="w-4 h-4" /> },
    { id: 'flight', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
    { id: 'hotel', label: 'Hotels', icon: <Hotel className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full">
      {/* Category Tabs Toggle */}
      <div className="max-w-[450px] mx-auto mb-6">
        <Tabs
          tabs={tabItems}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as BookingType)}
          variant="segmented"
        />
      </div>

      {/* Main Search Panel Form */}
      <form onSubmit={handleSearch} className="glass-panel p-5 sm:p-7 rounded-3xl shadow-xl shadow-slate-900/10 dark:shadow-slate-950/40 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          
          {/* FROM INPUT */}
          <div className="lg:col-span-3 relative">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              From (Origin)
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={fromText}
                onChange={(e) => {
                  setFromText(e.target.value);
                  setFromCode('');
                  setShowFromSuggestions(true);
                }}
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                placeholder="Departure city/station"
                className="w-full pl-12 pr-4 py-3.5 text-base font-bold bg-slate-50 dark:bg-brand-blue-dark/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-slate-800 dark:text-slate-100"
              />
              {fromCode && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400 bg-slate-200/55 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {fromCode}
                </span>
              )}
            </div>
            
            {/* suggestions */}
            {showFromSuggestions && filteredFromSuggestions.length > 0 && (
              <ul className="absolute top-[102%] left-0 w-full bg-white dark:bg-brand-blue-dark border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 max-h-[220px] overflow-y-auto overflow-x-hidden p-1.5 animate-fade-in">
                {filteredFromSuggestions.map((item) => (
                  <li key={item.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setFromText(item.name);
                        setFromCode(item.code);
                        setShowFromSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl flex items-center justify-between text-sm cursor-pointer"
                    >
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase">{item.code}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SWAP BUTTON */}
          <div className="flex justify-center -my-2 lg:my-0 lg:col-span-1">
            <button
              type="button"
              onClick={swapFromTo}
              aria-label="Swap origin and destination"
              className="p-3 rounded-full bg-white dark:bg-brand-blue border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg text-brand-orange active:scale-95 transition-all hover:bg-slate-50 dark:hover:bg-brand-blue-light/20 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4 rotate-90 lg:rotate-0" />
            </button>
          </div>

          {/* TO INPUT */}
          <div className="lg:col-span-3 relative">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              To (Destination)
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={toText}
                onChange={(e) => {
                  setToText(e.target.value);
                  setToCode('');
                  setShowToSuggestions(true);
                }}
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                placeholder="Destination city/station"
                className="w-full pl-12 pr-4 py-3.5 text-base font-bold bg-slate-50 dark:bg-brand-blue-dark/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-slate-800 dark:text-slate-100"
              />
              {toCode && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400 bg-slate-200/55 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {toCode}
                </span>
              )}
            </div>
            
            {/* suggestions */}
            {showToSuggestions && filteredToSuggestions.length > 0 && (
              <ul className="absolute top-[102%] left-0 w-full bg-white dark:bg-brand-blue-dark border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 max-h-[220px] overflow-y-auto overflow-x-hidden p-1.5 animate-fade-in">
                {filteredToSuggestions.map((item) => (
                  <li key={item.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setToText(item.name);
                        setToCode(item.code);
                        setShowToSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl flex items-center justify-between text-sm cursor-pointer"
                    >
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase">{item.code}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* DATE PICKER */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Journey Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-base font-bold bg-slate-50 dark:bg-brand-blue-dark/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* CLASS OR PREFERENCE FILTER */}
          <div className="lg:col-span-2">
            {activeTab === 'train' ? (
              <>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Class
                </label>
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value as TrainClass)}
                  className="w-full px-4 py-3.5 text-base font-bold bg-slate-50 dark:bg-brand-blue-dark/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-slate-800 dark:text-slate-100 appearance-none"
                >
                  <option value="1A">AC First Class (1A)</option>
                  <option value="2A">AC 2 Tier (2A)</option>
                  <option value="3A">AC 3 Tier (3A)</option>
                  <option value="SL">Sleeper Class (SL)</option>
                  <option value="CC">AC Chair Car (CC)</option>
                </select>
              </>
            ) : activeTab === 'flight' ? (
              <>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Cabin
                </label>
                <select
                  className="w-full px-4 py-3.5 text-base font-bold bg-slate-50 dark:bg-brand-blue-dark/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-slate-800 dark:text-slate-100 appearance-none"
                >
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                </select>
              </>
            ) : (
              <>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Guests
                </label>
                <select
                  className="w-full px-4 py-3.5 text-base font-bold bg-slate-50 dark:bg-brand-blue-dark/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-slate-800 dark:text-slate-100 appearance-none"
                >
                  <option value="1">1 Room, 1 Adult</option>
                  <option value="2">1 Room, 2 Adults</option>
                  <option value="3">2 Rooms, 4 Adults</option>
                </select>
              </>
            )}
          </div>

          {/* SEARCH BUTTON */}
          <div className="lg:col-span-1 flex justify-stretch">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-center rounded-2xl shrink-0"
              aria-label="Search"
              leftIcon={<Search className="w-5 h-5 text-white" />}
            >
              <span className="lg:hidden ml-1">Search</span>
            </Button>
          </div>

        </div>

        {/* Quota Row for trains */}
        {activeTab === 'train' && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quota:
            </span>
            {['GENERAL', 'TATKAL', 'LADIES', 'SR_CITIZEN'].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuota(q as TrainQuota)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer
                  ${quota === q 
                    ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/30' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-50 dark:bg-brand-blue-dark/30 border border-transparent'}
                `}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default UnifiedSearchBar;
