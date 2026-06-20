import { create } from 'zustand';
import { SearchQuery, Train, Flight, Hotel, Passenger, Booking, BookingType, BookingItem } from '../types';

interface AppState {
  // Search state
  searchQuery: SearchQuery | null;
  setSearchQuery: (query: SearchQuery) => void;
  trainResults: Train[];
  flightResults: Flight[];
  hotelResults: Hotel[];
  setResults: (type: BookingType, results: BookingItem[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Selection & Booking Flow State
  selectedItem: BookingItem | null; // Selected Train, Flight, or Hotel
  selectedType: BookingType | null;
  selectedClass: string | null; // e.g. "3A" or "Economy"
  selectItemForBooking: (item: BookingItem, type: BookingType, travelClass?: string) => void;
  
  passengers: Passenger[];
  addPassenger: (passenger: Passenger) => void;
  removePassenger: (id: string) => void;
  clearPassengers: () => void;
  
  bookingStep: number;
  setBookingStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBookingFlow: () => void;

  // Post booking history
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;

  // Network offline mock toggle
  isOfflineMode: boolean;
  setOfflineMode: (offline: boolean) => void;

  // Language state
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  searchQuery: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  trainResults: [],
  flightResults: [],
  hotelResults: [],
  setResults: (type, results) => {
    if (type === 'train') set({ trainResults: results as Train[] });
    else if (type === 'flight') set({ flightResults: results as Flight[] });
    else if (type === 'hotel') set({ hotelResults: results as Hotel[] });
  },
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  selectedItem: null,
  selectedType: null,
  selectedClass: null,
  selectItemForBooking: (item, type, travelClass) => set({
    selectedItem: item,
    selectedType: type,
    selectedClass: travelClass || null,
    bookingStep: 1 // Start at step 1 (Passenger Details)
  }),

  passengers: [],
  addPassenger: (passenger) => set((state) => ({ passengers: [...state.passengers, passenger] })),
  removePassenger: (id) => set((state) => ({ passengers: state.passengers.filter(p => p.id !== id) })),
  clearPassengers: () => set({ passengers: [] }),

  bookingStep: 1,
  setBookingStep: (step) => set({ bookingStep: step }),
  nextStep: () => set((state) => ({ bookingStep: state.bookingStep + 1 })),
  prevStep: () => set((state) => ({ bookingStep: Math.max(1, state.bookingStep - 1) })),
  
  resetBookingFlow: () => set({
    selectedItem: null,
    selectedType: null,
    selectedClass: null,
    passengers: [],
    bookingStep: 1
  }),

  bookings: [],
  addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
  cancelBooking: (id) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b)
  })),

  isOfflineMode: false,
  setOfflineMode: (offline) => set({ isOfflineMode: offline })
}));
