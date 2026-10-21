import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  History, Heart, Activity, Droplets, Thermometer, ShieldCheck,
  Calendar, Download, Clock, Filter, ArrowUpRight, CheckCircle2,
  AlertTriangle, RefreshCw
} from 'lucide-react';

interface HealthLog {
  id: string;
  timestamp: string;
  heartRate: number;
  bpSystolic: number;
  bpDiastolic: number;
  temperature: number;
  spo2: number;
  status: 'Normal' | 'Elevated' | 'Warning';
}

interface SessionLog {
  id: string;
  loginTime: string;
  logoutTime: string | null;
  device: string;
  ipAddress: string;
  status: 'Active' | 'Closed';
}

const initialHealthLogs: HealthLog[] = [
  { id: 'h1', timestamp: 'Today, 02:45 PM', heartRate: 74, bpSystolic: 120, bpDiastolic: 80, temperature: 98.6, spo2: 99, status: 'Normal' },
  { id: 'h2', timestamp: 'Today, 11:30 AM', heartRate: 88, bpSystolic: 128, bpDiastolic: 84, temperature: 98.8, spo2: 98, status: 'Normal' },
  { id: 'h3', timestamp: 'Today, 08:15 AM', heartRate: 72, bpSystolic: 118, bpDiastolic: 78, temperature: 98.4, spo2: 99, status: 'Normal' },
  { id: 'h4', timestamp: 'Yesterday, 10:20 PM', heartRate: 68, bpSystolic: 116, bpDiastolic: 76, temperature: 98.6, spo2: 99, status: 'Normal' },
  { id: 'h5', timestamp: 'Yesterday, 04:10 PM', heartRate: 95, bpSystolic: 135, bpDiastolic: 88, temperature: 99.1, spo2: 96, status: 'Elevated' },
  { id: 'h6', timestamp: 'Yesterday, 09:00 AM', heartRate: 76, bpSystolic: 122, bpDiastolic: 82, temperature: 98.6, spo2: 98, status: 'Normal' },
  { id: 'h7', timestamp: '2 days ago, 06:30 PM', heartRate: 104, bpSystolic: 142, bpDiastolic: 92, temperature: 99.4, spo2: 95, status: 'Warning' },
];

const initialSessionLogs: SessionLog[] = [
  { id: 's1', loginTime: 'Today, 08:00 AM', logoutTime: null, device: 'PulseCare Wearable v2.1', ipAddress: '192.168.1.104', status: 'Active' },
  { id: 's2', loginTime: 'Yesterday, 07:30 AM', logoutTime: 'Yesterday, 11:45 PM', device: 'Web Portal (Chrome / Windows)', ipAddress: '103.45.12.88', status: 'Closed' },
  { id: 's3', loginTime: '2 days ago, 08:15 AM', logoutTime: '2 days ago, 10:30 PM', device: 'Mobile Companion App', ipAddress: '103.45.12.88', status: 'Closed' },
  { id: 's4', loginTime: '3 days ago, 09:00 AM', logoutTime: '3 days ago, 09:45 PM', device: 'PulseCare Wearable v2.1', ipAddress: '192.168.1.104', status: 'Closed' },
];

export const HealthHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'vitals' | 'sessions'>('vitals');
  const [filter, setFilter] = useState<'all' | 'normal' | 'alert'>('all');
  const [healthLogs] = useState<HealthLog[]>(initialHealthLogs);
  const [sessionLogs] = useState<SessionLog[]>(initialSessionLogs);

  const filteredLogs = healthLogs.filter(log => {
    if (filter === 'normal') return log.status === 'Normal';
    if (filter === 'alert') return log.status !== 'Normal';
    return true;
  });

  const exportCSV = () => {
    const headers = 'Timestamp,HeartRate(BPM),BP(mmHg),Temp(F),Oxygen(%),Status\n';
    const rows = healthLogs
      .map(h => `"${h.timestamp}",${h.heartRate},"${h.bpSystolic}/${h.bpDiastolic}",${h.temperature},${h.spo2},"${h.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Health_History_${user?.name || 'User'}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Health & Session History</h1>
            <p className="text-xs text-slate-400">Continuous biometric timeline and device synchronization logs</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Avg Heart Rate</p>
            <p className="text-lg font-black text-white">76 <span className="text-xs font-normal text-slate-400">BPM</span></p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Avg Blood Pressure</p>
            <p className="text-lg font-black text-white">122/81 <span className="text-xs font-normal text-slate-400">mmHg</span></p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Avg Blood Oxygen</p>
            <p className="text-lg font-black text-white">98.2 <span className="text-xs font-normal text-slate-400">%</span></p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Body Temperature</p>
            <p className="text-lg font-black text-white">98.6 <span className="text-xs font-normal text-slate-400">°F</span></p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('vitals')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'vitals'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Health Vitals Timeline ({healthLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'sessions'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Device Usage & Sessions ({sessionLogs.length})
          </button>
        </div>

        {activeTab === 'vitals' && (
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              All Records
            </button>
            <button
              onClick={() => setFilter('normal')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filter === 'normal' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Normal
            </button>
            <button
              onClick={() => setFilter('alert')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filter === 'alert' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Alerts
            </button>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'vitals' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Timestamp</th>
                  <th className="py-3.5 px-4 font-bold">Heart Rate</th>
                  <th className="py-3.5 px-4 font-bold">Blood Pressure</th>
                  <th className="py-3.5 px-4 font-bold">Temperature</th>
                  <th className="py-3.5 px-4 font-bold">Oxygen (SpO2)</th>
                  <th className="py-3.5 px-4 font-bold">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-300 font-medium whitespace-nowrap flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 ${log.heartRate > 100 ? 'text-red-400' : 'text-slate-200'}`}>
                        <Heart className="w-3.5 h-3.5 text-red-500" />
                        {log.heartRate} <span className="text-[10px] text-slate-500 font-normal">BPM</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      <span className="text-slate-200">{log.bpSystolic}/{log.bpDiastolic}</span>
                      <span className="text-[10px] text-slate-500 font-normal ml-1">mmHg</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-300 whitespace-nowrap">
                      {log.temperature} °F
                    </td>
                    <td className="py-3 px-4 font-bold whitespace-nowrap">
                      <span className={log.spo2 < 95 ? 'text-amber-400' : 'text-emerald-400'}>
                        {log.spo2}%
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        log.status === 'Normal'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : log.status === 'Elevated'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Session Login</th>
                  <th className="py-3.5 px-4 font-bold">Session Exit</th>
                  <th className="py-3.5 px-4 font-bold">Connected Client / Device</th>
                  <th className="py-3.5 px-4 font-bold">IP Address</th>
                  <th className="py-3.5 px-4 font-bold">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sessionLogs.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-200 font-medium whitespace-nowrap">
                      {s.loginTime}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {s.logoutTime ? (
                        s.logoutTime
                      ) : (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          Active Connection
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap font-medium">
                      {s.device}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {s.ipAddress}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
