import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Heart, Activity, Droplets, Thermometer, Brain, Zap,
  TrendingUp, TrendingDown, AlertOctagon, ShieldCheck,
  BellRing, Clock, CheckCircle2, ChevronRight, Timer,
  Siren, QrCode, Wind, Scale, Moon, Footprints
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { RiskLevel } from '../../types';

interface UserDashboardProps {
  onOpenSOS?: () => void;
  onOpenQR?: () => void;
}

const riskGradient: Record<RiskLevel, string> = {
  Healthy:           'from-emerald-950 via-slate-900 to-slate-900',
  'Low Risk':        'from-blue-950 via-slate-900 to-slate-900',
  'Moderate Risk':   'from-amber-950 via-slate-900 to-slate-900',
  'High Risk':       'from-orange-950 via-slate-900 to-slate-900',
  Critical:          'from-red-950 via-slate-900 to-slate-900',
};

const riskBorderColor: Record<RiskLevel, string> = {
  Healthy:           'border-emerald-500/30',
  'Low Risk':        'border-blue-500/30',
  'Moderate Risk':   'border-amber-500/30',
  'High Risk':       'border-orange-500/30',
  Critical:          'border-red-500/40',
};

const riskTextColor: Record<RiskLevel, string> = {
  Healthy:           'text-emerald-400',
  'Low Risk':        'text-blue-400',
  'Moderate Risk':   'text-amber-400',
  'High Risk':       'text-orange-400',
  Critical:          'text-red-400',
};

const riskIcon: Record<RiskLevel, React.ReactNode> = {
  Healthy:           <ShieldCheck className="w-5 h-5 text-emerald-400" />,
  'Low Risk':        <TrendingUp className="w-5 h-5 text-blue-400" />,
  'Moderate Risk':   <TrendingDown className="w-5 h-5 text-amber-400" />,
  'High Risk':       <AlertOctagon className="w-5 h-5 text-orange-400" />,
  Critical:          <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />,
};

interface Vitals {
  heartRate: number;
  bpSys: number;
  bpDia: number;
  spO2: number;
  temperature: number;
  bloodSugar: number;
  weight: number;
  bmi: number;
  sleepHours: number;
  dailySteps: number;
  waterIntake: number;
  caloriesBurned: number;
  stressLevel: string;
}

