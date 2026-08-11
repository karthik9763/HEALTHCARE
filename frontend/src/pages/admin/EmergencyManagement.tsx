import React, { useState } from 'react';
import { EmergencyRequest, EmergencyStatus, EmergencySeverity } from '../../types';
import { AlertOctagon, Ambulance as AmbIcon, CheckCircle2, ChevronRight, MapPin, UserCheck, ShieldAlert, FileText, Zap } from 'lucide-react';

export const EmergencyManagement: React.FC = () => {
  const statusSequence: EmergencyStatus[] = [
    'Request Sent',
    'Ambulance Assigned',
    'Driver En Route',
    'Ambulance Arrived',
    'Patient Picked Up',
    'Reached Hospital',
    'Completed'
  ];

  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([
    {
      _id: 'e101',
      patientName: 'John Doe',
      patientAge: 34,
      patientPhone: '+1 (555) 234-5678',
      location: { latitude: 40.7128, longitude: -74.0060, address: 'Wall Street & Broadway, NY' },
      severity: 'Critical',
      description: 'Acute chest pain, shortness of breath. Possible cardiac arrest.',
      status: 'Driver En Route',
      ambulanceId: { _id: 'a1', registrationNumber: 'AMB-101-NYC', model: 'Ford Transit', capacity: 2, status: 'busy', currentLocation: { latitude: 40.7145, longitude: -74.0070 }, fuelLevel: 88, gpsStatus: 'active' },
      driverId: { _id: 'd1', name: 'David Miller', email: 'd@r.org', phone: '+1 (555) 444-5555', licenseNumber: 'DL-991', experience: 8, rating: 4.9, status: 'busy' },
      estimatedArrivalTime: '4 mins',
      distanceRemainingKm: 1.8,
      priority: 10,
      createdAt: '2026-08-10T18:00:00Z'
    },
    {
      _id: 'e102',
      patientName: 'Alice Smith',
      patientAge: 28,
      patientPhone: '+1 (555) 876-5432',
      location: { latitude: 40.7250, longitude: -73.9950, address: '5th Avenue & 23rd St, NY' },
      severity: 'Moderate',
      description: 'Severe asthma attack.',
      status: 'Request Sent',
      priority: 6,
      createdAt: '2026-08-10T18:15:00Z'
    }
  ]);

  const advanceStatus = (id: string, currentStatus: EmergencyStatus) => {
    const currentIndex = statusSequence.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < statusSequence.length - 1) {
      const nextStatus = statusSequence[currentIndex + 1];
      setEmergencies(prev => prev.map(e => e._id === id ? { ...e, status: nextStatus } : e));
    }
  };

  const autoDispatchNearest = (id: string) => {
    setEmergencies(prev => prev.map(e => {
      if (e._id === id) {
        return {
          ...e,
          status: 'Ambulance Assigned',
          estimatedArrivalTime: '5 mins',
          ambulanceId: { _id: 'a2', registrationNumber: 'AMB-202-NYC', model: 'Mercedes Sprinter', capacity: 3, status: 'busy', currentLocation: { latitude: 40.7210, longitude: -73.9980 }, fuelLevel: 95, gpsStatus: 'active' },
          driverId: { _id: 'd2', name: 'Jessica Taylor', email: 'j@r.org', phone: '+1 (555) 666-7777', licenseNumber: 'DL-883', experience: 6, rating: 4.8, status: 'busy' }
        };
      }
      return e;
    }));
  };

  const changePriority = (id: string, newPriority: number) => {
    setEmergencies(prev => prev.map(e => e._id === id ? { ...e, priority: newPriority } : e));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" />
            <span>Emergency Command & Dispatch Center</span>
          </h1>
          <p className="text-xs text-slate-400">7-Stage emergency lifecycle management, auto-dispatch & priority boosting</p>
        </div>
      </div>

      {/* Emergency Requests List */}
      <div className="space-y-6">
        {emergencies.map((e) => (
          <div key={e._id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
            
            {/* Top Bar: Patient, Severity & Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs text-white ${
                  e.severity === 'Critical' ? 'bg-red-600 shadow-lg shadow-red-600/30' :
                  e.severity === 'High' ? 'bg-rose-500' :
                  e.severity === 'Moderate' ? 'bg-amber-500' : 'bg-blue-500'
                }`}>
                  {e.severity.toUpperCase().slice(0, 3)}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    {e.patientName} ({e.patientAge} Yrs)
                    <span className="text-xs text-slate-400 font-normal">• Phone: {e.patientPhone}</span>
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" /> {e.location.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Priority Rank:</span>
                  <select
                    value={e.priority}
                    onChange={(evt) => changePriority(e._id, Number(evt.target.value))}
                    className="bg-slate-950 text-amber-400 font-extrabold text-xs px-2 py-1 rounded-lg border border-slate-800"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(p => (
                      <option key={p} value={p}>P-{p}</option>
                    ))}
                  </select>
                </div>

                <span className="px-3 py-1.5 rounded-xl font-bold text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                  {e.status}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <strong className="text-slate-400">Emergency Details:</strong> {e.description}
            </p>

            {/* 7-Stage Workflow Progress Visualizer */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                7-Stage Response Lifecycle Progress:
              </span>
              <div className="flex items-center justify-between overflow-x-auto gap-1 py-1">
                {statusSequence.map((stg, idx) => {
                  const currentIdx = statusSequence.indexOf(e.status);
                  const isCompleted = idx <= currentIdx;
                  return (
                    <div
                      key={stg}
                      className={`flex-1 min-w-[100px] p-2 rounded-xl text-center border text-[10px] font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}
                    >
                      {stg}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              
              {/* Unit Info if assigned */}
              {e.ambulanceId ? (
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <AmbIcon className="w-4 h-4 text-red-400" />
                  <span>Unit: <strong className="text-white">{e.ambulanceId.registrationNumber}</strong></span>
                  <span>•</span>
                  <span>Driver: <strong className="text-white">{e.driverId?.name}</strong></span>
                </div>
              ) : (
                <button
                  onClick={() => autoDispatchNearest(e._id)}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  <Zap className="w-4 h-4 animate-bounce" />
                  <span>Auto-Dispatch Nearest Ambulance</span>
                </button>
              )}

              {/* Advance Status Button */}
              {e.status !== 'Completed' && e.status !== 'Cancelled' && (
                <button
                  onClick={() => advanceStatus(e._id, e.status)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md ml-auto"
                >
                  <span>Advance to Next Stage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
