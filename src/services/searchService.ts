import { Train, Flight, Hotel, Bus, Metro, Cab, SearchQuery, TrainClass, BookingItem } from '../types';

// Mock Trains database
const MOCK_TRAINS: Train[] = [
  {
    id: 'T1',
    number: '12423',
    name: 'NDLS HWH RAJDHANI',
    from: 'New Delhi',
    fromCode: 'NDLS',
    to: 'Kolkata Howrah',
    toCode: 'HWH',
    departureTime: '16:55',
    arrivalTime: '09:55',
    duration: '17h 00m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A', 'SL'],
    availability: {
      '1A': { classCode: '1A', className: 'AC First Class', status: 'AVAILABLE', seats: 4, price: 4390 },
      '2A': { classCode: '2A', className: 'AC 2 Tier', status: 'AVAILABLE', seats: 12, price: 2850 },
      '3A': { classCode: '3A', className: 'AC 3 Tier', status: 'AVAILABLE', seats: 45, price: 2010 },
      'SL': { classCode: 'SL', className: 'Sleeper', status: 'WL', seats: 0, price: 670, waitlistCount: 22, confirmationChance: 85 },
      'CC': { classCode: 'CC', className: 'AC Chair Car', status: 'AVAILABLE', seats: 0, price: 1100 },
      '2S': { classCode: '2S', className: 'Second Seating', status: 'AVAILABLE', seats: 0, price: 350 },
      'EC': { classCode: 'EC', className: 'Executive Class', status: 'AVAILABLE', seats: 0, price: 0 }
    }
  },
  {
    id: 'T2',
    number: '12002',
    name: 'NDLS BPL SHATABDI',
    from: 'New Delhi',
    fromCode: 'NDLS',
    to: 'Bhopal Habibganj',
    toCode: 'RKMP',
    departureTime: '06:00',
    arrivalTime: '14:40',
    duration: '08h 40m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['CC', 'EC'],
    availability: {
      '1A': { classCode: '1A', className: 'AC First Class', status: 'AVAILABLE', seats: 0, price: 0 },
      '2A': { classCode: '2A', className: 'AC 2 Tier', status: 'AVAILABLE', seats: 0, price: 0 },
      '3A': { classCode: '3A', className: 'AC 3 Tier', status: 'AVAILABLE', seats: 0, price: 0 },
      'SL': { classCode: 'SL', className: 'Sleeper', status: 'AVAILABLE', seats: 0, price: 0 },
      'CC': { classCode: 'CC', className: 'AC Chair Car', status: 'AVAILABLE', seats: 128, price: 1250 },
      '2S': { classCode: '2S', className: 'Second Seating', status: 'AVAILABLE', seats: 0, price: 0 },
      'EC': { classCode: 'EC', className: 'Executive Chair Class', status: 'AVAILABLE', seats: 8, price: 2450 }
    }
  },
  {
    id: 'T3',
    number: '12952',
    name: 'MUMBAI RAJDHANI',
    from: 'New Delhi',
    fromCode: 'NDLS',
    to: 'Mumbai Central',
    toCode: 'MMCT',
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A', 'SL'],
    availability: {
      '1A': { classCode: '1A', className: 'AC First Class', status: 'AVAILABLE', seats: 2, price: 4730 },
      '2A': { classCode: '2A', className: 'AC 2 Tier', status: 'AVAILABLE', seats: 18, price: 2980 },
      '3A': { classCode: '3A', className: 'AC 3 Tier', status: 'AVAILABLE', seats: 60, price: 2095 },
      'SL': { classCode: 'SL', className: 'Sleeper', status: 'WL', seats: 0, price: 710, waitlistCount: 48, confirmationChance: 42 },
      'CC': { classCode: 'CC', className: 'AC Chair Car', status: 'AVAILABLE', seats: 0, price: 0 },
      '2S': { classCode: '2S', className: 'Second Seating', status: 'AVAILABLE', seats: 0, price: 0 },
      'EC': { classCode: 'EC', className: 'Executive Class', status: 'AVAILABLE', seats: 0, price: 0 }
    }
  },
  {
    id: 'T4',
    number: '10111',
    name: 'KONKAN KANYA EXP',
    from: 'Mumbai Central',
    fromCode: 'MMCT',
    to: 'Madgaon (Goa)',
    toCode: 'MAO',
    departureTime: '23:05',
    arrivalTime: '10:45',
    duration: '11h 40m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A', 'SL'],
    availability: {
      '1A': { classCode: '1A', className: 'AC First Class', status: 'WL', seats: 0, waitlistCount: 2, price: 2990, confirmationChance: 92 },
      '2A': { classCode: '2A', className: 'AC 2 Tier', status: 'AVAILABLE', seats: 5, price: 1850 },
      '3A': { classCode: '3A', className: 'AC 3 Tier', status: 'AVAILABLE', seats: 24, price: 1320 },
      'SL': { classCode: 'SL', className: 'Sleeper', status: 'AVAILABLE', seats: 95, price: 495 },
      'CC': { classCode: 'CC', className: 'AC Chair Car', status: 'AVAILABLE', seats: 0, price: 0 },
      '2S': { classCode: '2S', className: 'Second Seating', status: 'AVAILABLE', seats: 0, price: 0 },
      'EC': { classCode: 'EC', className: 'Executive Class', status: 'AVAILABLE', seats: 0, price: 0 }
    }
  },
  {
    id: 'T5',
    number: '22692',
    name: 'SBC RAJDHANI',
    from: 'New Delhi',
    fromCode: 'NDLS',
    to: 'KSR Bengaluru',
    toCode: 'SBC',
    departureTime: '19:50',
    arrivalTime: '05:20',
    duration: '33h 30m',
    runsOn: ['Mon', 'Wed', 'Thu', 'Sat'],
    classes: ['1A', '2A', '3A', 'SL'],
    availability: {
      '1A': { classCode: '1A', className: 'AC First Class', status: 'AVAILABLE', seats: 1, price: 5850 },
      '2A': { classCode: '2A', className: 'AC 2 Tier', status: 'AVAILABLE', seats: 9, price: 3820 },
      '3A': { classCode: '3A', className: 'AC 3 Tier', status: 'RAC', seats: 14, price: 2710 },
      'SL': { classCode: 'SL', className: 'Sleeper', status: 'WL', seats: 0, price: 920, waitlistCount: 35, confirmationChance: 68 },
      'CC': { classCode: 'CC', className: 'AC Chair Car', status: 'AVAILABLE', seats: 0, price: 0 },
      '2S': { classCode: '2S', className: 'Second Seating', status: 'AVAILABLE', seats: 0, price: 0 },
      'EC': { classCode: 'EC', className: 'Executive Class', status: 'AVAILABLE', seats: 0, price: 0 }
    }
  }
];

