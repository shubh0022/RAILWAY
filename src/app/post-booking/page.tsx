'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../store';
import { Booking } from '../../types';
import Button from '../../components/ui/Button';
import Card, { CardContent, CardFooter } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { 
  Ticket, 
  MapPin, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  Download, 
  Train, 
  Plane, 
  Hotel
} from 'lucide-react';

export default function PostBookingDashboard() {
  const router = useRouter();
  const { bookings, cancelBooking } = useAppStore();

  // Track which booking has expanded tracking (key: bookingId, value: boolean)
  const [expandedTracking, setExpandedTracking] = React.useState<Record<string, boolean>>({});

  // Ticket modal state
  const [selectedTicket, setSelectedTicket] = React.useState<Booking | null>(null);
  
  // Cancel confirmation modal state
  const [cancellingBooking, setCancellingBooking] = React.useState<Booking | null>(null);
  const [cancellationSuccess, setCancellationSuccess] = React.useState(false);

  // Simulated live tracking markers (stations along the route)
  const getTrackingRoute = (booking: Booking) => {
    if (booking.type === 'train') {
      return [
        { station: booking.fromCode || 'NDLS', status: 'passed', time: '16:55 (Actual)' },
        { station: 'CNB (Kanpur)', status: 'passed', time: '22:45 (Actual)' },
        { station: 'PRYJ (Prayagraj)', status: 'current', time: '01:20 (Arriving Now)' },
        { station: 'DDU (Mughalsarai)', status: 'upcoming', time: '03:15 (Scheduled)' },
        { station: booking.toCode || 'HWH', status: 'upcoming', time: '09:55 (Scheduled)' }
      ];
    } else if (booking.type === 'flight') {
      return [
        { station: booking.fromCode || 'DEL', status: 'passed', time: 'Check-in Closed' },
        { station: 'Security Gate', status: 'passed', time: 'Boarding Completed' },
        { station: 'In-Air', status: 'current', time: 'Altitude 32,000ft' },
        { station: booking.toCode || 'BOM', status: 'upcoming', time: 'Landing Prep (10 mins)' }
      ];
    } else {
      return [
        { station: 'Reservation Confirmed', status: 'passed', time: '12:00 PM' },
        { station: 'Front Desk check-in', status: 'current', time: 'Ready (Room 304 allocated)' },
        { station: 'Checkout scheduled', status: 'upcoming', time: '11:00 AM tomorrow' }
      ];
    }
  };

  const toggleTracking = (id: string) => {
    setExpandedTracking(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrintTicket = () => {
    alert('Simulating system print dialog... Ticket ready for layout conversion.');
  };

  const handleConfirmCancellation = () => {
    if (!cancellingBooking) return;
    cancelBooking(cancellingBooking.id);
    setCancellationSuccess(true);
    setTimeout(() => {
      setCancellationSuccess(false);
      setCancellingBooking(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-blue-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-xs font-bold text-brand-orange-light uppercase tracking-wider block">Dashboard</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight mt-0.5">
              My Travel Bookings
            </h1>
          </div>
          <Button variant="primary" size="sm" onClick={() => router.push('/')} className="font-bold">
            Book Another
          </Button>
        </div>

        {/* BOOKINGS LIST */}
        <div className="flex flex-col gap-6">
          {bookings.length === 0 ? (
            <Card className="p-10 text-center flex flex-col items-center gap-4">
              <Ticket className="w-16 h-16 text-slate-350 dark:text-slate-700 animate-pulse" />
              <h3 className="font-extrabold text-xl">No Journeys Booked Yet</h3>
              <p className="text-sm text-slate-500 max-w-sm">Explore premium flights, trains, and hotels, and make your first booking to view tickets and live track progress here.</p>
              <Button onClick={() => router.push('/')} variant="secondary">
                Search Travel Options
              </Button>
            </Card>
          ) : (
            bookings.map((booking) => {
              const isExpanded = !!expandedTracking[booking.id];
              const routeProgress = getTrackingRoute(booking);
              const isCancelled = booking.status === 'CANCELLED';

              return (
                <Card key={booking.id} className={`border-white/5 ${isCancelled ? 'opacity-85' : ''}`}>
                  <CardContent className="p-5 sm:p-6">
                    {/* Top Row: Info Summary */}
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-brand-orange/10 p-2.5 rounded-xl text-brand-orange shrink-0">
                          {booking.type === 'train' ? <Train className="w-5 h-5" /> : booking.type === 'flight' ? <Plane className="w-5 h-5" /> : <Hotel className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-800 dark:text-white text-base">
                              PNR: {booking.pnr}
                            </span>
                            <span className="text-xs text-slate-400 font-bold">| ID: {booking.id}</span>
                          </div>
                          <span className="text-xs text-slate-500 font-bold block mt-0.5">
                            Booked on: {new Date(booking.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          </span>
                        </div>
                      </div>
                      <Badge variant={isCancelled ? 'error' : 'success'} size="md">
                        {booking.status}
                      </Badge>
                    </div>

                    {/* Middle Row: Journey Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 items-center">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">SERVICE</span>
                        <span className="font-extrabold text-base text-slate-850 dark:text-white mt-1 block">
                          {booking.itemName} {booking.itemNumber && `(${booking.itemNumber})`}
                        </span>
                        {booking.travelClass && (
                          <span className="text-xs font-bold text-brand-orange mt-0.5 block">{booking.travelClass} Class</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ROUTE</span>
                        <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-1 block">
                          {booking.from} {booking.fromCode && `(${booking.fromCode})`}
                        </span>
                        <span className="text-xs text-slate-400 block font-bold">➔ {booking.to} {booking.toCode && `(${booking.toCode})`}</span>
                      </div>

                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">JOURNEY DATE</span>
                        <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-1 block">
                          {booking.date}
                        </span>
                        <span className="text-xs text-slate-400 block font-bold">Total Fare: ₹{booking.totalFare}</span>
                      </div>
                    </div>

                    {/* Passenger List */}
                    <div className="bg-slate-50 dark:bg-brand-blue-dark/50 p-4 rounded-2xl border border-slate-150 dark:border-slate-800 mb-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">PASSENGERS</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold">
                        {booking.passengers.map((p, idx) => (
                          <div key={p.id} className="flex justify-between items-center py-1">
                            <span className="text-slate-700 dark:text-slate-300">{idx + 1}. {p.name} ({p.gender}, Age {p.age})</span>
                            <span className="text-brand-orange font-bold text-xs">{p.seatNumber || 'Confirmed'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* LIVE TRACKING COLLAPSIBLE ACCORDION */}
                    {!isCancelled && (
                      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4">
                        <button
                          onClick={() => toggleTracking(booking.id)}
                          className="flex justify-between items-center w-full text-sm font-black text-slate-650 hover:text-slate-850 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-brand-orange" />
                            Live Progress Status
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-5 pl-4 border-l-2 border-slate-200 dark:border-slate-800 flex flex-col gap-4 animate-fade-in">
                            {routeProgress.map((stop, idx) => {
                              const isPassed = stop.status === 'passed';
                              const isCurrent = stop.status === 'current';
                              
                              return (
                                <div key={idx} className="flex items-start gap-4 relative">
                                  {/* Timeline marker */}
                                  <div className={`
                                    w-3.5 h-3.5 rounded-full z-10 shrink-0 mt-1
                                    ${isPassed ? 'bg-accent-green' : isCurrent ? 'bg-brand-orange ring-4 ring-brand-orange/20 animate-pulse' : 'bg-slate-350 dark:bg-slate-800'}
                                  `} />
                                  
                                  <div>
                                    <span className={`text-sm font-bold block ${isCurrent ? 'text-brand-orange' : 'text-slate-700 dark:text-slate-300'}`}>
                                      {stop.station}
                                    </span>
                                    <span className="text-xs text-slate-405 block mt-0.5">{stop.time}</span>
                                  </div>
                                </div>
                              );
                            })}
                            <Button 
                              variant="glass" 
                              size="sm" 
                              leftIcon={<RefreshCw className="w-3.5 h-3.5 text-brand-orange" />}
                              className="font-bold self-start mt-2"
                              onClick={() => alert('Polling updated tracking telemetry...')}
                            >
                              Sync Telemetry
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                  </CardContent>

                  {/* Booking Footer Buttons */}
                  <CardFooter className="flex justify-end gap-3 flex-wrap">
                    {!isCancelled ? (
                      <>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => setCancellingBooking(booking)}
                          className="font-bold shrink-0"
                        >
                          Cancel Booking
                        </Button>
                        <Button 
                          variant="glass" 
                          size="sm" 
                          onClick={() => setSelectedTicket(booking)}
                          leftIcon={<Ticket className="w-4 h-4 text-brand-orange" />}
                          className="font-bold shrink-0"
                        >
                          Digital Pass
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-accent-red flex items-center gap-1.5 py-2">
                        <XCircle className="w-4 h-4" /> Cancelled (Refund Processed)
                      </span>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>

      </div>

      {/* DIGITAL TICKET / BOARDING PASS MODAL */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title="Digital Boarding Pass"
        size="md"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrintTicket} leftIcon={<Printer className="w-4 h-4" />}>
              Print
            </Button>
            <Button variant="primary" size="sm" onClick={() => setSelectedTicket(null)} leftIcon={<Download className="w-4 h-4" />}>
              Download Pass
            </Button>
          </div>
        }
      >
        {selectedTicket && (
          <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-brand-blue-dark/30">
            {/* Header info */}
            <div className="flex justify-between items-center border-b-2 border-dashed border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-black text-brand-orange uppercase block">BOARDING PASS</span>
                <span className="text-xl font-black text-slate-800 dark:text-white mt-1 block">
                  {selectedTicket.itemName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 block uppercase">PNR RECORD</span>
                <span className="text-base font-black text-slate-800 dark:text-white mt-1 block">
                  {selectedTicket.pnr}
                </span>
              </div>
            </div>

            {/* Travel Route Info */}
            <div className="grid grid-cols-3 items-center text-center py-4">
              <div className="text-left">
                <span className="text-2xl font-black text-slate-850 dark:text-white">{selectedTicket.fromCode || selectedTicket.from.slice(0, 3).toUpperCase()}</span>
                <span className="text-xs text-slate-500 font-semibold block mt-0.5 truncate">{selectedTicket.from}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center relative">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">JOURNEY</span>
                <div className="w-full flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-350 dark:bg-slate-800" />
                  <div className="flex-grow h-px border-t-2 border-dashed border-slate-200 dark:border-slate-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                </div>
                <span className="text-xs text-slate-500 font-bold mt-1 block">{selectedTicket.date}</span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-slate-850 dark:text-white">{selectedTicket.toCode || selectedTicket.to.slice(0, 3).toUpperCase()}</span>
                <span className="text-xs text-slate-500 font-semibold block mt-0.5 truncate">{selectedTicket.to}</span>
              </div>
            </div>

            {/* Passenger Manifest */}
            <div className="border-t-2 border-dashed border-slate-200 dark:border-slate-800 pt-4 mt-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">PASSENGER DETAILS</span>
              {selectedTicket.passengers.map((p, idx) => (
                <div key={p.id} className="flex justify-between items-center py-1.5 text-sm font-semibold border-b border-slate-100 dark:border-slate-850 last:border-0">
                  <span>{idx + 1}. {p.name} ({p.gender})</span>
                  <span className="text-brand-orange font-black uppercase text-xs">{p.seatNumber || 'Confirmed'}</span>
                </div>
              ))}
            </div>

            {/* QR Code Segment */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                {/* Visual grid rendering a clean fake QR code block */}
                <div className="w-36 h-36 flex flex-wrap gap-0.5">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-[34px] h-[34px] border ${i % 3 === 0 || i === 0 || i === 15 ? 'bg-slate-900 border-slate-900' : 'bg-transparent border-slate-100'}`} 
                    />
                  ))}
                </div>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center block">SCAN TICKET FOR TELEMETRY SCANNER</span>
            </div>

          </div>
        )}
      </Modal>

      {/* CANCELLATION DIALOG */}
      <Modal
        isOpen={!!cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        title="Cancel Travel Reservation"
        footer={
          cancellationSuccess ? null : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCancellingBooking(null)}>
                Keep Reservation
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmCancellation} className="font-bold">
                Confirm Cancel
              </Button>
            </div>
          )
        }
      >
        {cancellingBooking && (
          <div className="p-2 text-center">
            {cancellationSuccess ? (
              <div className="animate-fade-in flex flex-col items-center py-4">
                <CheckCircle2 className="w-16 h-16 text-accent-green mb-4 animate-bounce" />
                <h4 className="font-black text-lg text-slate-805 dark:text-white mb-2">Reservation Cancelled Successfully</h4>
                <p className="text-sm text-slate-500">
                  Your cancellation request has been processed. A mock refund of <span className="font-black text-brand-orange">₹{cancellingBooking.totalFare - 250}</span> has been credited back to your payment mode.
                </p>
              </div>
            ) : (
              <div>
                <AlertTriangle className="w-14 h-14 text-accent-red mx-auto mb-4 animate-pulse" />
                <h4 className="font-black text-lg text-slate-800 dark:text-white mb-2">Are you absolutely sure?</h4>
                <p className="text-sm text-slate-500 mb-4">
                  You are cancelling reservation for <span className="font-black text-slate-800 dark:text-white">{cancellingBooking.itemName}</span> (PNR: {cancellingBooking.pnr}).
                </p>
                <div className="p-3 bg-slate-100 dark:bg-brand-blue-dark/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Total booking value: ₹{cancellingBooking.totalFare} <br />
                  Cancellation Fee: ₹250 <br />
                  <span className="font-bold text-accent-green">Simulated Refund Value: ₹{cancellingBooking.totalFare - 250}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}
