'use client';

import React from 'react';
import { BarChart3, Database, Activity, Clock, ServerCrash, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';

export default function AdminDashboard() {
  const { bookings, isOfflineMode, setOfflineMode } = useAppStore();

  // Simulated metrics
  const [latencySim, setLatencySim] = React.useState<number>(150); // ms
  const [isTatkalQueueActive, setIsTatkalQueueActive] = React.useState(false);

  // Compute stats
  const totalBookingsCount = bookings.length + 142; // Add dummy base count
  const revenueTotal = bookings.reduce((sum, b) => sum + b.totalFare, 0) + 184500;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-blue-dark pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-8 h-8 text-brand-orange" />
            <span>N-MOS Platform Control Hub</span>
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-1">Real-time telemetry, transaction flows, and infrastructure scaling controls.</p>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Booking Vol */}
          <Card variant="default" className="border-white/5 dark:bg-brand-blue/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-brand-orange/10 p-3.5 rounded-2xl text-brand-orange">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</span>
                <span className="block text-2xl font-black text-slate-800 dark:text-white mt-1">{totalBookingsCount}</span>
                <span className="text-[10px] text-accent-green font-bold flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> +12% this hour
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card variant="default" className="border-white/5 dark:bg-brand-blue/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-emerald-500/10 p-3.5 rounded-2xl text-emerald-500">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Revenue</span>
                <span className="block text-2xl font-black text-slate-800 dark:text-white mt-1">₹{revenueTotal}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">UPI/e-Rupee settlement</span>
              </div>
            </CardContent>
          </Card>

          {/* SLA Latency */}
          <Card variant="default" className="border-white/5 dark:bg-brand-blue/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-blue-500/10 p-3.5 rounded-2xl text-blue-500">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Search Latency SLA</span>
                <span className="block text-2xl font-black text-slate-800 dark:text-white mt-1">{latencySim}ms</span>
                <span className="text-[10px] text-accent-green font-bold block mt-0.5">Excellent (sub-200ms)</span>
              </div>
            </CardContent>
          </Card>

          {/* Error rate */}
          <Card variant="default" className="border-white/5 dark:bg-brand-blue/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="bg-rose-500/10 p-3.5 rounded-2xl text-rose-500">
                <ServerCrash className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Error Rate</span>
                <span className="block text-2xl font-black text-slate-800 dark:text-white mt-1">0.03%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">0.00% during Tatkal slots</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* OPERATIONS PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SIMULATION AND INFRUSTRUCTURE CONTROLS */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card variant="glass" className="p-5">
              <CardHeader className="px-0 pt-0 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                <h2 className="font-extrabold text-base text-slate-800 dark:text-white">Network & Load Simulator</h2>
              </CardHeader>
              <CardContent className="p-0 flex flex-col gap-5">
                
                {/* Offline toggle */}
                <div className="flex justify-between items-center bg-slate-50 dark:bg-brand-blue-dark/50 p-3 rounded-2xl">
                  <div>
                    <span className="font-bold text-sm block">Offline Mode</span>
                    <span className="text-[10px] text-slate-400">Simulate cell-tower dropouts</span>
                  </div>
                  <button
                    onClick={() => setOfflineMode(!isOfflineMode)}
                    className={`
                      px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all duration-300
                      ${isOfflineMode 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}
                    `}
                  >
                    {isOfflineMode ? 'OFFLINE' : 'ONLINE'}
                  </button>
                </div>

                {/* Tatkal queue simulator */}
                <div className="flex justify-between items-center bg-slate-50 dark:bg-brand-blue-dark/50 p-3 rounded-2xl">
                  <div>
                    <span className="font-bold text-sm block">Tatkal Virtual Queue</span>
                    <span className="text-[10px] text-slate-400">Simulate 100M user waiting room</span>
                  </div>
                  <button
                    onClick={() => setIsTatkalQueueActive(!isTatkalQueueActive)}
                    className={`
                      px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all duration-300
                      ${isTatkalQueueActive 
                        ? 'bg-brand-orange text-white' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}
                    `}
                  >
                    {isTatkalQueueActive ? 'ACTIVE' : 'DEACTIVE'}
                  </button>
                </div>

                {/* Latency slider */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Simulate Database Latency</label>
                  <input
                    type="range"
                    min="50"
                    max="3000"
                    step="50"
                    value={latencySim}
                    onChange={(e) => setLatencySim(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                  />
                  <div className="flex justify-between text-xs font-bold text-slate-400 mt-2">
                    <span>50ms</span>
                    <span className="text-brand-orange font-extrabold">{latencySim}ms</span>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* TRANSACTION HISTORY TELEMETRY */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card variant="glass" className="p-5">
              <CardHeader className="px-0 pt-0 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                <h2 className="font-extrabold text-base text-slate-800 dark:text-white">Recent Transactions Feed</h2>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {bookings.length > 0 ? (
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                        <th className="py-2.5">PNR</th>
                        <th className="py-2.5">User</th>
                        <th className="py-2.5">Item</th>
                        <th className="py-2.5">Class</th>
                        <th className="py-2.5 text-right">Fare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-b border-slate-100/50 dark:border-slate-800/40 text-slate-700 dark:text-slate-300">
                          <td className="py-3 font-extrabold tracking-wider text-slate-800 dark:text-white">{b.pnr}</td>
                          <td className="py-3">Shubham Kumar</td>
                          <td className="py-3 font-semibold">{b.itemName}</td>
                          <td className="py-3">{b.travelClass}</td>
                          <td className="py-3 text-right font-bold text-slate-800 dark:text-white">₹{b.totalFare}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm italic">
                    No transactions captured in store yet. Try booking a ticket.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}