// Mock Flights database
const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'F1',
    number: '6E-201',
    airline: 'IndiGo',
    logo: '✈️',
    from: 'New Delhi',
    fromCode: 'DEL',
    to: 'Mumbai',
    toCode: 'BOM',
    departureTime: '07:15',
    arrivalTime: '09:30',
    duration: '2h 15m',
    stops: 0,
    price: 5200,
    class: 'Economy',
    seatsRemaining: 15
  },
  {
    id: 'F2',
    number: 'AI-805',
    airline: 'Air India',
    logo: '🔴',
    from: 'New Delhi',
    fromCode: 'DEL',
    to: 'Mumbai',
    toCode: 'BOM',
    departureTime: '08:00',
    arrivalTime: '10:15',
    duration: '2h 15m',
    stops: 0,
    price: 6100,
    class: 'Economy',
    seatsRemaining: 8
  },
  {
    id: 'F3',
    number: 'UK-975',
    airline: 'Vistara',
    logo: '💜',
    from: 'New Delhi',
    fromCode: 'DEL',
    to: 'Goa',
    toCode: 'GOI',
    departureTime: '10:45',
    arrivalTime: '13:20',
    duration: '2h 35m',
    stops: 0,
    price: 7800,
    class: 'Economy',
    seatsRemaining: 4
  },
  {
    id: 'F4',
    number: 'QP-1123',
    airline: 'Akasa Air',
    logo: '🟠',
    from: 'Mumbai',
    fromCode: 'BOM',
    to: 'Bengaluru',
    toCode: 'BLR',
    departureTime: '14:20',
    arrivalTime: '16:00',
    duration: '1h 40m',
    stops: 0,
    price: 4350,
    class: 'Economy',
    seatsRemaining: 22
  }
];

