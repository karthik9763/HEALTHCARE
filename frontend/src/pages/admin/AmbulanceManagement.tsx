import React, { useState } from 'react';
import { Ambulance, AmbulanceStatus } from '../../types';
import { Ambulance as AmbIcon, Plus, Edit3, Trash2, Fuel, Wrench, Navigation, ShieldCheck, UserCheck } from 'lucide-react';

export const AmbulanceManagement: React.FC = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([
    {
      _id: 'amb1',
      registrationNumber: 'AMB-101-NYC',
      model: 'Ford Transit ICU Spec',
      capacity: 2,
      status: 'busy',
      currentLocation: { latitude: 40.7145, longitude: -74.0070, address: 'Near Wall St & Broadway' },
      fuelLevel: 88,
      gpsStatus: 'active',
      speed: 45,
      driverId: 'David Miller',
      maintenanceHistory: [
        { date: '2026-07-20', details: 'Brake pad replacement & oil change', cost: 450 }
      ]
    },
    {
      _id: 'amb2',
      registrationNumber: 'AMB-202-NYC',
      model: 'Mercedes-Benz Sprinter ER',
      capacity: 3,
      status: 'available',
      currentLocation: { latitude: 40.7210, longitude: -73.9980, address: 'Base Station 2, Uptown' },
      fuelLevel: 95,
      gpsStatus: 'active',
      speed: 0,
      driverId: 'Jessica Taylor'
    },
    {
      _id: 'amb3',
      registrationNumber: 'AMB-303-NYC',
      model: 'Chevrolet Express Rescue',
      capacity: 2,
      status: 'maintenance',
      currentLocation: { latitude: 40.7050, longitude: -74.0120, address: 'Service Garage B' },
      fuelLevel: 40,
      gpsStatus: 'inactive',
      speed: 0,
      driverId: 'Unassigned'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAmb, setNewAmb] = useState({
    registrationNumber: '',
    model: 'Ford Transit ICU',
    capacity: 2,
    fuelLevel: 100,
    driverId: 'Unassigned'
  });

  const updateStatus = (id: string, status: AmbulanceStatus) => {
    setAmbulances(prev => prev.map(a => a._id === id ? { ...a, status } : a));
  };

  const handleAddAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Ambulance = {
      _id: `amb_${Date.now()}`,
      registrationNumber: newAmb.registrationNumber,
      model: newAmb.model,
      capacity: newAmb.capacity,
      status: 'available',
      currentLocation: { latitude: 40.7128, longitude: -74.0060, address: 'Central Dispatch Hub' },
      fuelLevel: newAmb.fuelLevel,
      gpsStatus: 'active',
      driverId: newAmb.driverId
    };
    setAmbulances(prev => [created, ...prev]);
    setShowAddModal(false);
  };

  const deleteAmb = (id: string) => {
    if (confirm('Are you sure you want to delete this ambulance unit?')) {
      setAmbulances(prev => prev.filter(a => a._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <AmbIcon className="w-5 h-5 text-red-500" />
            <span>Ambulance Fleet Command</span>
          </h1>
          <p className="text-xs text-slate-400">Live GPS tracking, fuel monitoring, driver assignments & status dispatch</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Ambulance Unit</span>
        </button>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ambulances.map((amb) => (
          <div key={amb._id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div>
                  <h3 className="font-extrabold text-white text-base">{amb.registrationNumber}</h3>
                  <p className="text-xs text-slate-400">{amb.model} • Cap: {amb.capacity} Beds</p>
                </div>
                
                {/* Status Badge */}
                <select
                  value={amb.status}
                  onChange={(e) => updateStatus(amb._id, e.target.value as AmbulanceStatus)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize border bg-slate-950 ${
                    amb.status === 'available' ? 'text-emerald-400 border-emerald-500/30' :
                    amb.status === 'busy' ? 'text-red-400 border-red-500/30' :
                    amb.status === 'maintenance' ? 'text-amber-400 border-amber-500/30' : 'text-slate-400 border-slate-700'
                  }`}
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy (Dispatched)</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {/* Telemetry info */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Driver:
                  </span>
                  <span className="font-semibold text-white">{typeof amb.driverId === 'string' ? amb.driverId : amb.driverId?.name || 'Unassigned'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Location:
                  </span>
                  <span className="font-medium text-slate-300 text-[11px] max-w-[160px] truncate">{amb.currentLocation.address}</span>
                </div>

                {/* Fuel Meter */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-amber-400" /> Fuel Level:
                    </span>
                    <span className="font-bold text-amber-400">{amb.fuelLevel}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all ${
                        amb.fuelLevel > 50 ? 'bg-emerald-500' : amb.fuelLevel > 20 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${amb.fuelLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                amb.gpsStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                GPS: {amb.gpsStatus.toUpperCase()}
              </span>

              <button
                onClick={() => deleteAmb(amb._id)}
                className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                title="Remove Ambulance"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddAmbulance} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Ambulance Unit</h3>
            <input
              type="text"
              placeholder="Registration Number (e.g. AMB-404-NYC)"
              required
              value={newAmb.registrationNumber}
              onChange={e => setNewAmb({ ...newAmb, registrationNumber: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Model Specification"
              required
              value={newAmb.model}
              onChange={e => setNewAmb({ ...newAmb, model: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Capacity (Beds)"
                value={newAmb.capacity}
                onChange={e => setNewAmb({ ...newAmb, capacity: Number(e.target.value) })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
              <input
                type="number"
                placeholder="Initial Fuel %"
                value={newAmb.fuelLevel}
                onChange={e => setNewAmb({ ...newAmb, fuelLevel: Number(e.target.value) })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-xs">
                Create Unit
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
