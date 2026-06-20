export type BookingType = 'train' | 'flight' | 'hotel' | 'bus' | 'metro' | 'cab';

export type TrainClass = '1A' | '2A' | '3A' | 'SL' | 'CC' | '2S' | 'EC';
export type TrainQuota = 'GENERAL' | 'TATKAL' | 'LADIES' | 'SR_CITIZEN' | 'DIVYAANGJAN';

export interface SeatAvailability {
  classCode: TrainClass;
  className: string;
  status: 'AVAILABLE' | 'WL' | 'RAC';
  seats: number;
  price: number;
  waitlistCount?: number;
  confirmationChance?: number; // e.g. 85 for 85% probability
}

export interface Train {
  id: string;
  number: string;
  name: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOn: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  classes: TrainClass[];
  availability: Record<TrainClass, SeatAvailability>;
}

export interface Flight {
  id: string;
  number: string;
  airline: string;
  logo: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  class: 'Economy' | 'Business';
  seatsRemaining: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
  roomsAvailable: number;
}

export interface Bus {
  id: string;
  operator: string;
  type: string; // e.g. "AC Sleeper (2+1)"
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
  seatsRemaining: number;
}

export interface Metro {
  id: string;
  line: string; // e.g. "Delhi Metro Yellow Line"
  colorCode: string; // e.g. "#FFC72C"
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  frequency: string; // e.g. "Every 3 mins"
}

export interface Cab {
  id: string;
  provider: string; // e.g. "Uber Connect"
  type: 'Sedan' | 'SUV' | 'Mini' | 'Auto';
  price: number;
  etaMinutes: number;
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Transgender';
  berthPreference: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'No Preference';
  seatNumber?: string;
  mealPreference?: 'Veg' | 'Non-Veg' | 'No Meal';
}

export interface Booking {
  id: string;
  pnr: string;
  type: BookingType;
  itemId: string; // Train ID, Flight ID, Hotel ID, Bus ID, Metro ID, Cab ID
  itemName: string; // e.g. "Rajdhani Express"
  itemNumber?: string;
  travelClass?: string;
  date: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  passengers: Passenger[];
  totalFare: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'WAITLIST';
  paymentId?: string;
  createdAt: string;
}

export interface SearchQuery {
  type: BookingType;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  date: string;
  travelClass?: string;
  quota?: TrainQuota;
  guestsCount?: number;
  roomsCount?: number;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'PAYMENT' | 'REFUND';
  status: 'SUCCESS' | 'FAILED';
  description: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'disha';
  text: string;
  timestamp: string;
}

export type BookingItem = Train | Flight | Hotel | Bus | Metro | Cab;