// Mock Hotels database
const MOCK_HOTELS: Hotel[] = [
  {
    id: 'H1',
    name: 'The Taj Mahal Palace',
    location: 'Colaba, Mumbai',
    rating: 4.9,
    reviewsCount: 3421,
    pricePerNight: 24000,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Sea View', 'Gym', 'Bar'],
    roomsAvailable: 3
  },
  {
    id: 'H2',
    name: 'Cidade de Goa - IHCL SeleQtions',
    location: 'Vainguinim Beach, Goa',
    rating: 4.5,
    reviewsCount: 1845,
    pricePerNight: 12500,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    amenities: ['Free WiFi', 'Pool', 'Private Beach', 'Restaurant', 'Kids Club'],
    roomsAvailable: 7
  },
  {
    id: 'H3',
    name: 'The Oberoi Grand',
    location: 'Chowringhee, Kolkata',
    rating: 4.8,
    reviewsCount: 1543,
    pricePerNight: 15000,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    amenities: ['Free WiFi', 'Pool', 'Historic', 'Bar', 'Airport Shuttle'],
    roomsAvailable: 5
  },
  {
    id: 'H4',
    name: 'Radisson Blu Plaza',
    location: 'Mahipalpur, New Delhi',
    rating: 4.3,
    reviewsCount: 2210,
    pricePerNight: 8900,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Free Airport Transfer', 'Buffet'],
    roomsAvailable: 12
  }
];

// Mock Buses database
const MOCK_BUSES: Bus[] = [
  {
    id: 'B1',
    operator: 'Zingbus Plus',
    type: 'A/C Sleeper (2+1)',
    departureTime: '21:00',
    arrivalTime: '07:30',
    duration: '10h 30m',
    price: 899,
    rating: 4.6,
    seatsRemaining: 18
  },
  {
    id: 'B2',
    operator: 'VRL Travels',
    type: 'Multi-Axle A/C Semi-Sleeper',
    departureTime: '22:30',
    arrivalTime: '09:00',
    duration: '10h 30m',
    price: 750,
    rating: 4.2,
    seatsRemaining: 24
  },
  {
    id: 'B3',
    operator: 'IntrCity SmartBus',
    type: 'A/C Sleeper (1+2)',
    departureTime: '20:15',
    arrivalTime: '06:45',
    duration: '10h 30m',
    price: 1150,
    rating: 4.8,
    seatsRemaining: 7
  }
];

// Mock Metro database
const MOCK_METROS: Metro[] = [
  {
    id: 'M1',
    line: 'Delhi Metro Yellow Line (Huda City Centre ➔ Samaypur Badli)',
    colorCode: '#FFC72C',
    departureTime: '06:00',
    arrivalTime: '23:00',
    duration: '1h 25m',
    price: 60,
    frequency: 'Every 3 mins'
  },
  {
    id: 'M2',
    line: 'Delhi Metro Airport Express Line (New Delhi ➔ IGI Airport)',
    colorCode: '#FF6F00',
    departureTime: '04:45',
    arrivalTime: '23:30',
    duration: '19m',
    price: 50,
    frequency: 'Every 10 mins'
  }
];

// Mock Cabs database
const MOCK_CABS: Cab[] = [
  {
    id: 'C1',
    provider: 'Ola Cabs',
    type: 'Sedan',
    price: 450,
    etaMinutes: 4
  },
  {
    id: 'C2',
    provider: 'Uber Connect',
    type: 'SUV',
    price: 680,
    etaMinutes: 6
  },
  {
    id: 'C3',
    provider: 'Rapido Bike Auto',
    type: 'Auto',
    price: 210,
    etaMinutes: 2
  }
];

