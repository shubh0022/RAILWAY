'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../store';
import { searchService } from '../../services/searchService';
import { Passenger, Booking, TrainClass, BookingItem, Train, Flight, Hotel } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardContent, CardHeader, CardFooter } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { User, Plus, Trash2, Calendar, ShieldCheck, Timer, AlertCircle, WifiOff, CreditCard } from 'lucide-react';

const isTrain = (item: BookingItem): item is Train => 'classes' in item;
const isFlight = (item: BookingItem): item is Flight => 'airline' in item;
const isHotel = (item: BookingItem): item is Hotel => 'pricePerNight' in item;

export default function BookingWizard() {
  const router = useRouter();
  const { 
    selectedItem, 
    selectedType, 
    selectedClass, 
    searchQuery,
    passengers, 
    addPassenger, 
    removePassenger, 
    bookingStep, 
    nextStep, 
    prevStep, 
    resetBookingFlow, 
    addBooking,
    isOfflineMode 
  } = useAppStore();

  // Step 1 Form States
  const [passengerName, setPassengerName] = React.useState('');
  const [passengerAge, setPassengerAge] = React.useState<number | ''>('');
  const [passengerGender, setPassengerGender] = React.useState<'Male' | 'Female' | 'Transgender'>('Male');
  const [berthPreference, setBerthPreference] = React.useState<string>('No Preference');
  const [mealPreference, setMealPreference] = React.useState<string>('No Meal');
  const [formError, setFormError] = React.useState('');

  // Step 2 Timer State (10 minutes)
  const [timeLeft, setTimeLeft] = React.useState(600); // 10 minutes in seconds
  const [seatLockFailed, setSeatLockFailed] = React.useState(false);

  // Step 3 Payment States
  const [paymentMethod, setPaymentMethod] = React.useState<'upi' | 'card'>('upi');
  const [cardHolder, setCardHolder] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [idempotencyToken] = React.useState(() => `txn_lock_${Math.random().toString(36).substring(2, 15)}`);
  
  // Custom alerts/modals
  const [showDuplicateAlert, setShowDuplicateAlert] = React.useState(false);
  const [showOfflineModal, setShowOfflineModal] = React.useState(false);
  
  // Track processed transactions to prevent duplicate submissions
  const processedTokens = React.useRef<Set<string>>(new Set());

  // Redirect if no item selected
  React.useEffect(() => {
    if (!selectedItem || !selectedType || !searchQuery) {
      router.push('/');
    }
  }, [selectedItem, selectedType, searchQuery, router]);

  // Handle seat lock timer on Step 2
  React.useEffect(() => {
    if (bookingStep !== 2) return;

    // Reset timer
    setTimeLeft(600);

    // Simulate locking seats for each passenger
    const lockSeatsAsync = async () => {
      if (!selectedItem || !selectedClass) return;
      
      try {
        let allLocked = true;
        for (let i = 0; i < passengers.length; i++) {
          const seatNo = selectedType === 'train' 
            ? `Coach S1, Berth ${Math.floor(Math.random() * 72) + 1}` 
            : selectedType === 'flight' 
              ? `Seat ${Math.floor(Math.random() * 28) + 1}${['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)]}`
              : `Room Deluxe-${Math.floor(Math.random() * 100) + 101}`;

          // Mutate passenger directly to assign temporary seat
          passengers[i].seatNumber = seatNo;
          
          const success = await searchService.lockSeat(selectedItem.id, (selectedClass as TrainClass), seatNo);
          if (!success) {
            allLocked = false;
          }
        }
        if (!allLocked) {
          setSeatLockFailed(true);
        }
      } catch (err) {
        console.error("Seat locking error:", err);
      }
    };

    lockSeatsAsync();

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSeatLockFailed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      // Clean up locks
      passengers.forEach(p => {
        if (p.seatNumber && selectedItem && selectedClass) {
          searchService.unlockSeat(selectedItem.id, (selectedClass as TrainClass), p.seatNumber);
        }
      });
    };
  }, [bookingStep, passengers, selectedItem, selectedClass, selectedType]);

  if (!selectedItem || !selectedType || !searchQuery) {
    return null;
  }

  // Pricing calculations
  let basePrice = 0;
  if (selectedItem && isTrain(selectedItem)) {
    basePrice = selectedItem.availability[selectedClass as TrainClass || '3A']?.price || 500;
  } else if (selectedItem && isFlight(selectedItem)) {
    basePrice = selectedItem.price || 3500;
  } else if (selectedItem && isHotel(selectedItem)) {
    basePrice = selectedItem.pricePerNight || 4000;
  }

  const totalBasePrice = basePrice * (passengers.length || 1);
  const tax = Math.round(totalBasePrice * 0.05); // 5% GST
  const irctcServiceCharge = selectedType === 'train' ? 17.70 : 150; // IRCTC service charges mock
  const totalFare = totalBasePrice + tax + irctcServiceCharge;

  // Add passenger helper
  const handleAddPassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName.trim()) {
      setFormError('Please enter a valid passenger name');
      return;
    }
    if (passengerName.trim().length < 3) {
      setFormError('Name must be at least 3 characters long');
      return;
    }
    if (!passengerAge || passengerAge <= 0 || passengerAge > 120) {
      setFormError('Please enter a valid age (1-120)');
      return;
    }

    const newPassenger: Passenger = {
      id: Math.random().toString(36).substring(2, 9),
      name: passengerName.trim(),
      age: Number(passengerAge),
      gender: passengerGender,
      berthPreference: berthPreference as Passenger['berthPreference'],
      mealPreference: mealPreference as NonNullable<Passenger['mealPreference']>
    };

    addPassenger(newPassenger);
    
    // Reset form inputs
    setPassengerName('');
    setPassengerAge('');
    setPassengerGender('Male');
    setBerthPreference('No Preference');
    setMealPreference('No Meal');
    setFormError('');
  };

  // Payment mock trigger
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentLoading) return;

    // Card details validation if selected card payment
    if (paymentMethod === 'card') {
      if (!cardHolder || !cardNumber || !cardExpiry || !cardCvv) {
        alert('Please fill out all card information.');
        return;
      }
    }

    setPaymentLoading(true);

    // Simulate 2s processing delay
    await new Promise(r => setTimeout(r, 2000));

    // 1. Idempotency Check
    if (processedTokens.current.has(idempotencyToken)) {
      setShowDuplicateAlert(true);
      setPaymentLoading(false);
      return;
    }

    // 2. Offline Simulation Check
    if (isOfflineMode) {
      setShowOfflineModal(true);
      setPaymentLoading(false);
      return;
    }

    // Mark token as processed
    processedTokens.current.add(idempotencyToken);

    let itemName = '';
    let itemNumber: string | undefined = undefined;
    if (isTrain(selectedItem)) {
      itemName = selectedItem.name;
      itemNumber = selectedItem.number;
    } else if (isFlight(selectedItem)) {
      itemName = selectedItem.airline;
      itemNumber = selectedItem.number;
    } else if (isHotel(selectedItem)) {
      itemName = selectedItem.name;
    }

    // Create the booking entry
    const finalBooking: Booking = {
      id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      pnr: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      type: selectedType,
      itemId: selectedItem.id,
      itemName,
      itemNumber,
      travelClass: selectedClass || undefined,
      date: searchQuery.date,
      from: searchQuery.from,
      fromCode: searchQuery.fromCode,
      to: searchQuery.to,
      toCode: searchQuery.toCode,
      passengers: [...passengers],
      totalFare: totalFare,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      paymentId: `PAY-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    addBooking(finalBooking);
    
    // Clear and redirect
    resetBookingFlow();
    setPaymentLoading(false);
    router.push('/post-booking');
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-blue-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* WIZARD PROCESS INDICATOR */}
        <div className="flex justify-between items-center mb-8 bg-white dark:bg-brand-blue border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
          {[
            { step: 1, label: 'Passengers' },
            { step: 2, label: 'Review Lock' },
            { step: 3, label: 'Payment' }
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2">
              <span className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all
                ${bookingStep >= item.step 
                  ? 'bg-brand-orange text-white' 
                  : 'bg-slate-100 dark:bg-brand-blue-dark text-slate-400 border border-slate-200 dark:border-slate-800'}
              `}>
                {item.step}
              </span>
              <span className={`text-xs font-bold ${bookingStep === item.step ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {item.step < 3 && <div className="w-8 sm:w-16 h-0.5 bg-slate-200 dark:bg-slate-800" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* STEP CONTENT MAIN LAYER */}
          <div className="lg:col-span-8">
            
            {/* STEP 1: ADD PASSENGERS */}
            {bookingStep === 1 && (
              <div className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-brand-orange" />
                      <span>Add Passengers</span>
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddPassengerSubmit} className="flex flex-col gap-4">
                      {formError && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-accent-red rounded-xl text-xs font-bold border border-rose-500/20">
                          {formError}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          placeholder="Passenger Name"
                          value={passengerName}
                          onChange={(e) => setPassengerName(e.target.value)}
                        />
                        <Input
                          label="Age"
                          type="number"
                          placeholder="Age"
                          value={passengerAge}
                          onChange={(e) => setPassengerAge(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
                          <select
                            value={passengerGender}
                            onChange={(e) => setPassengerGender(e.target.value as 'Male' | 'Female' | 'Transgender')}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-brand-blue-dark/50 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-850 dark:text-white"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Transgender</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            {selectedType === 'flight' ? 'Seat Preference' : 'Berth Preference'}
                          </label>
                          <select
                            value={berthPreference}
                            onChange={(e) => setBerthPreference(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-brand-blue-dark/50 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-850 dark:text-white"
                          >
                            {selectedType === 'flight' ? (
                              <>
                                <option value="No Preference">No Preference</option>
                                <option value="Window">Window</option>
                                <option value="Aisle">Aisle</option>
                              </>
                            ) : (
                              <>
                                <option value="No Preference">No Preference</option>
                                <option value="Lower">Lower</option>
                                <option value="Middle">Middle</option>
                                <option value="Upper">Upper</option>
                                <option value="Side Lower">Side Lower</option>
                                <option value="Side Upper">Side Upper</option>
                              </>
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Meal Preference</label>
                          <select
                            value={mealPreference}
                            onChange={(e) => setMealPreference(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-brand-blue-dark/50 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-850 dark:text-white"
                          >
                            <option value="No Meal">No Meal</option>
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                          </select>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        leftIcon={<Plus className="w-4 h-4" />}
                        className="mt-2 self-start font-bold"
                      >
                        Add Passenger
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* ADDED PASSENGERS LIST */}
                <Card>
                  <CardHeader>
                    <h3 className="font-extrabold text-slate-800 dark:text-white">Passenger List ({passengers.length})</h3>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {passengers.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-4">No passengers added yet. Please add at least one passenger above.</p>
                    ) : (
                      passengers.map((p, idx) => (
                        <div key={p.id} className="flex justify-between items-center p-3.5 bg-slate-100/50 dark:bg-brand-blue-dark/40 border border-slate-200 dark:border-slate-800/80 rounded-xl">
                          <div>
                            <span className="font-black text-sm text-slate-850 dark:text-slate-200 block">
                              {idx + 1}. {p.name} ({p.age}, {p.gender})
                            </span>
                            <span className="text-xs text-slate-400 mt-1 block">
                              Preference: {p.berthPreference} | Meal: {p.mealPreference}
                            </span>
                          </div>
                          <button
                            onClick={() => removePassenger(p.id)}
                            className="text-slate-400 hover:text-accent-red transition-all cursor-pointer"
                            aria-label={`Remove passenger ${p.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => router.push('/search')} className="font-bold">
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={nextStep} 
                      disabled={passengers.length === 0}
                      className="font-bold"
                    >
                      Next: Review Lock
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* STEP 2: REVIEW & SEAT LOCK COUNTDOWN */}
            {bookingStep === 2 && (
              <div className="flex flex-col gap-6">
                
                {/* Timer Notification Banner */}
                <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-colors ${seatLockFailed ? 'bg-rose-50 border-rose-200 text-accent-red dark:bg-rose-500/10' : 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
                  <Timer className={`w-6 h-6 shrink-0 ${!seatLockFailed && 'animate-pulse'}`} />
                  <div className="text-sm">
                    {seatLockFailed ? (
                      <span className="font-black">Virtual Seat Queue Expired! Please return to step 1 and try again.</span>
                    ) : (
                      <>
                        <span className="font-black block text-base">Seat Lock Queue Active: {formatTime(timeLeft)}</span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mt-0.5">We have locked seats optimistically. Submit payment to secure them permanently.</span>
                      </>
                    )}
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-accent-green" />
                      <span>Review Selected Options</span>
                    </h3>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    <div className="p-4 bg-slate-100/50 dark:bg-brand-blue-dark/50 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                      <span className="text-xs text-brand-orange font-black uppercase tracking-wider block mb-1">SELECTED INVENTORY</span>
                      <h4 className="text-lg font-black text-slate-800 dark:text-white">
                        {isTrain(selectedItem) ? selectedItem.name : isFlight(selectedItem) ? selectedItem.airline : selectedItem.name} 
                        {selectedClass && <span className="text-brand-orange ml-1">({selectedClass})</span>}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                        <div>
                          <span className="block text-xs font-bold text-slate-400">ROUTE</span>
                          <span className="font-bold text-slate-850 dark:text-white mt-0.5 block">
                            {searchQuery.fromCode || searchQuery.from} ➔ {searchQuery.toCode || searchQuery.to}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-400">JOURNEY DATE</span>
                          <span className="font-bold text-slate-850 dark:text-white mt-0.5 block flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                            {searchQuery.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SEAT ALLOCATIONS</span>
                      {passengers.map((p, index) => (
                        <div key={p.id} className="flex justify-between items-center p-3 bg-white dark:bg-brand-blue/30 border border-slate-150 dark:border-slate-800 rounded-xl text-sm font-semibold">
                          <span>{index + 1}. {p.name} ({p.gender})</span>
                          <Badge variant="orange" size="sm">
                            {p.seatNumber || 'Allocating...'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={prevStep} className="font-bold">
                      Back to Form
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={nextStep} 
                      disabled={seatLockFailed}
                      className="font-bold"
                    >
                      Proceed to Payment
                    </Button>
                  </CardFooter>
                </Card>

              </div>
            )}

            {/* STEP 3: PAYMENT & IDEMPOTENT PROCESS */}
            {bookingStep === 3 && (
              <div className="flex flex-col gap-6">
                
                {/* IDEMPOTENCY TRACKER BAR */}
                <div className="p-3 bg-slate-100 dark:bg-brand-blue border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-500 dark:text-slate-400 flex flex-wrap justify-between items-center gap-2">
                  <span>Transaction Security Safeguard Active</span>
                  <span className="font-bold text-brand-orange-light bg-slate-200 dark:bg-brand-blue-dark px-2 py-0.5 rounded uppercase">
                    IDEM-KEY: {idempotencyToken.slice(0, 14)}...
                  </span>
                </div>

                <Card>
                  <CardHeader>
                    <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-orange" />
                      <span>Simulate Payment Checkout</span>
                    </h3>
                  </CardHeader>
                  <CardContent>
                    
                    {/* Method Selector */}
                    <div className="flex gap-4 mb-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${paymentMethod === 'upi' ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'bg-slate-50 dark:bg-brand-blue-dark/50 border-slate-200 dark:border-slate-850 text-slate-500'}`}
                      >
                        ⚡ UPI (BHIM/GPAY/PAYTM)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'bg-slate-50 dark:bg-brand-blue-dark/50 border-slate-200 dark:border-slate-850 text-slate-500'}`}
                      >
                        💳 Debit / Credit Card
                      </button>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
                      
                      {paymentMethod === 'upi' ? (
                        <div className="p-5 text-center bg-slate-100/50 dark:bg-brand-blue-dark/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-3">
                          <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center border border-slate-100">
                            {/* Mock QR code design */}
                            <div className="w-full h-full bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] bg-[size:10px_10px] bg-[position:0_0,5px_5px] opacity-80" />
                          </div>
                          <span className="text-xs font-black text-slate-400 block uppercase">SCAN QR CODE TO PAY</span>
                          <span className="text-xs text-slate-500 font-medium">Or pay directly using virtual address: <span className="font-extrabold text-slate-800 dark:text-white">irctc-rebuild@paytm</span></span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <Input
                            label="Cardholder Name"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="John Doe"
                          />
                          <Input
                            label="Card Number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                            placeholder="4111 2222 3333 4444"
                            maxLength={19}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Expiry Date"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value.replace(/\s?/g, '').replace(/(\d{2})/g, '$1/').replace(/\/$/, ''))}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                            <Input
                              label="CVV"
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="123"
                              maxLength={3}
                            />
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                        <Button type="button" variant="outline" onClick={prevStep} disabled={paymentLoading} className="font-bold">
                          Review details
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={paymentLoading}
                          className="font-bold min-w-[150px]"
                        >
                          Simulate Payment
                        </Button>
                      </div>

                    </form>
                  </CardContent>
                </Card>

              </div>
            )}

          </div>

          {/* SIDEBAR FARE BREAKDOWN TILE */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <Card variant="glass">
              <CardHeader>
                <h3 className="font-black text-slate-800 dark:text-white">Fare Summary</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-500">Base Fare ({passengers.length || 1} Pax)</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{totalBasePrice}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-500">Taxes & GST (5%)</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{tax}</span>
                </div>

                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-500">Service Charges</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{irctcServiceCharge}</span>
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-800/80 my-1" />

                <div className="flex justify-between items-center">
                  <span className="font-black text-slate-800 dark:text-white text-base">Total Fare</span>
                  <span className="font-black text-brand-orange text-xl">₹{totalFare}</span>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>

      {/* IDEMPOTENCY DUPLICATE WARNING MODAL */}
      <Modal
        isOpen={showDuplicateAlert}
        onClose={() => setShowDuplicateAlert(false)}
        title="Double Charging Safeguard Triggered"
        footer={
          <Button variant="primary" onClick={() => setShowDuplicateAlert(false)} className="font-bold">
            Understood
          </Button>
        }
      >
        <div className="text-center p-3">
          <AlertCircle className="w-14 h-14 text-accent-yellow mx-auto mb-4 animate-bounce" />
          <h4 className="font-black text-lg text-slate-800 dark:text-white mb-2">Duplicate Transaction Stopped!</h4>
          <p className="text-sm text-slate-500">
            We detected a duplicate checkout request signed with the exact same Idempotency-Key. 
            To prevent double charges on your account, we cancelled the subsequent transaction. 
            Please review your bookings dashboard to confirm.
          </p>
        </div>
      </Modal>

      {/* OFFLINE NETWORK QUEUE MODAL */}
      <Modal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
        title="Offline Mode Active"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowOfflineModal(false)} className="font-bold">
              Dismiss
            </Button>
            <Button variant="primary" onClick={handlePaymentSubmit} className="font-bold">
              Retry Payment
            </Button>
          </div>
        }
      >
        <div className="text-center p-3">
          <WifiOff className="w-14 h-14 text-rose-500 mx-auto mb-4 animate-pulse" />
          <h4 className="font-black text-lg text-slate-800 dark:text-white mb-2">Network Error (Simulated)</h4>
          <p className="text-sm text-slate-500">
            You are currently simulating offline status. 
            Your transaction cannot be completed while offline. Please toggle the Network status in the header to **Live Sim** and try again.
          </p>
        </div>
      </Modal>

    </div>
  );
}
