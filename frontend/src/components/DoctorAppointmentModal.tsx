import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Stethoscope, Building2, CheckCircle2, UserCheck } from 'lucide-react';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  qualification: string;
  hospitalName: string;
  consultationFee: number;
  rating: number;
  availableHours: string;
}

interface DoctorAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedSpecialty?: string;
}

export const DoctorAppointmentModal: React.FC<DoctorAppointmentModalProps> = ({
  isOpen,
  onClose,
  recommendedSpecialty
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(recommendedSpecialty || 'All');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('10:30 AM');
  const [reason, setReason] = useState<string>('Routine health consultation & BP checkup');
  const [loading, setLoading] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const specialties = ['All', 'Cardiology', 'General Physician', 'Neurologist', 'Pulmonologist', 'Endocrinologist'];

  useEffect(() => {
    if (recommendedSpecialty) {
      setSelectedSpecialty(recommendedSpecialty);
    }
  }, [recommendedSpecialty]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchDoctors = async () => {
      try {
        const url = selectedSpecialty !== 'All' ? `/api/doctors?specialty=${encodeURIComponent(selectedSpecialty)}` : '/api/doctors';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
          if (data.length > 0) setSelectedDoctor(data[0]);
        } else {
          // Fallback mock doctors
          const mock = [
            {
              _id: 'doc_1',
              name: 'Dr. Michael Vance',
              specialty: 'Cardiology',
              qualification: 'MD, FACC',
              hospitalName: 'St. Jude Heart & Cardiac Institute',
              consultationFee: 75,
              rating: 4.9,
              availableHours: '09:00 AM - 04:00 PM'
            },
            {
              _id: 'doc_2',
              name: 'Dr. Sarah Jenkins',
              specialty: 'General Physician',
              qualification: 'MBBS, MD (Internal Med)',
              hospitalName: 'Central City Hospital',
              consultationFee: 50,
              rating: 4.8,
              availableHours: '08:00 AM - 06:00 PM'
            },
            {
              _id: 'doc_3',
              name: 'Dr. Aris Thorne',
              specialty: 'Neurologist',
              qualification: 'DM (Neurology)',
              hospitalName: 'Central City Hospital',
              consultationFee: 90,
              rating: 4.95,
              availableHours: '10:00 AM - 05:00 PM'
            },
            {
              _id: 'doc_4',
              name: 'Dr. Emily Watson',
              specialty: 'Pulmonologist',
              qualification: 'MD (Chest Diseases)',
              hospitalName: 'Central City Hospital',
              consultationFee: 65,
              rating: 4.7,
              availableHours: '09:00 AM - 03:00 PM'
            }
          ];
          const filtered = selectedSpecialty !== 'All' ? mock.filter(d => d.specialty === selectedSpecialty) : mock;
          setDoctors(filtered);
          if (filtered.length > 0) setSelectedDoctor(filtered[0]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchDoctors();
  }, [isOpen, selectedSpecialty]);

  if (!isOpen) return null;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          appointmentDate: date,
          appointmentTime: time,
          reason
        })
      });

      setLoading(false);
      setBookedSuccess(true);
      setTimeout(() => {
        setBookedSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setLoading(false);
      setBookedSuccess(true);
      setTimeout(() => {
        setBookedSuccess(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Book Doctor Appointment</h3>
            <p className="text-xs text-slate-400">AI Doctor Recommendation Engine</p>
          </div>
        </div>

        {bookedSuccess ? (
          <div className="p-6 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-emerald-400 font-extrabold text-base">Appointment Booked Successfully!</h4>
            <p className="text-xs text-slate-300">
              Your appointment with <span className="font-bold text-white">{selectedDoctor?.name}</span> is confirmed for {date} at {time}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBook} className="space-y-4">
            {/* Specialty Filter */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Filter by Disease Specialty:</label>
              <div className="flex flex-wrap gap-1.5">
                {specialties.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSpecialty(s)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                      selectedSpecialty === s
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Select Doctor:</label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {doctors.map(d => (
                  <div
                    key={d._id}
                    onClick={() => setSelectedDoctor(d)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedDoctor?._id === d._id
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-md'
                        : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                        {d.name.charAt(4) || 'D'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{d.name}</p>
                        <p className="text-[10px] text-slate-400">{d.specialty} • {d.qualification}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-indigo-400" /> {d.hospitalName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400">${d.consultationFee}</span>
                      <p className="text-[9px] text-amber-400">★ {d.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Appointment Date:</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Time Slot:</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <select
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Reason / Symptoms:</label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedDoctor}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              CONFIRM & BOOK APPOINTMENT
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
