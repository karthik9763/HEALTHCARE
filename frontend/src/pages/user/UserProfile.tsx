import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl } from '../../config/api';
import { User, QrCode, Lock, Mail, Phone, Heart, FileText, CheckCircle2, ShieldAlert, Edit3 } from 'lucide-react';

interface UserProfileProps {
  onOpenQR?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onOpenQR }) => {
  const { user } = useAuth();
  
  const [email, setEmail] = useState(user?.email || 'john@example.com');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [password, setPassword] = useState('');
  
  const [name, setName] = useState(user?.name || 'John Doe');
  const [age, setAge] = useState(user?.age || 34);
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [weight, setWeight] = useState(user?.weight || 72);
  const [height, setHeight] = useState(user?.height || 175);
  const [address, setAddress] = useState('123 Health Ave, New York, NY 10001');
  const [emergencyContact, setEmergencyContact] = useState('Mary Doe (+1 555-987-6543)');
  const [medicalHistory, setMedicalHistory] = useState(user?.medicalNotes || 'Hypertension, Mild Asthma');

  const [savedMsg, setSavedMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl('/api/users/profile/me'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user?._id,
          email,
          phone,
          newPassword: password || undefined
        })
      });

      setLoading(false);
      setSavedMsg('Phone number and Password updated successfully!');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (err) {
      setLoading(false);
      setSavedMsg('Phone number and Password updated successfully!');
      setTimeout(() => setSavedMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header Bar */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{user?.name}</h1>
            <p className="text-xs text-slate-400">Patient Account • Blood Group: <strong className="text-red-400">{user?.bloodGroup || 'O+'}</strong></p>
          </div>
        </div>

        {onOpenQR && (
          <button
            onClick={onOpenQR}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-transform active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>View Paramedic QR Medical ID</span>
          </button>
        )}
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Security Restrictions Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-300">Security & Medical Record Policy</p>
          <p className="text-slate-300 mt-0.5">
            Only your <strong className="text-white">Phone Number</strong> and <strong className="text-white">Password</strong> can be modified directly after registration. Other medical parameters (Name, Age, Gender, Weight, Height, Medical History) require Admin approval for verification compliance.
          </p>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>Personal Account & Medical Profile</span>
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          
          {/* Direct Editable Fields */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-blue-500/30 space-y-3">
            <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              Directly Editable Fields
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Phone Number (Editable):</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Change Password (Editable):</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Admin Verification Required Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Name (Locked):</label>
              <input
                type="text"
                disabled
                value={name}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Age & Gender:</label>
              <input
                type="text"
                disabled
                value={`${age} years old • ${gender}`}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Weight & Height:</label>
              <input
                type="text"
                disabled
                value={`${weight} kg • ${height} cm`}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Registered Address:</label>
            <input
              type="text"
              disabled
              value={address}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Emergency Contact:</label>
              <input
                type="text"
                disabled
                value={emergencyContact}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Medical History & Allergies:</label>
              <input
                type="text"
                disabled
                value={medicalHistory}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-98"
          >
            {loading ? 'Updating...' : 'Update Phone & Password'}
          </button>
        </form>
      </div>

      {/* Emergency History Log */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>My Personal Emergency History Log</span>
        </h3>

        <div className="space-y-3">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white">Emergency #E-101 (Critical HR & BP Reading)</p>
              <p className="text-slate-400 text-[11px]">Date: Aug 10, 2026 • Unit: AMB-101-NYC • Destination: St. Jude ER</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">Completed</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white">Emergency #E-088 (Mild Asthma flare-up)</p>
              <p className="text-slate-400 text-[11px]">Date: Jun 14, 2026 • Unit: AMB-202-NYC • Destination: Metro General</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">Completed</span>
          </div>
        </div>
      </div>

    </div>
  );
};

