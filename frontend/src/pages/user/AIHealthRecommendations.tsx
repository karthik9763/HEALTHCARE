import React, { useState } from 'react';
import { HeartPulse, ShieldAlert, CheckCircle, Activity, Thermometer, Droplet, Zap, AlertTriangle, UserCheck } from 'lucide-react';
import { DoctorAppointmentModal } from '../../components/DoctorAppointmentModal';

export const AIHealthRecommendations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'severity' | 'metrics'>('severity');
  const [selectedSeverity, setSelectedSeverity] = useState<'Low' | 'Mild' | 'Moderate' | 'High' | 'Critical'>('Critical');
  const [selectedMetric, setSelectedMetric] = useState<string>('High Blood Pressure');
  const [isDoctorModalOpen, setDoctorModalOpen] = useState(false);
  const [recommendedSpecialty, setRecommendedSpecialty] = useState('Cardiology');

  const handleBookDoctor = (specialty = 'General Physician') => {
    setRecommendedSpecialty(specialty);
    setDoctorModalOpen(true);
  };


  const severityAdvice = {
    Low: [
      "Drink water and stay hydrated.",
      "Take a short rest in a ventilated room.",
      "Monitor your symptoms continuously.",
      "Eat a healthy, balanced meal.",
      "Avoid heavy physical activity.",
      "Keep emergency contacts informed of your state.",
      "Recheck your vitals after 30 minutes."
    ],
    Mild: [
      "Drink warm water or herbal tea.",
      "Check your body temperature with a thermometer.",
      "Monitor your blood pressure if a cuff is available.",
      "Rest comfortably in a reclined position.",
      "Contact a nearby clinic if symptoms persist over 2 hours.",
      "Avoid driving yourself to medical centers.",
      "Share your live location with a trusted family member."
    ],
    Moderate: [
      "Contact your primary care doctor immediately.",
      "Stay seated or lie down safely.",
      "Avoid unnecessary physical movement.",
      "Prepare your medical documents & ID.",
      "Keep your smartphone charged and nearby.",
      "Inform a nearby family member or neighbor.",
      "Wait for the ambulance in an accessible ground floor location."
    ],
    High: [
      "Ambulance dispatched automatically with priority routing.",
      "Do not move or exert yourself unless absolutely necessary.",
      "Call your primary emergency contact immediately.",
      "Stay calm and follow guided first-aid instructions.",
      "Unlock your front house gate or door if safe.",
      "Keep identification, insurance, and medications ready.",
      "Wait patiently for medical professionals."
    ],
    Critical: [
      "Immediate Tier-1 emergency response activated!",
      "Nearest ICU ambulance assigned and en route.",
      "Nearest hospital emergency room pre-notified.",
      "Emergency contacts notified automatically via SMS/Call.",
      "Live GPS coordinates shared with responders.",
      "Stay with the patient at all times.",
      "Begin CPR if trained and instructed by operator.",
      "Follow emergency operator voice guidance strictly."
    ]
  };

  const metricAdvice: Record<string, string[]> = {
    "High Heart Rate": [
      "Sit down immediately in a cool area.",
      "Practice slow, deep breathing (4 seconds in, 4 seconds out).",
      "Sip room-temperature water.",
      "Avoid caffeine, tobacco, or alcohol.",
      "Seek emergency care if heart rate remains >120 BPM at rest."
    ],
    "Low Heart Rate": [
      "Rest in a comfortable, safe position.",
      "Monitor for dizziness or lightheadedness.",
      "Contact a physician if fainting or confusion occurs."
    ],
    "High Blood Pressure": [
      "Sit quietly without talking or crossing legs.",
      "Avoid stress and loud environments.",
      "Take prescribed hypertension medication if due.",
      "Contact your doctor if systolic stays above 160 mmHg."
    ],
    "Low Blood Pressure": [
      "Drink 1-2 glasses of water.",
      "Eat a light salty snack if appropriate.",
      "Lie down flat and elevate your legs on pillows.",
      "Seek medical advice if dizziness persists."
    ],
    "Low Oxygen (SpO₂)": [
      "Sit upright immediately to open air passages.",
      "Take slow, deliberate deep breaths.",
      "Use supplemental oxygen if prescribed.",
      "Call emergency services immediately if SpO₂ drops below 92%."
    ],
    "High Body Temperature": [
      "Drink cool fluids to prevent dehydration.",
      "Rest in a cool room.",
      "Apply a damp, cool compress to forehead and neck.",
      "Seek medical care if fever exceeds 39°C (102.2°F)."
    ],
    "Low Blood Sugar": [
      "Consume glucose tablets, fruit juice, or a sugary snack immediately.",
      "Recheck blood glucose after 15 minutes.",
      "Contact emergency services if patient becomes unresponsive."
    ],
    "Fall Detection": [
      "Stay still if injured; do not force movement.",
      "Press the wearable emergency button.",
      "Notify emergency contacts automatically.",
      "Wait for trained responders to assess spinal stability."
    ],
    "No Movement Detected": [
      "Automatic alert triggered to dispatch command.",
      "Call primary emergency contacts.",
      "Share real-time GPS coordinates.",
      "Dispatch ambulance if user is unresponsive to app check-in."
    ],
    "Abnormal Movement": [
      "Possible vehicle accident or collision detected.",
      "Prompt user safety verification call.",
      "Notify emergency caregiver automatically.",
      "Recommend immediate medical evaluation."
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 p-6 rounded-3xl border border-red-500/20 shadow-xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-red-500 animate-pulse" />
          <span>AI Health Recommendation Engine</span>
        </h1>
        <p className="text-xs text-slate-400">Smart AI triage advice based on emergency severity levels & real-time wearable vitals</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs w-fit">
        <button
          onClick={() => setActiveTab('severity')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'severity' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Emergency Severity Triage (5 Levels)
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'metrics' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Specific Vital Metric Guidance (10 Triggers)
        </button>
      </div>

      {/* Severity Triage View */}
      {activeTab === 'severity' && (
        <div className="space-y-6">
          
          {/* Level Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {(['Low', 'Mild', 'Moderate', 'High', 'Critical'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedSeverity(lvl)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  selectedSeverity === lvl
                    ? lvl === 'Critical' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' :
                      lvl === 'High' ? 'bg-rose-600 text-white shadow-lg' :
                      lvl === 'Moderate' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {lvl} Emergency Level
              </button>
            ))}
          </div>

          {/* Advice Cards */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white ${
                selectedSeverity === 'Critical' ? 'bg-red-600' : 'bg-amber-500'
              }`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">AI Protocol for {selectedSeverity} Severity</h3>
                <p className="text-xs text-slate-400">Step-by-step guidance recommended for patients & responders</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {severityAdvice[selectedSeverity].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Specific Metrics View */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {Object.keys(metricAdvice).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMetric(m)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedMetric === m ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">
              Recommended Protocol for: <span className="text-blue-400">{selectedMetric}</span>
            </h3>
            <div className="space-y-2.5">
              {metricAdvice[selectedMetric]?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Need a Specialist Consultation?</p>
                <p className="text-[11px] text-slate-400">Book an instant appointment with a certified doctor according to your disease category.</p>
              </div>
              <button
                onClick={() => handleBookDoctor(selectedMetric.includes('Heart') || selectedMetric.includes('Pressure') ? 'Cardiology' : 'General Physician')}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Book Doctor Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Appointment Modal */}
      <DoctorAppointmentModal
        isOpen={isDoctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        recommendedSpecialty={recommendedSpecialty}
      />

    </div>
  );
};