// Smart Recovery Timer Component
const SmartRecoveryTimer: React.FC<{
  onCancel: () => void;
  onEscalate: () => void;
}> = ({ onCancel, onEscalate }) => {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const [normalized, setNormalized] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => {
      setSecondsLeft(p => {
        if (p <= 1) {
          clearInterval(t);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pct = (secondsLeft / 300) * 100;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const urgency = secondsLeft < 60 ? 'text-red-400' : secondsLeft < 150 ? 'text-amber-400' : 'text-emerald-400';
  const ringColor = secondsLeft < 60 ? '#ef4444' : secondsLeft < 150 ? '#f59e0b' : '#10b981';

  return (
    <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
          <Timer className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h3 className="font-extrabold text-white text-sm">Smart Recovery Monitoring</h3>
          <p className="text-[11px] text-slate-400">Vitals stabilizing — auto-cancel countdown active</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" stroke="#1e293b" strokeWidth="6" fill="none" />
              <circle
                cx="40" cy="40" r="34"
                stroke={ringColor}
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-extrabold ${urgency}`}>
                {mins}:{String(secs).padStart(2, '0')}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Time Remaining</p>
        </div>

        <div className="flex-1 ml-5 space-y-2 text-xs">
          {secondsLeft === 0 ? (
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-2.5 text-red-300 font-bold text-center">
              Timer Expired — Vitals Still Abnormal
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-amber-300">
              Monitoring: If vitals normalize before timer ends, SOS will be auto-cancelled.
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onCancel}
              className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              ✓ I'm OK — Cancel
            </button>
            <button
              onClick={onEscalate}
              className="py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
            >
              🚨 Escalate SOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserDashboard: React.FC<UserDashboardProps> = ({ onOpenSOS, onOpenQR }) => {
  const { user } = useAuth();

  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Moderate Risk');
  const [healthScore, setHealthScore] = useState(64);
  const [showRecoveryTimer, setShowRecoveryTimer] = useState(false);
  const [sosStatus, setSosStatus] = useState<'none' | 'recovery' | 'escalated' | 'cancelled'>('none');

  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 108,
    bpSys: 138,
    bpDia: 89,
    spO2: 96,
    temperature: 37.3,
    bloodSugar: 112,
    weight: 78,
    bmi: 25.8,
    sleepHours: 6.2,
    dailySteps: 4800,
    waterIntake: 1.4,
    caloriesBurned: 1680,
    stressLevel: 'Moderate',
  });

  // Simulate live vitals
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        ...prev,
        heartRate: Math.floor(Math.random() * 12) + 102,
        spO2: parseFloat((Math.random() * 1.5 + 95).toFixed(1)),
      }));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleCancelRecovery = () => {
    setSosStatus('cancelled');
    setShowRecoveryTimer(false);
    setRiskLevel('Low Risk');
    setHealthScore(72);
  };

  const handleEscalateSOS = () => {
    setSosStatus('escalated');
    setShowRecoveryTimer(false);
    onOpenSOS?.();
  };

  const triggerTestRecovery = () => {
    setShowRecoveryTimer(true);
    setSosStatus('recovery');
  };

  const statusBanner = () => {
    if (sosStatus === 'cancelled') {
      return (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-emerald-400">Vitals Normalized — SOS Auto-Cancelled</p>
            <p className="text-slate-400">Your health has stabilized. Continue monitoring.</p>
          </div>
        </div>
      );
    }
    if (sosStatus === 'escalated') {
      return (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-3 text-xs">
          <BellRing className="w-5 h-5 text-red-400 animate-bounce shrink-0" />
          <div>
            <p className="font-bold text-red-400">SOS Escalated — Emergency Services Notified</p>
            <p className="text-slate-400">Hospital & emergency contacts alerted. Stay calm.</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const vitalStatus = (val: number, low: number, high: number): { label: string; color: string } => {
    if (val < low || val > high) return { label: 'Abnormal', color: 'text-red-400' };
    if (val < low * 1.05 || val > high * 0.95) return { label: 'Borderline', color: 'text-amber-400' };
    return { label: 'Normal', color: 'text-emerald-400' };
  };

  const aiInsights = [
    { icon: '⚡', text: 'Heart rate elevated 3+ days — consider cardiologist consult', severity: 'high' },
    { icon: '💧', text: 'Water intake below optimal (1.4L/2.5L target) — increase hydration', severity: 'moderate' },
    { icon: '😴', text: 'Sleep deficit detected (6.2h avg) — aim for 7-8 hours', severity: 'moderate' },
    { icon: '🩸', text: 'Blood sugar trending upward — monitor carbohydrate intake', severity: 'high' },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome & AI Risk Banner */}
      <div className={`bg-gradient-to-r ${riskGradient[riskLevel]} p-6 rounded-3xl border ${riskBorderColor[riskLevel]} shadow-xl flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-400">AI Health Monitoring Active</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-xs text-slate-400">Continuous 18-parameter health tracking • AI risk prediction • Emergency escalation ready</p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenQR && (
            <button
              onClick={onOpenQR}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl border border-slate-700 transition-all"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>Medical QR</span>
            </button>
          )}
          {onOpenSOS && (
            <button
              onClick={onOpenSOS}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white text-xs font-extrabold px-5 py-2.5 rounded-2xl shadow-xl shadow-red-600/30 transition-transform active:scale-95"
            >
              <Siren className="w-4 h-4 animate-bounce" />
              <span>SOS EMERGENCY</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Banners */}
      {statusBanner()}

      {/* AI Risk Score Card + Smart Recovery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* AI Risk Score Panel */}
        <div className={`bg-slate-900 p-5 rounded-3xl border ${riskBorderColor[riskLevel]} shadow-xl`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {riskIcon[riskLevel]}
              <span className="font-bold text-white text-sm">AI Risk Score</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-slate-800 border-slate-700 text-slate-300">
              Live
            </span>
          </div>

          {/* Score Ring */}
          <div className="flex items-center gap-5 py-2">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
                <circle
                  cx="48" cy="48" r="40"
                  stroke={riskLevel === 'Critical' ? '#ef4444' : riskLevel === 'High Risk' ? '#f97316' : riskLevel === 'Moderate Risk' ? '#f59e0b' : riskLevel === 'Low Risk' ? '#3b82f6' : '#10b981'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - healthScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-extrabold ${riskTextColor[riskLevel]}`}>{healthScore}</span>
                <span className="text-[9px] text-slate-400">/ 100</span>
              </div>
            </div>
            <div>
              <p className={`text-lg font-extrabold ${riskTextColor[riskLevel]}`}>{riskLevel}</p>
              <p className="text-[11px] text-slate-400 mt-1">Based on 18 real-time health parameters</p>
              <button
                onClick={triggerTestRecovery}
                className="mt-2 text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition-colors font-semibold"
              >
                Simulate Recovery Mode
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800">
            <Link
              to="/user/ai-recommendations"
              className="flex items-center justify-between text-xs text-indigo-400 hover:underline font-semibold"
            >
              <span>View Full AI Health Report</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Smart Recovery Timer OR AI Insights */}
        <div className="lg:col-span-2">
          {showRecoveryTimer ? (
            <SmartRecoveryTimer
              onCancel={handleCancelRecovery}
              onEscalate={handleEscalateSOS}
            />
          ) : (
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl h-full">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                AI Health Insights & Recommendations
              </h3>
              <div className="space-y-2.5">
                {aiInsights.map((ins, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-2xl border text-xs ${
                    ins.severity === 'high'
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-amber-500/10 border-amber-500/20'
                  }`}>
                    <span className="text-base">{ins.icon}</span>
                    <p className={ins.severity === 'high' ? 'text-red-300' : 'text-amber-300'}>{ins.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800">
                <Link
                  to="/user/ai-recommendations"
                  className="flex items-center justify-between text-xs text-blue-400 hover:underline font-semibold"
                >
                  <span>Get Personalized Recommendations</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 18-Parameter Vitals Grid (Primary) */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          Live Health Metrics — 18 Parameters
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">

          {/* Heart Rate */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 col-span-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Heart className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[10px] text-slate-400 font-semibold">Heart Rate</span>
            </div>
            <p className="text-xl font-extrabold text-red-400">{vitals.heartRate}<span className="text-xs font-normal ml-0.5">bpm</span></p>
            <span className={`text-[9px] font-bold ${vitalStatus(vitals.heartRate, 60, 100).color}`}>
              {vitalStatus(vitals.heartRate, 60, 100).label}
            </span>
          </div>

          {/* Blood Pressure */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] text-slate-400 font-semibold">Blood Pressure</span>
            </div>
            <p className="text-xl font-extrabold text-blue-400">{vitals.bpSys}/{vitals.bpDia}</p>
            <span className={`text-[9px] font-bold ${vitalStatus(vitals.bpSys, 90, 120).color}`}>
              {vitals.bpSys > 130 ? 'Elevated' : 'Normal'} mmHg
            </span>
          </div>

          {/* SpO2 */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-slate-400 font-semibold">SpO₂ Oxygen</span>
            </div>
            <p className="text-xl font-extrabold text-cyan-400">{vitals.spO2}<span className="text-xs font-normal">%</span></p>
            <span className={`text-[9px] font-bold ${vitals.spO2 >= 95 ? 'text-emerald-400' : 'text-red-400'}`}>
              {vitals.spO2 >= 95 ? 'Adequate' : 'Low — Danger'}
            </span>
          </div>

          {/* Temperature */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[10px] text-slate-400 font-semibold">Temperature</span>
            </div>
            <p className="text-xl font-extrabold text-orange-400">{vitals.temperature}<span className="text-xs font-normal">°C</span></p>
            <span className={`text-[9px] font-bold ${vitals.temperature <= 37.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {vitals.temperature <= 37.5 ? 'Normal' : 'Mild Fever'}
            </span>
          </div>

          {/* Blood Sugar */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Droplets className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[10px] text-slate-400 font-semibold">Blood Sugar</span>
            </div>
            <p className="text-xl font-extrabold text-pink-400">{vitals.bloodSugar}<span className="text-xs font-normal">mg/dL</span></p>
            <span className={`text-[9px] font-bold ${vitals.bloodSugar <= 100 ? 'text-emerald-400' : vitals.bloodSugar <= 125 ? 'text-amber-400' : 'text-red-400'}`}>
              {vitals.bloodSugar <= 100 ? 'Normal' : vitals.bloodSugar <= 125 ? 'Pre-diabetic' : 'Diabetic Range'}
            </span>
          </div>

          {/* BMI */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px] text-slate-400 font-semibold">BMI</span>
            </div>
            <p className="text-xl font-extrabold text-purple-400">{vitals.bmi}</p>
            <span className={`text-[9px] font-bold ${vitals.bmi < 25 ? 'text-emerald-400' : vitals.bmi < 30 ? 'text-amber-400' : 'text-red-400'}`}>
              {vitals.bmi < 18.5 ? 'Underweight' : vitals.bmi < 25 ? 'Normal' : vitals.bmi < 30 ? 'Overweight' : 'Obese'}
            </span>
          </div>

        </div>
      </div>

      {/* Lifestyle & Activity Metrics */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Lifestyle & Activity Tracking
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] text-slate-400 font-semibold">Sleep</span>
            </div>
            <p className="text-xl font-extrabold text-indigo-400">{vitals.sleepHours}<span className="text-xs font-normal"> hrs</span></p>
            <div className="mt-1.5 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(vitals.sleepHours / 8) * 100}%` }} />
            </div>
            <span className={`text-[9px] font-bold ${vitals.sleepHours >= 7 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {vitals.sleepHours >= 7 ? 'Adequate' : 'Sleep Deficit'} (Target: 8h)
            </span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Footprints className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-slate-400 font-semibold">Daily Steps</span>
            </div>
            <p className="text-xl font-extrabold text-emerald-400">{vitals.dailySteps.toLocaleString()}</p>
            <div className="mt-1.5 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(vitals.dailySteps / 10000) * 100}%` }} />
            </div>
            <span className={`text-[9px] font-bold ${vitals.dailySteps >= 8000 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {Math.round((vitals.dailySteps / 10000) * 100)}% of 10k goal
            </span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] text-slate-400 font-semibold">Water Intake</span>
            </div>
            <p className="text-xl font-extrabold text-blue-400">{vitals.waterIntake}<span className="text-xs font-normal"> L</span></p>
            <div className="mt-1.5 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(vitals.waterIntake / 3) * 100}%` }} />
            </div>
            <span className={`text-[9px] font-bold ${vitals.waterIntake >= 2.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {Math.round((vitals.waterIntake / 3) * 100)}% of 3L daily goal
            </span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] text-slate-400 font-semibold">Calories Burned</span>
            </div>
            <p className="text-xl font-extrabold text-amber-400">{vitals.caloriesBurned.toLocaleString()}<span className="text-xs font-normal"> kcal</span></p>
            <div className="mt-1.5 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(vitals.caloriesBurned / 2500) * 100}%` }} />
            </div>
            <span className="text-[9px] font-bold text-amber-400">
              {Math.round((vitals.caloriesBurned / 2500) * 100)}% of 2500 goal
            </span>
          </div>

        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          to="/user/ai-recommendations"
          className="bg-slate-900 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center gap-3 group"
        >
          <Brain className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <div>
            <p className="text-xs font-bold text-white">AI Recommendations</p>
            <p className="text-[10px] text-slate-400">Personalized health plan</p>
          </div>
        </Link>
        <Link
          to="/user/contacts-sos"
          className="bg-slate-900 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 hover:border-red-500/40 transition-all flex items-center gap-3 group"
        >
          <Siren className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
          <div>
            <p className="text-xs font-bold text-white">Emergency Contacts</p>
            <p className="text-[10px] text-slate-400">Manage SOS contacts</p>
          </div>
        </Link>
        <Link
          to="/user/nearby-assistance"
          className="bg-slate-900 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center gap-3 group"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <div>
            <p className="text-xs font-bold text-white">Nearby Assistance</p>
            <p className="text-[10px] text-slate-400">Hospitals & clinics near you</p>
          </div>
        </Link>
        <Link
          to="/user/profile"
          className="bg-slate-900 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all flex items-center gap-3 group"
        >
          <Activity className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <div>
            <p className="text-xs font-bold text-white">Medical Profile</p>
            <p className="text-[10px] text-slate-400">View full health record</p>
          </div>
        </Link>
      </div>

    </div>
  );
};
