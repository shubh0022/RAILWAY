'use client';

import React from 'react';
import { MapPin, BadgePercent, ReceiptIndianRupee, BookOpen, Clock } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Card, { CardContent } from './ui/Card';

interface PNRResult {
  pnr: string;
  trainNo: string;
  trainName: string;
  date: string;
  from: string;
  to: string;
  passengers: { name: string; bookingStatus: string; currentStatus: string; }[];
}

interface LiveStatusResult {
  trainNo: string;
  trainName: string;
  currentStation: string;
  status: string;
  delayMinutes: number;
  nextStation: string;
  etaNextStation: string;
  lastUpdated: string;
}

export const QuickActions: React.FC = () => {
  const [activeModal, setActiveModal] = React.useState<'pnr' | 'live' | 'refund' | null>(null);
  
  // PNR fields
  const [pnrInput, setPnrInput] = React.useState('');
  const [pnrResult, setPnrResult] = React.useState<PNRResult | null>(null);
  
  // Train live status fields
  const [trainNumber, setTrainNumber] = React.useState('');
  const [liveStatus, setLiveStatus] = React.useState<LiveStatusResult | null>(null);

  const checkPNR = () => {
    if (!pnrInput) return;
    // Mock PNR status
    setPnrResult({
      pnr: pnrInput,
      trainNo: '12952',
      trainName: 'MUMBAI RAJDHANI',
      date: '2026-06-25',
      from: 'NDLS',
      to: 'MMCT',
      passengers: [
        { name: 'Shubham Kumar', bookingStatus: 'CNF (B2/24)', currentStatus: 'CNF' }
      ]
    });
  };

  const trackTrain = () => {
    if (!trainNumber) return;
    // Mock Live Status
    setLiveStatus({
      trainNo: trainNumber,
      trainName: 'KONKAN KANYA EXP',
      currentStation: 'Ratnagiri (RN)',
      status: 'On Time',
      delayMinutes: 0,
      nextStation: 'Sangameshwar Road (SGR)',
      etaNextStation: '18:40',
      lastUpdated: 'Just now'
    });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* PNR Status */}
        <button
          onClick={() => {
            setActiveModal('pnr');
            setPnrResult(null);
          }}
          className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 hover:border-brand-orange/40 hover:bg-white/10 dark:hover:bg-white/5 active:scale-98 cursor-pointer group"
        >
          <div className="bg-brand-orange/10 p-3 rounded-xl text-brand-orange group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">PNR Status</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Check ticket details</span>
          </div>
        </button>

        {/* Live Train */}
        <button
          onClick={() => {
            setActiveModal('live');
            setLiveStatus(null);
          }}
          className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 hover:border-brand-orange/40 hover:bg-white/10 dark:hover:bg-white/5 active:scale-98 cursor-pointer group"
        >
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500 group-hover:scale-110 transition-transform duration-300">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">Live Train Map</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Real-time GPS tracking</span>
          </div>
        </button>

        {/* Refund Status */}
        <button
          onClick={() => setActiveModal('refund')}
          className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 hover:border-brand-orange/40 hover:bg-white/10 dark:hover:bg-white/5 active:scale-98 cursor-pointer group"
        >
          <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform duration-300">
            <ReceiptIndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">Refund History</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Check refund updates</span>
          </div>
        </button>

        {/* Food Delivery (Catering) */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center gap-3 text-center opacity-70 group border-white/5">
          <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
            <BadgePercent className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-slate-400 block text-sm">Travel Insurance</span>
            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Opt-in on booking</span>
          </div>
        </div>
      </div>

      {/* PNR Modal */}
      <Modal
        isOpen={activeModal === 'pnr'}
        onClose={() => setActiveModal(null)}
        title="Check PNR Status"
        footer={
          <Button variant="ghost" onClick={() => setActiveModal(null)}>
            Close
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your 10-digit Passenger Name Record (PNR) number printed on the top-left of the e-ticket.
          </p>
          <div className="flex gap-2">
            <Input
              id="pnrInput"
              placeholder="e.g. 4349832104"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              className="font-bold tracking-widest text-lg text-center"
              maxLength={10}
            />
            <Button variant="secondary" onClick={checkPNR}>
              Check
            </Button>
          </div>

          {pnrResult && (
            <Card className="mt-4 border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{pnrResult.trainName} ({pnrResult.trainNo})</h3>
                    <span className="text-xs text-slate-500">{pnrResult.from} ➔ {pnrResult.to} | Date: {pnrResult.date}</span>
                  </div>
                  <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    {pnrResult.passengers[0].currentStatus}
                  </span>
                </div>
                {pnrResult.passengers.map((p, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{p.name}</span>
                    <span className="font-bold text-slate-600 dark:text-slate-400">Booking: {p.bookingStatus}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </Modal>

      {/* Live Train Tracking Modal */}
      <Modal
        isOpen={activeModal === 'live'}
        onClose={() => setActiveModal(null)}
        title="Live Train Tracking"
        footer={
          <Button variant="ghost" onClick={() => setActiveModal(null)}>
            Close
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter the 5-digit Train Number to locate its real-time position and platform arrival detail.
          </p>
          <div className="flex gap-2">
            <Input
              id="trainNoInput"
              placeholder="e.g. 10111"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              className="font-bold text-lg text-center"
              maxLength={5}
            />
            <Button variant="secondary" onClick={trackTrain}>
              Locate
            </Button>
          </div>

          {liveStatus && (
            <Card className="mt-4 border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{liveStatus.trainName} ({liveStatus.trainNo})</h3>
                    <span className="text-xs text-slate-500">Current position: <span className="font-bold text-blue-500">{liveStatus.currentStation}</span></span>
                  </div>
                  <span className="bg-blue-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {liveStatus.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <p>Next Station: <span className="font-semibold text-slate-800 dark:text-slate-200">{liveStatus.nextStation}</span></p>
                  <p>Estimated Arrival: <span className="font-bold text-slate-800 dark:text-slate-200">{liveStatus.etaNextStation}</span></p>
                  <p className="text-xs text-slate-500 mt-1 italic">Last updated: {liveStatus.lastUpdated}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Modal>

      {/* Refund Status Modal */}
      <Modal
        isOpen={activeModal === 'refund'}
        onClose={() => setActiveModal(null)}
        title="Refund History & Status"
        footer={
          <Button variant="ghost" onClick={() => setActiveModal(null)}>
            Close
          </Button>
        }
      >
        <div className="flex flex-col gap-4 text-center py-4">
          <div className="text-4xl">💸</div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">All refunds are processed!</h3>
            <p className="text-sm text-slate-500 mt-2">
              There are no pending refunds on this account. Cancelled tickets refunds are automatically credited back via UPI within 2 hours.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuickActions;
