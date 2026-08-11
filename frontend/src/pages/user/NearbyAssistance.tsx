import React, { useState } from 'react';
import { MapPin, Phone, Navigation, Building2, Shield, Flame, Droplets, HeartHandshake, Stethoscope } from 'lucide-react';

export const NearbyAssistance: React.FC = () => {
  const [category, setCategory] = useState<'hospitals' | 'clinics' | 'pharmacies' | 'blood' | 'police' | 'fire' | 'shelters'>('hospitals');

  const places = [
    { name: 'St. Jude Memorial Hospital', distance: '1.2 km', time: '4 mins', phone: '+1 (555) 123-4567', type: 'hospitals', address: '742 Evergreen Terrace' },
    { name: 'Metro General ER Trauma Unit', distance: '2.5 km', time: '7 mins', phone: '+1 (555) 987-1111', type: 'hospitals', address: '100 Medical Plaza' },
    { name: 'Downtown FastCare Clinic', distance: '0.8 km', time: '2 mins', phone: '+1 (555) 222-3333', type: 'clinics', address: '45 Main St' },
    { name: 'CVS Health 24/7 Pharmacy', distance: '0.5 km', time: '1 min', phone: '+1 (555) 888-9999', type: 'pharmacies', address: '88 Broadway' },
    { name: 'Red Cross Central Blood Bank', distance: '3.1 km', time: '9 mins', phone: '+1 (555) 777-6666', type: 'blood', address: '12 Health Ave' },
    { name: 'NYC 1st Precinct Police Station', distance: '1.5 km', time: '5 mins', phone: '911', type: 'police', address: '16 Ericsson Pl' },
    { name: 'Engine 7 Fire Department Station', distance: '0.9 km', time: '3 mins', phone: '911', type: 'fire', address: '49 Duane St' },
    { name: 'Metropolitan Crisis Emergency Shelter', distance: '2.1 km', time: '6 mins', phone: '+1 (555) 444-1111', type: 'shelters', address: '90 Shelter Rd' }
  ];

  const filteredPlaces = places.filter(p => p.type === category);

  const openNav = (addr: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span>Nearby Emergency Assistance Finder</span>
        </h1>
        <p className="text-xs text-slate-400">Locate nearby hospitals, 24/7 pharmacies, blood banks, police & fire stations with turn-by-turn navigation</p>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setCategory('hospitals')} className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${category === 'hospitals' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
          🏥 Hospitals
        </button>
        <button onClick={() => setCategory('clinics')} className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${category === 'clinics' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
          🩺 Clinics
        </button>
        <button onClick={() => setCategory('pharmacies')} className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${category === 'pharmacies' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
          💊 24/7 Pharmacies
        </button>
        <button onClick={() => setCategory('blood')} className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${category === 'blood' ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
          🩸 Blood Banks
        </button>
        <button onClick={() => setCategory('police')} className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${category === 'police' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
          🚓 Police Stations
        </button>
        <button onClick={() => setCategory('fire')} className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${category === 'fire' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
          🚒 Fire Stations
        </button>
        <button onClick={() => setCategory('shelters')} className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${category === 'shelters' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
          ⛺ Emergency Shelters
        </button>
      </div>

      {/* Places Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlaces.map((p, idx) => (
          <div key={idx} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <h3 className="font-bold text-white text-sm">{p.name}</h3>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {p.distance} ({p.time})
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {p.address}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={`tel:${p.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 rounded-xl border border-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Call ({p.phone})</span>
              </a>
              <button
                onClick={() => openNav(p.address)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
