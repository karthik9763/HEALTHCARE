import React, { useState } from 'react';
import { Driver } from '../../types';
import { UserCheck, Star, Plus, Phone, Mail, Award, Ambulance as AmbIcon, Trash2 } from 'lucide-react';

export const DriverManagement: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      _id: 'd1',
      name: 'David Miller',
      email: 'david.m@response.org',
      phone: '+1 (555) 444-5555',
      licenseNumber: 'DL-994810-NY',
      experience: 8,
      rating: 4.9,
      status: 'busy',
      ambulanceId: 'AMB-101-NYC',
      completedTrips: 342
    },
    {
      _id: 'd2',
      name: 'Jessica Taylor',
      email: 'jessica.t@response.org',
      phone: '+1 (555) 666-7777',
      licenseNumber: 'DL-883712-NY',
      experience: 6,
      rating: 4.8,
      status: 'available',
      ambulanceId: 'AMB-202-NYC',
      completedTrips: 215
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    experience: 3,
    ambulanceId: 'AMB-101-NYC'
  });

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Driver = {
      _id: `d_${Date.now()}`,
      ...newDriver,
      rating: 5.0,
      status: 'available',
      completedTrips: 0
    };
    setDrivers(prev => [created, ...prev]);
    setShowAddModal(false);
  };

  const deleteDriver = (id: string) => {
    if (confirm('Delete driver profile?')) {
      setDrivers(prev => prev.filter(d => d._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <span>Emergency Driver Personnel Directory</span>
          </h1>
          <p className="text-xs text-slate-400">Driver assignments, performance ratings & license verification</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Driver</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drivers.map((driver) => (
          <div key={driver._id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-extrabold text-lg flex items-center justify-center">
                  {driver.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">{driver.name}</h3>
                  <p className="text-xs text-slate-400">License: {driver.licenseNumber} • {driver.experience} Yrs Exp</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize border ${
                driver.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                {driver.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Assigned Unit:</span>
                <span className="font-bold text-red-400 flex items-center gap-1 mt-0.5">
                  <AmbIcon className="w-3.5 h-3.5" />
                  {typeof driver.ambulanceId === 'string' ? driver.ambulanceId : driver.ambulanceId?.registrationNumber || 'None'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Trips Completed:</span>
                <span className="font-bold text-white mt-0.5 block">{driver.completedTrips} Missions</span>
              </div>
              <div className="col-span-2 flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Driver Rating:
                </span>
                <span className="font-extrabold text-amber-400 text-sm">{driver.rating} / 5.0</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {driver.phone}
              </span>
              <button
                onClick={() => deleteDriver(driver._id)}
                className="text-red-400 hover:text-red-300 p-1 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateDriver} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Register Emergency Driver</h3>
            <input
              type="text"
              placeholder="Driver Full Name"
              required
              value={newDriver.name}
              onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
            <input
              type="text"
              placeholder="License Number (e.g. DL-994810-NY)"
              required
              value={newDriver.licenseNumber}
              onChange={e => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Phone"
                required
                value={newDriver.phone}
                onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
              <input
                type="number"
                placeholder="Years Experience"
                value={newDriver.experience}
                onChange={e => setNewDriver({ ...newDriver, experience: Number(e.target.value) })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs">
                Save Driver Profile
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
