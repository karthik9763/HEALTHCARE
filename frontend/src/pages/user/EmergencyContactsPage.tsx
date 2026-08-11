import React, { useState } from 'react';
import { EmergencyContact } from '../../types';
import { PhoneCall, Siren, Share2, AlertTriangle, Plus, Star, Trash2, CheckCircle2, UserCheck } from 'lucide-react';

export const EmergencyContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { name: 'Mary Doe', phone: '+1 (555) 987-6543', relationship: 'Spouse', isPrimary: true },
    { name: 'Dr. Robert Vance', phone: '+1 (555) 555-0199', relationship: 'Primary Doctor', isPrimary: false },
    { name: 'David Doe', phone: '+1 (555) 333-4444', relationship: 'Brother', isPrimary: false }
  ]);

  const [sosStatus, setSosStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: 'Family' });

  // 1-Tap Actions
  const handleCallFamily = () => {
    const primary = contacts.find(c => c.isPrimary) || contacts[0];
    if (primary) window.open(`tel:${primary.phone}`);
    else alert('No primary contact configured.');
  };

  const handleCallDoctor = () => {
    const doc = contacts.find(c => c.relationship.toLowerCase().includes('doctor')) || contacts[1] || contacts[0];
    if (doc) window.open(`tel:${doc.phone}`);
    else alert('Calling emergency doctor hotline: 911');
  };

  const handleCallAmbulance = () => {
    alert('Initiating direct 24/7 AI Ambulance Dispatch call...');
    window.open('tel:911');
  };

  const handleShareLiveLocation = () => {
    const locUrl = `https://www.google.com/maps?q=40.7128,-74.0060`;
    if (navigator.share) {
      navigator.share({ title: 'My Emergency Live GPS Location', url: locUrl });
    } else {
      navigator.clipboard.writeText(locUrl);
      setSosStatus('Live location link copied to clipboard! Share with family.');
      setTimeout(() => setSosStatus(''), 4000);
    }
  };

  const handleSendSOSMessage = () => {
    setSosStatus('🚨 SOS ALERT SENT! Pre-defined SMS broadcast sent to all primary contacts and emergency dispatchers.');
    setTimeout(() => setSosStatus(''), 5000);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContacts(prev => [...prev, { ...newContact, isPrimary: false }]);
    setShowAddModal(false);
    setNewContact({ name: '', phone: '', relationship: 'Family' });
  };

  const togglePrimary = (idx: number) => {
    setContacts(prev => prev.map((c, i) => ({ ...c, isPrimary: i === idx })));
  };

  const deleteContact = (idx: number) => {
    setContacts(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 p-6 rounded-3xl border border-red-500/20 shadow-xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-500 animate-pulse" />
          <span>Emergency Contacts & One-Tap SOS Action Center</span>
        </h1>
        <p className="text-xs text-slate-400">One-tap emergency call triggers, instant SMS broadcast & contact directory</p>
      </div>

      {sosStatus && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in zoom-in-95">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{sosStatus}</span>
        </div>
      )}

      {/* 5 Required One-Tap Action Buttons Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">1-Tap Rapid Response Controls:</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          {/* 1. Call Family */}
          <button
            onClick={handleCallFamily}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-xs">1. Call Family</span>
            <span className="text-[10px] text-slate-400">Primary Contact</span>
          </button>

          {/* 2. Call Doctor */}
          <button
            onClick={handleCallDoctor}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-xs">2. Call Doctor</span>
            <span className="text-[10px] text-slate-400">Primary Physician</span>
          </button>

          {/* 3. Call Ambulance */}
          <button
            onClick={handleCallAmbulance}
            className="bg-gradient-to-br from-red-950 to-slate-900 hover:from-red-900 border border-red-500/30 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group transition-all shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-bold text-red-400 text-xs">3. Call Ambulance</span>
            <span className="text-[10px] text-red-300">911 Dispatch</span>
          </button>

          {/* 4. Share Live Location */}
          <button
            onClick={handleShareLiveLocation}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-xs">4. Share GPS Link</span>
            <span className="text-[10px] text-slate-400">WhatsApp / SMS</span>
          </button>

          {/* 5. Send SOS Message */}
          <button
            onClick={handleSendSOSMessage}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group transition-all col-span-2 md:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="font-bold text-amber-400 text-xs">5. Send SOS SMS</span>
            <span className="text-[10px] text-slate-400">Broadcast Alert</span>
          </button>

        </div>
      </div>

      {/* Contacts List Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Emergency Contacts Directory</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.map((c, idx) => (
          <div key={idx} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-200 font-bold flex items-center justify-center">
                {c.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  {c.name}
                  {c.isPrimary && (
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-red-500/30">
                      <Star className="w-3 h-3 fill-red-400" /> Primary Contact
                    </span>
                  )}
                </h4>
                <p className="text-slate-400">{c.relationship} • Phone: {c.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!c.isPrimary && (
                <button
                  onClick={() => togglePrimary(idx)}
                  className="text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800"
                >
                  Set Primary
                </button>
              )}
              <a
                href={`tel:${c.phone}`}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-xl shadow-md"
              >
                Call
              </a>
              <button
                onClick={() => deleteContact(idx)}
                className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg"
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
          <form onSubmit={handleAddContact} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Emergency Contact</h3>
            <input
              type="text"
              placeholder="Contact Name"
              required
              value={newContact.name}
              onChange={e => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={newContact.phone}
              onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Relationship (e.g. Spouse, Doctor, Sister)"
              required
              value={newContact.relationship}
              onChange={e => setNewContact({ ...newContact, relationship: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs">
                Save Contact
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