// In-memory seat locks map (key: trainId-class-seat, value: timestamp when locked)
const seatLocks = new Map<string, number>();
const SEAT_LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export const searchService = {
  // Simulate network latency (200ms - 400ms for realistic sub-second feel)
  delay: <T>(value: T): Promise<T> => {
    const ms = Math.floor(Math.random() * 200) + 150;
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
  },

  searchTrains: async (query: SearchQuery): Promise<Train[]> => {
    const results = MOCK_TRAINS.filter(train => {
      const matchFrom = !query.fromCode || train.fromCode.toLowerCase() === query.fromCode.toLowerCase();
      const matchTo = !query.toCode || train.toCode.toLowerCase() === query.toCode.toLowerCase();
      return matchFrom && matchTo;
    });

    if (results.length === 0) {
      return searchService.delay(MOCK_TRAINS);
    }
    return searchService.delay(results);
  },

  searchFlights: async (query: SearchQuery): Promise<Flight[]> => {
    const results = MOCK_FLIGHTS.filter(flight => {
      const matchFrom = !query.fromCode || flight.fromCode.toLowerCase() === query.fromCode.toLowerCase();
      const matchTo = !query.toCode || flight.toCode.toLowerCase() === query.toCode.toLowerCase();
      return matchFrom && matchTo;
    });

    if (results.length === 0) {
      return searchService.delay(MOCK_FLIGHTS);
    }
    return searchService.delay(results);
  },

  searchHotels: async (query: SearchQuery): Promise<Hotel[]> => {
    const results = MOCK_HOTELS.filter(hotel => {
      const matchLoc = !query.to || hotel.location.toLowerCase().includes(query.to.toLowerCase());
      return matchLoc;
    });

    if (results.length === 0) {
      return searchService.delay(MOCK_HOTELS);
    }
    return searchService.delay(results);
  },

  searchBuses: async (query: SearchQuery): Promise<Bus[]> => {
    return searchService.delay(MOCK_BUSES);
  },

  searchMetros: async (query: SearchQuery): Promise<Metro[]> => {
    return searchService.delay(MOCK_METROS);
  },

  searchCabs: async (query: SearchQuery): Promise<Cab[]> => {
    return searchService.delay(MOCK_CABS);
  },

  // Redis-style lock simulator
  lockSeat: async (trainId: string, classCode: TrainClass, seatNumber: string): Promise<boolean> => {
    const lockKey = `${trainId}-${classCode}-${seatNumber}`;
    const now = Date.now();
    
    // Clean up expired locks first
    for (const [key, timestamp] of seatLocks.entries()) {
      if (now - timestamp > SEAT_LOCK_DURATION_MS) {
        seatLocks.delete(key);
      }
    }

    // Check if locked
    if (seatLocks.has(lockKey)) {
      const lockTime = seatLocks.get(lockKey)!;
      if (now - lockTime <= SEAT_LOCK_DURATION_MS) {
        // Locked and not expired
        return searchService.delay(false);
      }
    }

    // Lock it
    seatLocks.set(lockKey, now);
    return searchService.delay(true);
  },

  unlockSeat: async (trainId: string, classCode: TrainClass, seatNumber: string): Promise<void> => {
    const lockKey = `${trainId}-${classCode}-${seatNumber}`;
    seatLocks.delete(lockKey);
  },

  getActiveLocks: () => {
    const now = Date.now();
    for (const [key, timestamp] of seatLocks.entries()) {
      if (now - timestamp > SEAT_LOCK_DURATION_MS) {
        seatLocks.delete(key);
      }
    }
    return Array.from(seatLocks.entries()).map(([key, timestamp]) => {
      const [trainId, classCode, seatNumber] = key.split('-');
      return {
        trainId,
        classCode,
        seatNumber,
        secondsLeft: Math.max(0, Math.round((timestamp + SEAT_LOCK_DURATION_MS - now) / 1000))
      };
    });
  }
};
