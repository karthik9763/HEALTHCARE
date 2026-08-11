import React, { useState, useEffect } from 'react';
import {
  Heart, Activity, Brain, AlertOctagon, ShieldCheck,
  TrendingDown, TrendingUp, Zap, Wind, Thermometer,
  Droplets, Scale, Moon, Footprints, Search, RefreshCw
} from 'lucide-react';
import { RiskLevel } from '../../types';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const riskStyle: Record<RiskLevel, { badge: string; row: string; dot: string }> = {
  Healthy:         { badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', row: 'border-l-2 border-l-emerald-500/50', dot: 'bg-emerald-500' },
  'Low Risk':      { badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', row: 'border-l-2 border-l-blue-500/50', dot: 'bg-blue-500' },
  'Moderate Risk': { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', row: 'border-l-2 border-l-amber-500/60', dot: 'bg-amber-500' },
  'High Risk':     { badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', row: 'border-l-2 border-l-orange-500/60', dot: 'bg-orange-500' },
  Critical:        { badge: 'bg-red-500/20 text-red-400 border-red-500/30', row: 'border-l-2 border-l-red-500', dot: 'bg-red-500 animate-pulse' },
};

const patients = [
  { id: 1, name: 'Ramesh Kumar', age: 52, gender: 'Male', riskLevel: 'Critical' as RiskLevel, score: 28,
    hr: 148, bp: '165/102', spo2: 91, temp: 38.4, sugar: 186, bmi: 32.6,
    sleep: 4.5, steps: 2100, water: 0.9, stress: 'High', trend: 'down',
    medications: 'Metformin, Amlodipine', lastUpdated: '2 min ago', flagged: true },
  { id: 2, name: 'Vikram Nair', age: 48, gender: 'Male', riskLevel: 'High Risk' as RiskLevel, score: 41,
    hr: 132, bp: '148/94', spo2: 94, temp: 37.8, sugar: 145, bmi: 29.2,
    sleep: 5.1, steps: 3200, water: 1.1, stress: 'High', trend: 'down',
    medications: 'Atorvastatin, Losartan', lastUpdated: '5 min ago', flagged: true },
  { id: 3, name: 'Sunita Bose', age: 45, gender: 'Female', riskLevel: 'High Risk' as RiskLevel, score: 45,
    hr: 118, bp: '142/90', spo2: 95, temp: 37.5, sugar: 138, bmi: 28.1,
    sleep: 5.8, steps: 4100, water: 1.3, stress: 'Moderate', trend: 'stable',
    medications: 'Glipizide, Ramipril', lastUpdated: '8 min ago', flagged: false },
  { id: 4, name: 'Priya Sharma', age: 34, gender: 'Female', riskLevel: 'Moderate Risk' as RiskLevel, score: 55,
    hr: 104, bp: '135/88', spo2: 96, temp: 37.1, sugar: 118, bmi: 24.8,
    sleep: 5.8, steps: 5400, water: 1.6, stress: 'Moderate', trend: 'stable',
    medications: 'Losartan 25mg', lastUpdated: '11 min ago', flagged: false },
  { id: 5, name: 'Deepak Joshi', age: 39, gender: 'Male', riskLevel: 'Moderate Risk' as RiskLevel, score: 59,
    hr: 98, bp: '128/84', spo2: 97, temp: 37.0, sugar: 108, bmi: 26.4,
    sleep: 6.5, steps: 6200, water: 1.9, stress: 'Low', trend: 'up',
    medications: 'None', lastUpdated: '14 min ago', flagged: false },
  { id: 6, name: 'Arjun Mehta', age: 28, gender: 'Male', riskLevel: 'Low Risk' as RiskLevel, score: 78,
    hr: 76, bp: '122/80', spo2: 98, temp: 36.8, sugar: 96, bmi: 22.7,
    sleep: 6.8, steps: 8200, water: 2.2, stress: 'Low', trend: 'up',
    medications: 'Salbutamol PRN', lastUpdated: '20 min ago', flagged: false },
  { id: 7, name: 'Anita Reddy', age: 41, gender: 'Female', riskLevel: 'Healthy' as RiskLevel, score: 91,
    hr: 68, bp: '115/76', spo2: 99, temp: 36.6, sugar: 88, bmi: 22.7,
    sleep: 7.8, steps: 9800, water: 2.8, stress: 'Low', trend: 'up',
    medications: 'Multivitamin', lastUpdated: '25 min ago', flagged: false },
];

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
};

export const HealthMonitoring: React.FC = () => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [liveHR, setLiveHR] = useState(patients[0].hr);

  // Simulate live HR for flagged patient
  useEffect(() => {
    const t = setInterval(() => {
      setLiveHR(Math.floor(Math.random() * 20) + 138);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === 'all' || p.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const heartRateTrend = {
    labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', 'Now'],
    datasets: [
      { label: 'Heart Rate (BPM)', data: [88, 102, 118, 132, 128, 140, liveHR], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4, borderWidth: 2 },
      { label: 'Normal Max (100)', data: [100, 100, 100, 100, 100, 100, 100], borderColor: '#10b981', borderDash: [5, 5], backgroundColor: 'transparent', borderWidth: 1, pointRadius: 0 },
    ],
  };

  const bpTrend = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
    datasets: [
      { label: 'Systolic', data: [155, 158, 162, 160, 164, 163, 165], backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 6 },
      { label: 'Diastolic', data: [96, 98, 100, 99, 102, 101, 102], backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 6 },
    ],
  };

  const vitalIcon = (val: number, low: number, high: number) =>
    val < low || val > high ? '🔴' : val < low * 1.05 || val > high * 0.95 ? '🟡' : '🟢';

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 rounded-3xl border border-purple-800/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></span>
            <span className="text-xs uppercase tracking-widest font-bold text-purple-400">18-Parameter AI Monitoring</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Health Monitoring Center</h1>
          <p className="text-xs text-slate-400">Real-time patient vitals, AI risk alerts, and trend analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400">Last refresh:</span>
            <span className="font-bold text-emerald-400 ml-2">{lastRefresh.toLocaleTimeString()}</span>
          </div>
          <button
            onClick={() => setLastRefresh(new Date())}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh All
          </button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {patients.filter(p => p.flagged).length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-4">
          <AlertOctagon className="w-6 h-6 text-red-400 animate-pulse shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-400">Critical Alert — Immediate Intervention Required</p>
            <p className="text-xs text-slate-300 mt-0.5">
              {patients.filter(p => p.flagged).map(p => p.name).join(', ')} — Vitals critically abnormal. Consider emergency escalation.
            </p>
          </div>
          <button className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
            Escalate SOS
          </button>
        </div>
      )}

      {/* Summary KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Monitored', val: patients.length, color: 'text-blue-400', icon: <Activity className="w-4 h-4 text-blue-400" /> },
          { label: 'Critical', val: patients.filter(p => p.riskLevel === 'Critical').length, color: 'text-red-400', icon: <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" /> },
          { label: 'High Risk', val: patients.filter(p => p.riskLevel === 'High Risk').length, color: 'text-orange-400', icon: <TrendingDown className="w-4 h-4 text-orange-400" /> },
          { label: 'Moderate Risk', val: patients.filter(p => p.riskLevel === 'Moderate Risk').length, color: 'text-amber-400', icon: <Brain className="w-4 h-4 text-amber-400" /> },
          { label: 'Healthy', val: patients.filter(p => p.riskLevel === 'Healthy').length, color: 'text-emerald-400', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">{s.icon}</div>
            <div>
              <p className={`text-xl font-extrabold ${s.color}`}>{s.val}</p>
              <p className="text-[10px] text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Patient List + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Patient List */}
        <div className="lg:col-span-2 space-y-3">
          {/* Search + Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search patient..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 text-xs text-white focus:outline-none">
              <option value="all">All Risks</option>
              {['Healthy', 'Low Risk', 'Moderate Risk', 'High Risk', 'Critical'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`w-full text-left bg-slate-900 hover:bg-slate-800 rounded-2xl p-4 border transition-all ${
                  selectedPatient?.id === p.id ? 'border-purple-500/60' : 'border-slate-800'
                } ${riskStyle[p.riskLevel].row}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.age}y • {p.gender}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskStyle[p.riskLevel].badge}`}>
                      {p.riskLevel}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{p.lastUpdated}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[9px]">
                  <div className="bg-slate-950 rounded-lg p-1.5 text-center">
                    <p className="text-slate-400">HR</p>
                    <p className={`font-bold ${p.hr > 100 ? 'text-red-400' : 'text-white'}`}>{p.id === 1 ? liveHR : p.hr}</p>
                  </div>
                  <div className="bg-slate-950 rounded-lg p-1.5 text-center">
                    <p className="text-slate-400">BP</p>
                    <p className="font-bold text-white">{p.bp.split('/')[0]}</p>
                  </div>
                  <div className="bg-slate-950 rounded-lg p-1.5 text-center">
                    <p className="text-slate-400">SpO₂</p>
                    <p className={`font-bold ${p.spo2 < 95 ? 'text-red-400' : 'text-white'}`}>{p.spo2}%</p>
                  </div>
                  <div className="bg-slate-950 rounded-lg p-1.5 text-center">
                    <p className="text-slate-400">Score</p>
                    <p className={`font-bold ${p.score < 50 ? 'text-red-400' : p.score < 70 ? 'text-amber-400' : 'text-emerald-400'}`}>{p.score}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {selectedPatient ? (
            <div className="space-y-4">
              {/* Patient Header */}
              <div className={`bg-slate-900 p-5 rounded-3xl border ${riskStyle[selectedPatient.riskLevel].badge.replace('text-', 'border-').split(' ')[0].replace('bg-', 'border-')} shadow-xl`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-700 text-white font-bold text-lg flex items-center justify-center">
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-extrabold text-white text-base">{selectedPatient.name}</p>
                      <p className="text-xs text-slate-400">{selectedPatient.age}y • {selectedPatient.gender} • {selectedPatient.medications}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${riskStyle[selectedPatient.riskLevel].badge}`}>
                      {selectedPatient.riskLevel}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">Health Score: <span className="font-bold text-white">{selectedPatient.score}/100</span></p>
                  </div>
                </div>

                {/* 6-Metric Vital Grid */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { label: 'Heart Rate', val: `${selectedPatient.id === 1 ? liveHR : selectedPatient.hr} bpm`, icon: <Heart className="w-3 h-3" />, alert: (selectedPatient.id === 1 ? liveHR : selectedPatient.hr) > 100 },
                    { label: 'Blood Pressure', val: selectedPatient.bp, icon: <Activity className="w-3 h-3" />, alert: parseInt(selectedPatient.bp) > 130 },
                    { label: 'SpO₂', val: `${selectedPatient.spo2}%`, icon: <Wind className="w-3 h-3" />, alert: selectedPatient.spo2 < 95 },
                    { label: 'Temp', val: `${selectedPatient.temp}°C`, icon: <Thermometer className="w-3 h-3" />, alert: selectedPatient.temp > 37.5 },
                    { label: 'Blood Sugar', val: `${selectedPatient.sugar}`, icon: <Droplets className="w-3 h-3" />, alert: selectedPatient.sugar > 126 },
                    { label: 'BMI', val: `${selectedPatient.bmi}`, icon: <Scale className="w-3 h-3" />, alert: selectedPatient.bmi > 30 },
                  ].map((m, i) => (
                    <div key={i} className={`bg-slate-950 p-2.5 rounded-xl border ${m.alert ? 'border-red-500/30' : 'border-slate-800'}`}>
                      <div className={`flex items-center gap-1 mb-1 ${m.alert ? 'text-red-400' : 'text-slate-400'}`}>
                        {m.icon}
                        <span className="text-[9px] font-semibold">{m.label}</span>
                      </div>
                      <p className={`text-sm font-extrabold ${m.alert ? 'text-red-400' : 'text-white'}`}>{m.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-red-400" /> Heart Rate Trend (Today)
                  </p>
                  <div className="h-36">
                    <Line data={heartRateTrend} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-400" /> Blood Pressure (7 Days)
                  </p>
                  <div className="h-36">
                    <Bar data={bpTrend} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Lifestyle Metrics */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Lifestyle Parameters
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Sleep', val: `${selectedPatient.sleep}h`, icon: <Moon className="w-3 h-3 text-indigo-400" />, pct: (selectedPatient.sleep / 8) * 100, color: '#818cf8', warn: selectedPatient.sleep < 6 },
                    { label: 'Steps', val: selectedPatient.steps.toLocaleString(), icon: <Footprints className="w-3 h-3 text-emerald-400" />, pct: (selectedPatient.steps / 10000) * 100, color: '#10b981', warn: selectedPatient.steps < 5000 },
                    { label: 'Water', val: `${selectedPatient.water}L`, icon: <Droplets className="w-3 h-3 text-blue-400" />, pct: (selectedPatient.water / 3) * 100, color: '#60a5fa', warn: selectedPatient.water < 2 },
                    { label: 'Stress', val: selectedPatient.stress, icon: <Brain className="w-3 h-3 text-purple-400" />, pct: selectedPatient.stress === 'High' ? 90 : selectedPatient.stress === 'Moderate' ? 55 : 20, color: '#a78bfa', warn: selectedPatient.stress === 'High' },
                  ].map((m, i) => (
                    <div key={i} className={`bg-slate-950 p-3 rounded-xl border ${m.warn ? 'border-amber-500/30' : 'border-slate-800'}`}>
                      <div className="flex items-center gap-1 mb-1.5">{m.icon}<span className="text-[10px] text-slate-400 font-semibold">{m.label}</span></div>
                      <p className={`text-sm font-extrabold ${m.warn ? 'text-amber-400' : 'text-white'} mb-1.5`}>{m.val}</p>
                      <div className="bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(m.pct, 100)}%`, backgroundColor: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                  <AlertOctagon className="w-4 h-4" /> Trigger Emergency SOS
                </button>
                <button className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Brain className="w-4 h-4" /> Start Recovery Monitoring
                </button>
                <button className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" /> Edit Health Data
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl h-96 flex flex-col items-center justify-center text-center p-8">
              <Heart className="w-12 h-12 text-slate-700 mb-4" />
              <p className="text-slate-400 font-semibold text-sm">Select a Patient</p>
              <p className="text-slate-500 text-xs mt-1">Click any patient from the list to view their detailed health metrics, trends, and AI analysis.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
