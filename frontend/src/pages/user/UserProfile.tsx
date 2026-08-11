import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, QrCode, Lock, Mail, Phone, Heart, FileText, CheckCircle2 } from 'lucide-react';

interface UserProfileProps {
  onOpenQR?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onOpenQR }) => {
  const { user } = useAuth();
  
  const [email, setEmail] = useState(user?.email || 'john@example.com');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [password, setPassword] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('Profile details updated successfully!');
    setTimeout(() => setSavedMsg(''), 4000);
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

      {/* Profile Edit Form */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>Personal Account Settings</span>
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Email Address:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Phone Number:</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Change Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
          >
            Save Profile Changes
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
              <p className="font-bold text-white">Emergency #E-101 (Critical Chest Pain)</p>
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
