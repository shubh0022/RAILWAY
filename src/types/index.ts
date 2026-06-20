export type BookingType = 'train' | 'flight' | 'hotel' | 'bus';

export type TrainClass = '1A' | '2A' | '3A' | 'SL' | 'CC' | '2S';
export type TrainQuota = 'GENERAL' | 'TATKAL' | 'LADIES' | 'SR_CITIZEN';

export interface SeatAvailability {
  classCode: TrainClass;
  className: string;
  status: 'AVAILABLE' | 'WL' | 'RAC';
  seats: number;
  price: number;
  waitlistCount?: number;
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
  itemId: string; // Train ID, Flight ID, or Hotel ID
  itemName: string; // e.g. "Rajdhani Express" or "IndiGo 6E-201"
  itemNumber?: string; // e.g. "12423"
  travelClass?: string; // e.g. "3A" or "Economy"
  date: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  passengers: Passenger[];
  totalFare: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
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

export type BookingItem = Train | Flight | Hotel;
