import React, { useState } from 'react';
import { Hospital } from '../../types';
import { Building2, Bed, Activity, Phone, Plus, MapPin, Edit2, Trash2 } from 'lucide-react';

export const HospitalManagement: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([
    {
      _id: 'h1',
      name: 'St. Jude Memorial Hospital',
      address: '742 Evergreen Terrace, Downtown',
      latitude: 40.7138,
      longitude: -74.0080,
      phone: '+1 (555) 123-4567',
      totalBeds: 250,
      availableBeds: 42,
      icuBeds: 30,
      availableIcuBeds: 6,
      emergencyContactName: 'Dr. Mark Sloan',
      emergencyContactPhone: '+1 (555) 123-9999'
    },
    {
      _id: 'h2',
      name: 'Metro General Medical Center',
      address: '100 Medical Plaza, Uptown',
      latitude: 40.7250,
      longitude: -73.9950,
      phone: '+1 (555) 987-1111',
      totalBeds: 400,
      availableBeds: 88,
      icuBeds: 50,
      availableIcuBeds: 12
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newHosp, setNewHosp] = useState({
    name: '',
    address: '',
    phone: '',
    totalBeds: 200,
    availableBeds: 35,
    icuBeds: 25,
    availableIcuBeds: 5
  });

  const updateBeds = (id: string, avail: number, icuAvail: number) => {
    setHospitals(prev => prev.map(h => h._id === id ? { ...h, availableBeds: avail, availableIcuBeds: icuAvail } : h));
  };

  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Hospital = {
      _id: `h_${Date.now()}`,
      ...newHosp,
      latitude: 40.7150,
      longitude: -74.0050
    };
    setHospitals(prev => [created, ...prev]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Hospital Bed & ICU Allocation Command</span>
          </h1>
          <p className="text-xs text-slate-400">Live bed capacity tracker, ER contact desks & emergency patient distribution</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hospital Facility</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hospitals.map((h) => (
          <div key={h._id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base">{h.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {h.address}
                </p>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 font-mono px-3 py-1 rounded-xl border border-slate-700">
                {h.phone}
              </span>
            </div>

            {/* Bed & ICU Telemetry Meters */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Bed className="w-4 h-4 text-blue-400" /> General Beds:
                  </span>
                  <span className="font-bold text-white">{h.availableBeds} / {h.totalBeds}</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mt-2">
                  <div className="h-full bg-blue-500" style={{ width: `${(h.availableBeds / h.totalBeds) * 100}%` }} />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Activity className="w-4 h-4 text-red-400" /> ICU Capacity:
                  </span>
                  <span className="font-bold text-red-400">{h.availableIcuBeds} / {h.icuBeds}</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mt-2">
                  <div className="h-full bg-red-500" style={{ width: `${(h.availableIcuBeds / h.icuBeds) * 100}%` }} />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-400">
                Emergency Desk: <strong className="text-slate-200">{h.emergencyContactName || 'Main ER'}</strong>
              </span>
              <button
                onClick={() => {
                  const newAvail = prompt('Update available general beds count:', h.availableBeds.toString());
                  if (newAvail !== null) updateBeds(h._id, Number(newAvail), h.availableIcuBeds);
                }}
                className="text-blue-400 hover:underline font-semibold"
              >
                Quick Update Beds
              </button>
            </div>

          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateHospital} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Hospital Facility</h3>
            <input
              type="text"
              placeholder="Hospital Name"
              required
              value={newHosp.name}
              onChange={e => setNewHosp({ ...newHosp, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Full Address"
              required
              value={newHosp.address}
              onChange={e => setNewHosp({ ...newHosp, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Emergency Desk Phone"
              required
              value={newHosp.phone}
              onChange={e => setNewHosp({ ...newHosp, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Total Beds"
                value={newHosp.totalBeds}
                onChange={e => setNewHosp({ ...newHosp, totalBeds: Number(e.target.value) })}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
              <input
                type="number"
                placeholder="Available Beds"
                value={newHosp.availableBeds}
                onChange={e => setNewHosp({ ...newHosp, availableBeds: Number(e.target.value) })}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs">
                Save Facility
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
