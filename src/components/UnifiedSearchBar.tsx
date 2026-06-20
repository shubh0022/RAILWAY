'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Train, Plane, Hotel, Calendar, MapPin, Search, ArrowRightLeft, Bus, Compass, Car } from 'lucide-react';
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

const BUS_STOPS = [
  { name: 'Delhi ISBT Kashmiri Gate', code: 'DEL-ISBT' },
  { name: 'Mumbai Borivali', code: 'BOM-BOR' },
  { name: 'Goa Panaji Bus Stand', code: 'GOI-PAN' },
  { name: 'Bengaluru Majestic', code: 'BLR-MAJ' }
];

const METRO_STATIONS = [
  { name: 'New Delhi Metro Station', code: 'NDLS-M' },
  { name: 'Chandni Chowk Metro', code: 'CC-M' },
  { name: 'Huda City Centre', code: 'HCC-M' },
  { name: 'IGI Airport T3 Metro', code: 'AP-M' }
];

const CAB_POINTS = [
  { name: 'IGI Airport Terminal 3', code: 'AP-T3' },
  { name: 'New Delhi Railway Station (Paharganj)', code: 'NDLS-P' },
  { name: 'Connaught Place Block A', code: 'CP-A' },
  { name: 'Noida Sector 62', code: 'ND-62' }
];

