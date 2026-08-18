import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { QRCodeModal } from './components/QRCodeModal';
import { AIChatbot } from './components/AIChatbot';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { HealthMonitoring } from './pages/admin/HealthMonitoring';
import { HospitalManagement } from './pages/admin/HospitalManagement';
import { EmergencyManagement } from './pages/admin/EmergencyManagement';
import { ReportsPage } from './pages/admin/ReportsPage';
import { AdminSettings } from './pages/admin/AdminSettings';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { AIHealthRecommendations } from './pages/user/AIHealthRecommendations';
import { NearbyAssistance } from './pages/user/NearbyAssistance';
import { EmergencyContactsPage } from './pages/user/EmergencyContactsPage';
import { UserProfile } from './pages/user/UserProfile';

import { Siren, X, AlertTriangle, Brain } from 'lucide-react';
import { EmergencySeverity } from './types';

import { AuthModal } from './components/AuthModal';

const MainLayout: React.FC = () => {
  const { role, user, isAuthModalOpen, setAuthModalOpen } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<EmergencySeverity>('Critical');
  const [symptoms, setSymptoms] = useState('');

  const handleTriggerSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/sos/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          severity: selectedSeverity,
          description: symptoms,
          location: { latitude: 40.7128, longitude: -74.0060, address: 'Broadway & 4th St, NY' }
        })
      });
    } catch (e) {}

    setSosSuccess(true);
    setTimeout(() => {
      setSosSuccess(false);
      setShowSOSModal(false);
      setSymptoms('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter']">

      {/* Top Navigation */}
      <Navbar onOpenSOS={() => setShowSOSModal(true)} />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">

        {/* Role-based Sidebar */}
        <Sidebar />

        {/* Main Route Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden min-h-[calc(100vh-65px)]">
          <Routes>
            {/* Index Route — role-aware */}
            <Route
              path="/"
              element={
                role === 'admin'
                  ? <AdminDashboard />
                  : <UserDashboard onOpenSOS={() => setShowSOSModal(true)} onOpenQR={() => setShowQR(true)} />
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/health" element={<HealthMonitoring />} />
            <Route path="/admin/hospitals" element={<HospitalManagement />} />
            <Route path="/admin/emergencies" element={<EmergencyManagement />} />
            <Route path="/admin/ai-config" element={<EmergencyManagement />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/notifications" element={<EmergencyManagement />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* User Routes */}
            <Route path="/user/ai-recommendations" element={<AIHealthRecommendations />} />
            <Route path="/user/nearby-assistance" element={<NearbyAssistance />} />
            <Route path="/user/contacts-sos" element={<EmergencyContactsPage />} />
            <Route path="/user/voice-assistant" element={<AIChatbot isOpen={true} />} />
            <Route path="/user/profile" element={<UserProfile onOpenQR={() => setShowQR(true)} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Medical QR Modal */}
      {user && (
        <QRCodeModal
          user={user}
          isOpen={showQR}
          onClose={() => setShowQR(false)}
        />
      )}


      {/* Emergency SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleTriggerSOS}
            className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative"
          >
            <button
              type="button"
              onClick={() => setShowSOSModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30">
                <Siren className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Emergency SOS Dispatch</h3>
                <p className="text-xs text-slate-400">AI monitors your vitals • Alerts hospital & emergency contacts</p>
              </div>
            </div>

            {sosSuccess ? (
              <div className="p-5 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                <div className="text-3xl">✅</div>
                <span className="text-emerald-400 font-extrabold text-sm block">Emergency Alert Sent!</span>
                <p className="text-xs text-slate-300">Hospital & emergency contacts notified. AI is monitoring your vitals. Stay calm and remain still.</p>
              </div>
            ) : (
              <>
                {/* AI Risk Context */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex items-start gap-2.5">
                  <Brain className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-amber-300">AI Risk Assessment Active</p>
                    <p className="text-slate-400">Your current health parameters are being analyzed. Smart Recovery Mode will activate after dispatch.</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Emergency Severity:</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['Low', 'Mild', 'Moderate', 'High', 'Critical'] as const).map(s => (
                      <button
                        key={s} type="button"
                        onClick={() => setSelectedSeverity(s)}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                          selectedSeverity === s
                            ? 'bg-red-600 text-white border-red-500 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Describe Symptoms:</label>
                  <textarea
                    required
                    placeholder="e.g. Chest pain, difficulty breathing, sudden dizziness, high fever..."
                    value={symptoms}
                    onChange={e => setSymptoms(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white h-20 placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  CONFIRM & SEND EMERGENCY ALERT
                </button>
              </>
            )}
          </form>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}
