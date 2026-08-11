import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { User } from '../types';
import { X, QrCode, Download, ShieldCheck, Heart, AlertCircle } from 'lucide-react';

interface QRCodeModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  const medicalRecordJSON = JSON.stringify({
    patientId: user._id,
    name: user.name,
    age: user.age || 34,
    gender: user.gender || 'Male',
    bloodGroup: user.bloodGroup || 'O+',
    allergies: 'Penicillin',
    medicalHistory: user.medicalNotes || 'Hypertension',
    emergencyContact: user.emergencyContacts?.[0]?.phone || '+1 (555) 987-6543',
    generatedAt: new Date().toISOString()
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-2 border border-red-500/30">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Paramedic Medical Pass</h3>
          <p className="text-xs text-slate-400">Scan QR Code for instant first responder medical history</p>
        </div>

        {/* QR Canvas Container */}
        <div className="bg-white p-6 rounded-2xl flex items-center justify-center shadow-inner mb-5 mx-auto max-w-[220px]">
          <QRCodeSVG
            value={medicalRecordJSON}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Medical Summary Cards */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2 mb-4">
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Patient Name:</span>
            <span className="font-bold text-white">{user.name}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Blood Type:</span>
            <span className="font-bold text-red-400 px-2 py-0.5 bg-red-500/10 rounded">{user.bloodGroup || 'O+'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Known Allergies:</span>
            <span className="font-semibold text-amber-400">Penicillin</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Primary Contact:</span>
            <span className="font-semibold text-blue-400">{user.emergencyContacts?.[0]?.phone || '+1 (555) 987-6543'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Save / Print ID</span>
          </button>
        </div>

      </div>
    </div>
  );
};