export const UnifiedSearchBar: React.FC = () => {
  const router = useRouter();
  const { setSearchQuery, setResults, setIsLoading, language } = useAppStore();
  
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

  // Concession Preferences State (IRCTC Exclusive)
  const [flexibleDate, setFlexibleDate] = React.useState(false);
  const [divyaangjan, setDivyaangjan] = React.useState(false);
  const [availableBerth, setAvailableBerth] = React.useState(false);
  const [railwayPass, setRailwayPass] = React.useState(false);

  // Auto select Quota to DIVYAANGJAN when checked
  React.useEffect(() => {
    if (divyaangjan) {
      setQuota('DIVYAANGJAN');
    } else if (quota === 'DIVYAANGJAN') {
      setQuota('GENERAL');
    }
  }, [divyaangjan]);

  // Suggestions depending on active tab
  const getSuggestions = () => {
    if (activeTab === 'train') return TRAIN_STATIONS;
    if (activeTab === 'flight') return FLIGHT_AIRPORTS;
    if (activeTab === 'hotel') return HOTEL_CITIES;
    if (activeTab === 'bus') return BUS_STOPS;
    if (activeTab === 'metro') return METRO_STATIONS;
    return CAB_POINTS;
  };

  const filteredFromSuggestions = getSuggestions().filter(
    item => item.name.toLowerCase().includes(fromText.toLowerCase()) || 
            item.code.toLowerCase().includes(fromText.toLowerCase())
  );

  const filteredToSuggestions = getSuggestions().filter(
    item => item.name.toLowerCase().includes(toText.toLowerCase()) || 
            item.code.toLowerCase().includes(toText.toLowerCase())
  );

  // Set default search parameters based on Tab
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
    } else if (activeTab === 'hotel') {
      setFromText('Goa');
      setFromCode('GOI');
      setToText('Cidade de Goa');
      setToCode('');
    } else if (activeTab === 'bus') {
      setFromText('Delhi ISBT Kashmiri Gate');
      setFromCode('DEL-ISBT');
      setToText('Mumbai Borivali');
      setToCode('BOM-BOR');
    } else if (activeTab === 'metro') {
      setFromText('New Delhi Metro Station');
      setFromCode('NDLS-M');
      setToText('IGI Airport T3 Metro');
      setToCode('AP-M');
    } else {
      setFromText('Connaught Place Block A');
      setFromCode('CP-A');
      setToText('IGI Airport Terminal 3');
      setToCode('AP-T3');
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
      } else if (activeTab === 'bus') {
        const results = await searchService.searchBuses(query);
        setResults('bus', results);
      } else if (activeTab === 'metro') {
        const results = await searchService.searchMetros(query);
        setResults('metro', results);
      } else if (activeTab === 'cab') {
        const results = await searchService.searchCabs(query);
        setResults('cab', results);
      }
      
      router.push('/search');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabItems = [
    { id: 'train', label: language === 'en' ? 'Trains' : 'ट्रेनें', icon: <Train className="w-4 h-4" /> },
    { id: 'flight', label: language === 'en' ? 'Flights' : 'उड़ानें', icon: <Plane className="w-4 h-4" /> },
    { id: 'hotel', label: language === 'en' ? 'Hotels' : 'होटल', icon: <Hotel className="w-4 h-4" /> },
    { id: 'bus', label: language === 'en' ? 'Buses' : 'बसें', icon: <Bus className="w-4 h-4" /> },
    { id: 'metro', label: language === 'en' ? 'Metro' : 'मेट्रो', icon: <Compass className="w-4 h-4" /> },
    { id: 'cab', label: language === 'en' ? 'Cabs' : 'कैब', icon: <Car className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Category Tabs Toggle */}
      <div className="mb-6 overflow-x-auto pb-1 flex justify-center">
        <Tabs
          tabs={tabItems}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as BookingType)}
          variant="segmented"
          className="max-w-fit"
        />
      </div>

      {/* Main Search Panel Form (BOOK TICKET styling) */}
      <div className="glass-panel rounded-3xl shadow-2xl overflow-hidden border border-white/10 dark:border-white/5 bg-slate-900/40 backdrop-blur-xl">
        
        {/* Book Ticket Card Title */}
        <div className="bg-brand-blue py-4 px-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-base font-black uppercase text-white tracking-widest flex items-center gap-2">
            <Search className="w-4 h-4 text-brand-orange" />
            <span>{language === 'en' ? 'Book Transit Ticket' : 'टिकट बुक करें'}</span>
          </h2>
          <span className="text-[10px] font-black text-brand-orange-light tracking-wide bg-brand-orange/10 px-2 py-0.5 rounded uppercase">
            Tatkal Window Ready
          </span>
        </div>

        <form onSubmit={handleSearch} className="p-5 sm:p-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            
            {/* FROM INPUT */}
            <div className="md:col-span-3 relative">
              <label className="block text-xs font-bold text-slate-350 dark:text-slate-400 uppercase tracking-wider mb-2">
                {language === 'en' ? 'From (Origin)' : 'कहाँ से (मूल)'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 w-5 h-5" />
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
                  placeholder="Departure station/location"
                  className="w-full pl-12 pr-4 py-3 bg-brand-blue/35 border border-white/10 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-white font-bold text-sm"
                />
                {fromCode && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                    {fromCode}
                  </span>
                )}
              </div>
              
              {/* suggestions */}
              {showFromSuggestions && filteredFromSuggestions.length > 0 && (
                <ul className="absolute top-[102%] left-0 w-full bg-brand-blue-dark border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto p-1.5 animate-fade-in">
                  {filteredFromSuggestions.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        onClick={() => {
                          setFromText(item.name);
                          setFromCode(item.code);
                          setShowFromSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-xl flex items-center justify-between text-xs cursor-pointer text-slate-300 hover:text-white"
                      >
                        <span className="font-bold">{item.name}</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase">{item.code}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* SWAP BUTTON */}
            <div className="flex justify-center -my-2 md:my-0 md:col-span-1">
              <button
                type="button"
                onClick={swapFromTo}
                aria-label="Swap origin and destination"
                className="p-2.5 rounded-full bg-white/5 border border-white/10 shadow-md hover:shadow-lg text-brand-orange active:scale-95 transition-all hover:bg-white/10 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4 rotate-90 md:rotate-0" />
              </button>
            </div>

            {/* TO INPUT */}
            <div className="md:col-span-3 relative">
              <label className="block text-xs font-bold text-slate-350 dark:text-slate-400 uppercase tracking-wider mb-2">
                {language === 'en' ? 'To (Destination)' : 'कहाँ तक (गंतव्य)'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-455 w-5 h-5" />
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
                  placeholder="Destination location"
                  className="w-full pl-12 pr-4 py-3 bg-brand-blue/35 border border-white/10 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-white font-bold text-sm"
                />
                {toCode && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                    {toCode}
                  </span>
                )}
              </div>
              
              {/* suggestions */}
              {showToSuggestions && filteredToSuggestions.length > 0 && (
                <ul className="absolute top-[102%] left-0 w-full bg-brand-blue-dark border border-white/10 rounded-2xl shadow-2xl z-30 max-h-[220px] overflow-y-auto p-1.5 animate-fade-in">
                  {filteredToSuggestions.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        onClick={() => {
                          setToText(item.name);
                          setToCode(item.code);
                          setShowToSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-xl flex items-center justify-between text-xs cursor-pointer text-slate-300 hover:text-white"
                      >
                        <span className="font-bold">{item.name}</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase">{item.code}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* DATE PICKER */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-350 dark:text-slate-400 uppercase tracking-wider mb-2">
                {language === 'en' ? 'Journey Date' : 'यात्रा की तिथि'}
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 w-5 h-5 pointer-events-none" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-brand-blue/35 border border-white/10 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-white font-bold text-sm"
                />
              </div>
            </div>

            {/* CLASS OR PREFERENCE FILTER */}
            <div className="md:col-span-2 flex flex-col justify-stretch">
              <label className="block text-xs font-bold text-slate-350 dark:text-slate-400 uppercase tracking-wider mb-2">
                {activeTab === 'train' ? 'Class' : activeTab === 'flight' ? 'Cabin' : activeTab === 'hotel' ? 'Rooms' : 'Options'}
              </label>
              
              {activeTab === 'train' ? (
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value as TrainClass)}
                  className="w-full px-4 py-3 bg-brand-blue-dark border border-white/10 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-white font-bold text-sm appearance-none cursor-pointer"
                >
                  <option value="3A">AC 3 Tier (3A)</option>
                  <option value="2A">AC 2 Tier (2A)</option>
                  <option value="1A">AC First Class (1A)</option>
                  <option value="SL">Sleeper Class (SL)</option>
                  <option value="CC">AC Chair Car (CC)</option>
                  <option value="2S">Second Sitting (2S)</option>
                </select>
              ) : activeTab === 'flight' ? (
                <select
                  className="w-full px-4 py-3 bg-brand-blue-dark border border-white/10 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-white font-bold text-sm appearance-none cursor-pointer"
                >
                  <option value="Economy">Economy Cabin</option>
                  <option value="Business">Business Cabin</option>
                </select>
              ) : activeTab === 'hotel' ? (
                <select
                  className="w-full px-4 py-3 bg-brand-blue-dark border border-white/10 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-white font-bold text-sm appearance-none cursor-pointer"
                >
                  <option value="1">1 Room, 1 Adult</option>
                  <option value="2">1 Room, 2 Adults</option>
                  <option value="3">2 Rooms, 4 Adults</option>
                </select>
              ) : activeTab === 'bus' ? (
                <select
                  className="w-full px-4 py-3 bg-brand-blue-dark border border-white/10 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-white font-bold text-sm appearance-none cursor-pointer"
                >
                  <option value="Sleeper">AC Sleeper</option>
                  <option value="Seater">AC Seater</option>
                </select>
              ) : activeTab === 'metro' ? (
                <select
                  className="w-full px-4 py-3 bg-brand-blue-dark border border-white/10 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-white font-bold text-sm appearance-none cursor-pointer"
                >
                  <option value="Single">Single Journey Token</option>
                  <option value="SmartCard">Metro Smart Card</option>
                </select>
              ) : (
                <select
                  className="w-full px-4 py-3 bg-brand-blue-dark border border-white/10 dark:border-slate-800 rounded-2xl outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition-all text-white font-bold text-sm appearance-none cursor-pointer"
                >
                  <option value="Sedan">Prime Sedan Cab</option>
                  <option value="SUV">Prime SUV Cab</option>
                  <option value="Auto">Auto Rickshaw</option>
                </select>
              )}
            </div>

            {/* SEARCH BUTTON */}
            <div className="md:col-span-1 flex justify-stretch">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 text-center rounded-2xl shrink-0 cursor-pointer font-bold text-sm"
                aria-label="Search"
                leftIcon={<Search className="w-4 h-4 text-white" />}
              >
                <span className="md:hidden ml-1">Search</span>
              </Button>
            </div>

          </div>

          {/* Quotas Options for Trains (IRCTC style) */}
          {activeTab === 'train' && (
            <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
              {/* Quotas selector */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-black text-slate-350 dark:text-slate-400 uppercase tracking-wider">
                  {language === 'en' ? 'Quota Preference:' : 'कोटा प्राथमिकता:'}
                </span>
                {['GENERAL', 'TATKAL', 'LADIES', 'SR_CITIZEN'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setQuota(q as TrainQuota);
                      if (q !== 'DIVYAANGJAN') setDivyaangjan(false);
                    }}
                    className={`
                      px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border
                      ${quota === q 
                        ? 'bg-brand-orange/20 text-brand-orange border-brand-orange/45 scale-102' 
                        : 'text-slate-300 hover:text-white bg-white/5 border-transparent'}
                    `}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Concessional Options Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={flexibleDate}
                    onChange={(e) => setFlexibleDate(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-orange bg-brand-blue-dark/50 border-white/10 focus:ring-brand-orange/30"
                  />
                  <span>Flexible with Date</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={divyaangjan}
                    onChange={(e) => setDivyaangjan(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-orange bg-brand-blue-dark/50 border-white/10 focus:ring-brand-orange/30"
                  />
                  <span>Divyaangjan Cardholder</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={availableBerth}
                    onChange={(e) => setAvailableBerth(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-orange bg-brand-blue-dark/50 border-white/10 focus:ring-brand-orange/30"
                  />
                  <span>Train with Available Berth</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={railwayPass}
                    onChange={(e) => setRailwayPass(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-orange bg-brand-blue-dark/50 border-white/10 focus:ring-brand-orange/30"
                  />
                  <span>Railway Pass Concession</span>
                </label>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UnifiedSearchBar;
