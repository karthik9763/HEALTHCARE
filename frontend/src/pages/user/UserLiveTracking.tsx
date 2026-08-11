import React from 'react';
import { LiveMap } from '../../components/LiveMap';
import { Phone, Navigation, ShieldCheck, Ambulance as AmbIcon, Building2 as HospIcon, Clock } from 'lucide-react';

export const UserLiveTracking: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-red-500 animate-pulse" />
            <span>Live Emergency Response & Ambulance Tracking</span>
          </h1>
          <p className="text-xs text-slate-400">Real-time GPS vector tracking, driver route simulation & estimated arrival</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 text-red-400 px-3.5 py-1.5 rounded-full border border-red-500/30 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>AMBULANCE EN ROUTE</span>
          </div>
          <a
            href="tel:+15554445555"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Driver</span>
          </a>
        </div>
      </div>

      {/* Map Widget */}
      <LiveMap />

      {/* Destination Hospital Summary */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <AmbIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">AMB-101-NYC</p>
            <p className="text-slate-400">Ford Transit ICU Spec • Driver: David Miller</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <HospIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">St. Jude Memorial Hospital</p>
            <p className="text-slate-400">742 Evergreen Terrace • ICU Bed Reserved</p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Estimated Arrival Time:</span>
            <span className="font-extrabold text-red-400 text-xl animate-pulse">4 Minutes</span>
          </div>
        </div>
      </div>

    </div>
  );
};
