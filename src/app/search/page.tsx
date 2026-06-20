'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Filter, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store';
import { searchService } from '../../services/searchService';
import { Train, Flight, Hotel, TrainClass } from '../../types';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card, { CardContent } from '../../components/ui/Card';

export default function SearchResults() {
  const router = useRouter();
  const { searchQuery, trainResults, flightResults, hotelResults, setResults, isLoading, setIsLoading, selectItemForBooking } = useAppStore();

  // Filters State
  const [selectedClasses, setSelectedClasses] = React.useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = React.useState<string[]>([]); // 'morning', 'afternoon', 'evening'
  const [maxPrice, setMaxPrice] = React.useState<number>(10000);
  const [onlyAvailable, setOnlyAvailable] = React.useState(false);

  // Selected class indicator for each train item (key: trainId, value: classCode)
  const [selectedTrainClass, setSelectedTrainClass] = React.useState<Record<string, TrainClass>>({});

  // Mock Calendar Dates around searched date
  const generateFareCalendar = () => {
    if (!searchQuery?.date) return [];
    const baseDate = new Date(searchQuery.date);
    return [-2, -1, 0, 1, 2].map((offset) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + offset);
      return {
        dateString: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        price: searchQuery.type === 'train' ? 2010 : searchQuery.type === 'flight' ? 4350 + offset * 150 : 8900 + offset * 300,
        isCheapest: offset === 1
      };
    });
  };

  const fareCalendar = generateFareCalendar();

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedClasses([]);
    setSelectedTimes([]);
    setMaxPrice(10000);
    setOnlyAvailable(false);
  };

  // Filter functions
  const filterTrains = (trains: Train[]) => {
    return trains.filter((t) => {
      // Time filter (Departure hour)
      const depHour = parseInt(t.departureTime.split(':')[0]);
      let timeMatch = true;
      if (selectedTimes.length > 0) {
        timeMatch = selectedTimes.some(time => {
          if (time === 'morning') return depHour >= 5 && depHour < 12;
          if (time === 'afternoon') return depHour >= 12 && depHour < 17;
          if (time === 'evening') return depHour >= 17 && depHour < 23;
          if (time === 'night') return depHour >= 23 || depHour < 5;
          return true;
        });
      }

      // Class filter
      let classMatch = true;
      if (selectedClasses.length > 0) {
        classMatch = t.classes.some(c => selectedClasses.includes(c));
      }

      // Availability filter
      let availMatch = true;
      if (onlyAvailable) {
        availMatch = Object.values(t.availability).some(av => av.status === 'AVAILABLE' && av.seats > 0);
      }

      return timeMatch && classMatch && availMatch;
    });
  };

  const filterFlights = (flights: Flight[]) => {
    return flights.filter((f) => {
      const depHour = parseInt(f.departureTime.split(':')[0]);
      let timeMatch = true;
      if (selectedTimes.length > 0) {
        timeMatch = selectedTimes.some(time => {
          if (time === 'morning') return depHour >= 5 && depHour < 12;
          if (time === 'afternoon') return depHour >= 12 && depHour < 17;
          if (time === 'evening') return depHour >= 17 && depHour < 23;
          if (time === 'night') return depHour >= 23 || depHour < 5;
          return true;
        });
      }

      const priceMatch = f.price <= maxPrice;
      const availMatch = !onlyAvailable || f.seatsRemaining > 0;

      return timeMatch && priceMatch && availMatch;
    });
  };

  const filterHotels = (hotels: Hotel[]) => {
    return hotels.filter((h) => {
      const priceMatch = h.pricePerNight <= maxPrice;
      const availMatch = !onlyAvailable || h.roomsAvailable > 0;
      return priceMatch && availMatch;
    });
  };

  // Switch Calendar Day
  const handleCalendarDayClick = async (dateString: string) => {
    if (!searchQuery) return;
    setIsLoading(true);
    const updatedQuery = { ...searchQuery, date: dateString };
    useAppStore.setState({ searchQuery: updatedQuery });

    try {
      if (searchQuery.type === 'train') {
        const res = await searchService.searchTrains(updatedQuery);
        setResults('train', res);
      } else if (searchQuery.type === 'flight') {
        const res = await searchService.searchFlights(updatedQuery);
        setResults('flight', res);
      } else if (searchQuery.type === 'hotel') {
        const res = await searchService.searchHotels(updatedQuery);
        setResults('hotel', res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookTrain = (train: Train) => {
    const classCode = selectedTrainClass[train.id];
    if (!classCode) return;
    selectItemForBooking(train, 'train', classCode);
    router.push('/booking');
  };

  const handleBookFlight = (flight: Flight) => {
    selectItemForBooking(flight, 'flight', flight.class);
    router.push('/booking');
  };

  const handleBookHotel = (hotel: Hotel) => {
    selectItemForBooking(hotel, 'hotel', 'Deluxe Room');
    router.push('/booking');
  };

  if (!searchQuery) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <AlertTriangle className="w-16 h-16 text-brand-orange animate-bounce" />
        <h2 className="text-2xl font-black">No Search Query Active</h2>
        <p className="text-slate-500 max-w-md">Please return to the home screen and search for trains, flights, or hotels to inspect results.</p>
        <Button onClick={() => router.push('/')} variant="primary">
          Back to Home
        </Button>
      </div>
    );
  }

  // Filtered lists
  const filteredTrains = searchQuery.type === 'train' ? filterTrains(trainResults) : [];
  const filteredFlights = searchQuery.type === 'flight' ? filterFlights(flightResults) : [];
  const filteredHotels = searchQuery.type === 'hotel' ? filterHotels(hotelResults) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-blue-dark pb-20">
      
      {/* Dynamic Summary Bar */}
      <div className="bg-brand-blue text-white py-5 shadow-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-brand-orange-light tracking-widest uppercase block mb-1">
              Search Results
            </span>
            <div className="flex items-center gap-2.5 text-xl sm:text-2xl font-black tracking-tight">
              <span>{searchQuery.fromCode || searchQuery.from}</span>
              <span className="text-brand-orange">➔</span>
              <span>{searchQuery.toCode || searchQuery.to}</span>
            </div>
            <span className="text-xs text-slate-400 font-semibold block mt-1">
              Journey Date: {searchQuery.date} | Mode: {searchQuery.type.toUpperCase()} {searchQuery.quota ? `| Quota: ${searchQuery.quota}` : ''}
            </span>
          </div>

          <Button variant="glass" size="sm" onClick={() => router.push('/')} className="font-bold">
            Modify Search
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* FARE CALENDAR STRIP */}
        <div className="mb-8 overflow-x-auto pb-2 flex gap-3">
          {fareCalendar.map((day) => {
            const isSelected = day.dateString === searchQuery.date;
            return (
              <button
                key={day.dateString}
                onClick={() => handleCalendarDayClick(day.dateString)}
                className={`
                  flex-grow sm:flex-grow-0 min-w-[140px] p-3 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden
                  ${isSelected
                    ? 'bg-brand-orange/15 border-brand-orange text-brand-orange font-bold shadow-md shadow-brand-orange/5'
                    : 'bg-white dark:bg-brand-blue border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'}
                `}
              >
                {day.isCheapest && (
                  <span className="absolute top-0 right-0 bg-accent-green text-[8px] font-black text-white px-2 py-0.5 rounded-bl">
                    LOWEST
                  </span>
                )}
                <span className="block text-xs font-semibold uppercase tracking-wider">{day.label}</span>
                <span className="block text-base font-black mt-1">₹{day.price}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN RESULTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FILTER SIDEBAR */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 flex flex-col gap-6">
            <Card variant="glass" className="p-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-brand-orange" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-slate-400 hover:text-brand-orange flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Availability Filter */}
              <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <label className="flex items-center gap-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-orange focus:ring-brand-orange/35"
                  />
                  <span>Show Available Only</span>
                </label>
              </div>

              {/* Time of Day Filter */}
              <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Departure Time</span>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'morning', label: 'Morning (05:00 - 12:00)' },
                    { id: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
                    { id: 'evening', label: 'Evening (17:00 - 23:00)' },
                    { id: 'night', label: 'Night (23:00 - 05:00)' }
                  ].map((time) => {
                    const isChecked = selectedTimes.includes(time.id);
                    return (
                      <label key={time.id} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) setSelectedTimes(selectedTimes.filter(t => t !== time.id));
                            else setSelectedTimes([...selectedTimes, time.id]);
                          }}
                          className="w-4 h-4 rounded text-brand-orange"
                        />
                        <span>{time.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Class Filter (Only for trains) */}
              {searchQuery.type === 'train' && (
                <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Travel Classes</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['1A', '2A', '3A', 'SL', 'CC'].map((cls) => {
                      const isChecked = selectedClasses.includes(cls);
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            if (isChecked) setSelectedClasses(selectedClasses.filter(c => c !== cls));
                            else setSelectedClasses([...selectedClasses, cls]);
                          }}
                          className={`
                            py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer
                            ${isChecked 
                              ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                              : 'bg-slate-50 dark:bg-brand-blue-dark/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'}
                          `}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price range limit */}
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Max Price</span>
                <input
                  type="range"
                  min="300"
                  max="25000"
                  step="200"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
                <div className="flex justify-between text-xs font-extrabold text-slate-400 mt-2">
                  <span>₹300</span>
                  <span className="text-brand-orange">₹{maxPrice}</span>
                </div>
              </div>
            </Card>
          </div >

          {/* RESULTS LIST */}
          <div className="lg:col-span-9" >
            
            {/* Loading Skeleton state */}
            {isLoading && (
              <div className="flex flex-col gap-5">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-3xl h-48 shimmer-bg" />
                ))}
              </div>
            )}

            {/* Train Results */}
            {!isLoading && searchQuery.type === 'train' && (
              <div className="flex flex-col gap-5">
                {filteredTrains.length === 0 ? (
                  <div className="glass-panel p-10 text-center text-slate-400 rounded-3xl">No trains match your filter requirements.</div>
                ) : (
                  filteredTrains.map((train) => {
                    const currentSelected = selectedTrainClass[train.id];
                    
                    return (
                      <Card key={train.id} className="border-white/5 dark:bg-brand-blue/30 relative">
                        <CardContent className="p-5 sm:p-6">
                          {/* Top Row: Train number/name */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
                            <div>
                              <h3 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                                <span className="text-brand-orange">{train.number}</span>
                                <span>{train.name}</span>
                              </h3>
                              <span className="text-xs text-slate-400 font-semibold block mt-0.5">
                                Runs On: {train.runsOn.join(', ')}
                              </span>
                            </div>
                            <Badge variant="orange" size="sm">
                              {searchQuery.quota} Quota
                            </Badge>
                          </div>

                          {/* Middle Row: timings */}
                          <div className="grid grid-cols-12 gap-4 items-center mb-6">
                            <div className="col-span-4">
                              <span className="block text-2xl font-black text-slate-800 dark:text-white">{train.departureTime}</span>
                              <span className="block text-xs font-bold text-slate-400 uppercase mt-0.5">{train.fromCode}</span>
                              <span className="block text-xs text-slate-500 truncate">{train.from}</span>
                            </div>
                            
                            <div className="col-span-4 flex flex-col items-center justify-center text-center relative px-2">
                              <span className="text-xs text-slate-400 font-bold block mb-1">{train.duration}</span>
                              <div className="w-full flex items-center justify-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                <div className="flex-grow h-px border-t-2 border-dashed border-slate-200 dark:border-slate-800" />
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold block mt-1">Direct</span>
                            </div>

                            <div className="col-span-4 text-right">
                              <span className="block text-2xl font-black text-slate-800 dark:text-white">{train.arrivalTime}</span>
                              <span className="block text-xs font-bold text-slate-400 uppercase mt-0.5">{train.toCode}</span>
                              <span className="block text-xs text-slate-500 truncate">{train.to}</span>
                            </div>
                          </div>

                          {/* Classes Selector Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {train.classes.map((classCode) => {
                              const avail = train.availability[classCode];
                              if (!avail || avail.price === 0) return null;
                              
                              const isClassSelected = currentSelected === classCode;
                              const isAvail = avail.status === 'AVAILABLE';

                              return (
                                <button
                                  key={classCode}
                                  onClick={() => setSelectedTrainClass(prev => ({ ...prev, [train.id]: classCode }))}
                                  className={`
                                    p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer
                                    ${isClassSelected
                                      ? 'bg-brand-orange/15 border-brand-orange text-slate-800 dark:text-white scale-102 shadow-md shadow-brand-orange/5'
                                      : 'bg-slate-50 dark:bg-brand-blue-dark/50 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'}
                                  `}
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-black">{classCode}</span>
                                    <span className="text-xs font-black">₹{avail.price}</span>
                                  </div>
                                  <span className={`text-[10px] font-black tracking-wider uppercase block mt-1 ${isAvail ? 'text-accent-green' : 'text-accent-red'}`}>
                                    {isAvail ? `AV  ${avail.seats}` : `WL  ${avail.waitlistCount}`}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* CTA Row (Shows only when class selected) */}
                          {currentSelected && (
                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4 animate-fade-in">
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Selected Class: <span className="font-extrabold text-brand-orange text-sm ml-1">{currentSelected}</span>
                              </span>
                              <Button
                                onClick={() => handleBookTrain(train)}
                                variant="primary"
                                size="sm"
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                                className="font-bold"
                              >
                                Book Now
                              </Button>
                            </div>
                          )}

                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}

            {/* Flight Results */}
            {!isLoading && searchQuery.type === 'flight' && (
              <div className="flex flex-col gap-5">
                {filteredFlights.length === 0 ? (
                  <div className="glass-panel p-10 text-center text-slate-400 rounded-3xl">No flights match your filters.</div>
                ) : (
                  filteredFlights.map((flight) => (
                    <Card key={flight.id} className="border-white/5 dark:bg-brand-blue/30">
                      <CardContent className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                        {/* Carrier info */}
                        <div className="md:col-span-3 flex items-center gap-3">
                          <div className="text-2xl p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">{flight.logo}</div>
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-white block text-base leading-snug">{flight.airline}</span>
                            <span className="text-xs text-slate-400 block font-semibold mt-0.5">{flight.number}</span>
                          </div>
                        </div>

                        {/* Timings */}
                        <div className="md:col-span-6 grid grid-cols-7 items-center text-center">
                          <div className="col-span-2 text-left">
                            <span className="block text-lg font-black text-slate-800 dark:text-white">{flight.departureTime}</span>
                            <span className="block text-[10px] font-extrabold text-slate-400 uppercase mt-0.5">{flight.fromCode}</span>
                          </div>
                          
                          <div className="col-span-3 flex flex-col items-center">
                            <span className="text-[10px] text-slate-400 font-bold block mb-1">{flight.duration}</span>
                            <div className="w-full flex items-center justify-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                              <div className="flex-grow h-px border-t border-slate-200 dark:border-slate-800" />
                              <div className="w-1 h-1 rounded-full bg-brand-orange" />
                            </div>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{flight.stops === 0 ? 'Non-Stop' : `${flight.stops} Stop`}</span>
                          </div>

                          <div className="col-span-2 text-right">
                            <span className="block text-lg font-black text-slate-800 dark:text-white">{flight.arrivalTime}</span>
                            <span className="block text-[10px] font-extrabold text-slate-400 uppercase mt-0.5">{flight.toCode}</span>
                          </div>
                        </div>

                        {/* Price & Booking action */}
                        <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80 pt-4 md:pt-0">
                          <div>
                            <span className="block text-2xl font-black text-slate-800 dark:text-white">₹{flight.price}</span>
                            <span className="block text-[10px] font-bold text-accent-green mt-0.5">{flight.seatsRemaining} seats left</span>
                          </div>
                          <Button
                            onClick={() => handleBookFlight(flight)}
                            variant="secondary"
                            size="sm"
                            className="font-bold shrink-0"
                          >
                            Book Flight
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Hotel Results */}
            {!isLoading && searchQuery.type === 'hotel' && (
              <div className="flex flex-col gap-5">
                {filteredHotels.length === 0 ? (
                  <div className="glass-panel p-10 text-center text-slate-400 rounded-3xl">No hotels match your filters.</div>
                ) : (
                  filteredHotels.map((hotel) => (
                    <Card key={hotel.id} className="border-white/5 dark:bg-brand-blue/30 overflow-hidden flex flex-col md:flex-row">
                      {/* Image Thumbnail */}
                      <div 
                        className="md:w-60 h-44 md:h-auto bg-cover bg-center shrink-0" 
                        style={{ backgroundImage: `url(${hotel.image})` }} 
                      />

                      <div className="p-5 flex-grow flex flex-col justify-between">
                        {/* Title and Address */}
                        <div>
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <h3 className="font-extrabold text-lg sm:text-xl text-slate-800 dark:text-white leading-tight">{hotel.name}</h3>
                              <span className="text-xs text-slate-400 font-semibold block mt-1">{hotel.location}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded text-amber-500 font-extrabold text-xs">
                              ⭐ {hotel.rating}
                            </div>
                          </div>

                          {/* Amenities list */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {hotel.amenities.slice(0, 4).map((am) => (
                              <span key={am} className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-brand-blue-dark/50 px-2 py-0.5 rounded-md">
                                {am}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Price footer */}
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4">
                          <div>
                            <span className="block text-2xl font-black text-slate-800 dark:text-white">₹{hotel.pricePerNight}</span>
                            <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">per room / night</span>
                          </div>
                          <Button
                            onClick={() => handleBookHotel(hotel)}
                            variant="secondary"
                            size="sm"
                            className="font-bold"
                          >
                            Book Room
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
