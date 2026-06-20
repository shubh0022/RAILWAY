import { create } from 'zustand';
import { SearchQuery, Train, Flight, Hotel, Bus, Metro, Cab, Passenger, Booking, BookingType, BookingItem, WalletTransaction, ChatMessage } from '../types';

interface AppState {
  // Search state
  searchQuery: SearchQuery | null;
  setSearchQuery: (query: SearchQuery) => void;
  trainResults: Train[];
  flightResults: Flight[];
  hotelResults: Hotel[];
  busResults: Bus[];
  metroResults: Metro[];
  cabResults: Cab[];
  setResults: (type: BookingType, results: BookingItem[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Selection & Booking Flow State
  selectedItem: BookingItem | null;
  selectedType: BookingType | null;
  selectedClass: string | null;
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

  // Wallet State (National Mobility Wallet)
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  addWalletBalance: (amount: number) => void;
  deductWalletBalance: (amount: number) => boolean;
  refundWalletBalance: (amount: number, description: string) => void;

  // AI Chat Copilot (Ask DISHA 2.0)
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  isCopilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  searchQuery: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  trainResults: [],
  flightResults: [],
  hotelResults: [],
  busResults: [],
  metroResults: [],
  cabResults: [],
  setResults: (type, results) => {
    if (type === 'train') set({ trainResults: results as Train[] });
    else if (type === 'flight') set({ flightResults: results as Flight[] });
    else if (type === 'hotel') set({ hotelResults: results as Hotel[] });
    else if (type === 'bus') set({ busResults: results as Bus[] });
    else if (type === 'metro') set({ metroResults: results as Metro[] });
    else if (type === 'cab') set({ cabResults: results as Cab[] });
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
    bookingStep: 1
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
  cancelBooking: (id) => {
    const booking = get().bookings.find(b => b.id === id);
    if (booking && booking.status !== 'CANCELLED') {
      set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b)
      }));
      const refundAmount = Math.max(0, booking.totalFare - 250);
      get().refundWalletBalance(refundAmount, `Refund for PNR ${booking.pnr}`);
    }
  },

  isOfflineMode: false,
  setOfflineMode: (offline) => set({ isOfflineMode: offline }),

  // Wallet
  walletBalance: 2500,
  walletTransactions: [
    {
      id: 'TXN-001024',
      amount: 1500.00,
      type: 'DEPOSIT',
      status: 'SUCCESS',
      description: 'Initial Wallet Top-Up via UPI',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    },
    {
      id: 'TXN-001025',
      amount: 1000.00,
      type: 'DEPOSIT',
      status: 'SUCCESS',
      description: 'Credit balance transfer',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],

  addWalletBalance: (amount) => set((state) => ({
    walletBalance: state.walletBalance + amount,
    walletTransactions: [
      {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        amount,
        type: 'DEPOSIT',
        status: 'SUCCESS',
        description: 'Deposited via UPI',
        createdAt: new Date().toISOString()
      },
      ...state.walletTransactions
    ]
  })),

  deductWalletBalance: (amount) => {
    let success = false;
    set((state) => {
      if (state.walletBalance >= amount) {
        success = true;
        return {
          walletBalance: state.walletBalance - amount,
          walletTransactions: [
            {
              id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
              amount,
              type: 'PAYMENT',
              status: 'SUCCESS',
              description: 'Ticket Booking Payment',
              createdAt: new Date().toISOString()
            },
            ...state.walletTransactions
          ]
        };
      }
      return {};
    });
    return success;
  },

  refundWalletBalance: (amount, description) => set((state) => ({
    walletBalance: state.walletBalance + amount,
    walletTransactions: [
      {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        amount,
        type: 'REFUND',
        status: 'SUCCESS',
        description,
        createdAt: new Date().toISOString()
      },
      ...state.walletTransactions
    ]
  })),

  // Ask DISHA 2.0
  chatMessages: [
    {
      id: 'disha-welcome',
      sender: 'disha',
      text: 'Namaste! I am Ask DISHA 2.0. I can help you plan your journey, check PNR status, find trains, or inspect your wallet balance. What can I do for you today?',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  ],

  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  clearChat: () => set({
    chatMessages: [
      {
        id: `disha-${Date.now()}`,
        sender: 'disha',
        text: 'Chat cleared. How else can I assist you?',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      }
    ]
  }),

  isCopilotOpen: false,
  setCopilotOpen: (open) => set({ isCopilotOpen: open })
}));
