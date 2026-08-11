import React, { useEffect, useState } from 'react';
import {
  Users, AlertTriangle, CheckCircle2, Activity, AlertOctagon,
  TrendingUp, ArrowUpRight, Zap, Heart, Brain, ShieldCheck,
  TrendingDown, ClipboardList, BellRing, BarChart2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { AIRiskStats } from '../../types';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement
);

const RISK_COLORS: Record<string, string> = {
  Healthy: '#10b981',
  'Low Risk': '#3b82f6',
  'Moderate Risk': '#f59e0b',
  'High Risk': '#f97316',
  Critical: '#ef4444',
};

const riskBadge = (level: string) => {
  const map: Record<string, string> = {
    Healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Low Risk': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Moderate Risk': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'High Risk': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return map[level] || 'bg-slate-700 text-slate-300';
};

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 142,
    activeUsers: 118,
    inactiveUsers: 24,
    criticalUsers: 4,
    highRiskUsers: 11,
    moderateRiskUsers: 22,
    lowRiskUsers: 38,
    healthyUsers: 67,
    sosRequests: 7,
    hospitalAlerts: 3,
    todayReports: 14,
    weeklyReports: 89,
    monthlyReports: 312,
    aiPredictions: 58,
    auditLogs: 203,
  });

  const [aiRisk] = useState<AIRiskStats>({
    healthy: 67,
    lowRisk: 38,
    moderateRisk: 22,
    highRisk: 11,
    critical: 4,
  });

  const [recentActivity] = useState([
    { icon: '🚨', title: 'SOS Activated — Critical Alert', desc: 'Patient: Ramesh Kumar • Risk: Critical • HR: 148 BPM', time: '1 min ago', color: 'red' },
    { icon: '🤖', title: 'AI Risk Upgrade Detected', desc: 'User: Priya Sharma escalated Moderate → High Risk', time: '4 mins ago', color: 'orange' },
    { icon: '💊', title: 'Medication Alert Issued', desc: 'User: Arjun Mehta — Missed Metformin dose logged', time: '9 mins ago', color: 'amber' },
    { icon: '✅', title: 'Recovery Confirmed', desc: 'User: Anita Reddy — Vitals normalized. SOS Auto-Cancelled', time: '15 mins ago', color: 'emerald' },
    { icon: '📋', title: 'Admin Health Audit Complete', desc: 'Monthly health metrics export generated successfully', time: '22 mins ago', color: 'blue' },
  ]);

  // Week health trend data
  const weeklyHealthData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Healthy',
        data: [62, 65, 64, 67, 66, 68, 67],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.12)',
        fill: true, tension: 0.4, borderWidth: 2,
      },
      {
        label: 'At Risk (Mod+High)',
        data: [35, 32, 33, 34, 33, 33, 33],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.10)',
        fill: true, tension: 0.4, borderWidth: 2,
      },
      {
        label: 'Critical',
        data: [6, 5, 4, 3, 4, 4, 4],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.10)',
        fill: true, tension: 0.4, borderWidth: 2,
      },
    ],
  };

  // AI Risk distribution doughnut
  const riskDoughnutData = {
    labels: ['Healthy', 'Low Risk', 'Moderate Risk', 'High Risk', 'Critical'],
    datasets: [{
      data: [aiRisk.healthy, aiRisk.lowRisk, aiRisk.moderateRisk, aiRisk.highRisk, aiRisk.critical],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
      borderWidth: 0,
    }],
  };

  // Monthly SOS bar chart
  const sosBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'SOS Requests',
        data: [12, 9, 15, 11, 18, 8, 13, 7],
        backgroundColor: 'rgba(239,68,68,0.7)',
        borderRadius: 8,
      },
      {
        label: 'Hospital Alerts',
        data: [5, 4, 6, 4, 7, 3, 5, 3],
        backgroundColor: 'rgba(245,158,11,0.7)',
        borderRadius: 8,
      },
    ],
  };

  const topAtRiskPatients = [
    { name: 'Ramesh Kumar', risk: 'Critical', hr: 148, bp: '165/102', score: 28, trend: 'down' },
    { name: 'Vikram Nair', risk: 'High Risk', hr: 132, bp: '148/94', score: 41, trend: 'down' },
    { name: 'Sunita Bose', risk: 'High Risk', hr: 118, bp: '142/90', score: 45, trend: 'down' },
    { name: 'Priya Sharma', risk: 'Moderate Risk', hr: 104, bp: '135/88', score: 56, trend: 'stable' },
    { name: 'Arjun Mehta', risk: 'Moderate Risk', hr: 98, bp: '128/84', score: 60, trend: 'up' },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { size: 11 } } },
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-800/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">AI Health Monitoring — OPERATIONAL</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Admin Health Command Center</h1>
          <p className="text-xs text-slate-400">Real-time AI risk classification • 18-parameter health monitoring • Emergency escalation control</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-xs">
            <span className="text-slate-400">AI Risk Engine:</span>
            <span className="font-bold text-emerald-400 ml-2">5-Tier Active</span>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-2xl shadow-lg transition-all flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Run Full AI Scan</span>
          </button>
        </div>
      </div>

      {/* Primary User Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.totalUsers}</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +12% this month
          </span>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Users</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{stats.activeUsers}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">{stats.inactiveUsers} Inactive</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-red-500/30 shadow-md bg-gradient-to-br from-slate-900 to-red-950/20">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-xs font-semibold">Critical Users</span>
            <AlertOctagon className="w-4 h-4 animate-pulse" />
          </div>
          <p className="text-2xl font-extrabold text-red-400">{stats.criticalUsers}</p>
          <span className="text-[10px] text-red-400 font-semibold mt-1 block">Immediate Action</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-orange-500/30 shadow-md">
          <div className="flex items-center justify-between text-orange-400 mb-2">
            <span className="text-xs font-semibold">High Risk</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-extrabold text-orange-400">{stats.highRiskUsers}</p>
          <span className="text-[10px] text-orange-400 mt-1 block">Monitor Closely</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Healthy Users</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{stats.healthyUsers}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">47% of total</span>
        </div>

      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">SOS Requests</p>
            <p className="text-xl font-extrabold text-red-400 mt-0.5">{stats.sosRequests} Active</p>
          </div>
          <BellRing className="w-6 h-6 text-red-400 animate-bounce" />
        </div>
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Hospital Alerts</p>
            <p className="text-xl font-extrabold text-amber-400 mt-0.5">{stats.hospitalAlerts} Pending</p>
          </div>
          <Heart className="w-6 h-6 text-amber-400" />
        </div>
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">AI Predictions</p>
            <p className="text-xl font-extrabold text-indigo-400 mt-0.5">{stats.aiPredictions} Today</p>
          </div>
          <Brain className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Audit Logs</p>
            <p className="text-xl font-extrabold text-blue-400 mt-0.5">{stats.auditLogs} Entries</p>
          </div>
          <ClipboardList className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weekly Health Trend Line Chart */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base">AI Health Risk Trend</h3>
              <p className="text-xs text-slate-400">Weekly user risk distribution across all 5 tiers</p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium border border-slate-700">
              Last 7 Days
            </span>
          </div>
          <div className="h-64">
            <Line data={weeklyHealthData} options={chartOptions} />
          </div>
        </div>

        {/* Risk Distribution Doughnut */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col">
          <h3 className="font-bold text-white text-base mb-1">AI Risk Distribution</h3>
          <p className="text-xs text-slate-400 mb-3">Current patient risk tier breakdown</p>
          <div className="h-44 flex items-center justify-center">
            <Doughnut
              data={riskDoughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 }, padding: 10 } },
                },
              }}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1 text-[10px]">
            {Object.entries(aiRisk).map(([k, v]) => {
              const label = k === 'healthy' ? 'Healthy' : k === 'lowRisk' ? 'Low Risk' : k === 'moderateRisk' ? 'Moderate Risk' : k === 'highRisk' ? 'High Risk' : 'Critical';
              return (
                <div key={k} className="flex items-center justify-between bg-slate-950 px-2 py-1 rounded-lg">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-bold text-white">{v}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Monthly SOS + Alerts Bar Chart */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-red-400" />
              Monthly SOS & Hospital Alert Volume
            </h3>
            <p className="text-xs text-slate-400">8-month emergency escalation trends</p>
          </div>
          <div className="flex gap-2 text-[11px]">
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">Monthly View</span>
          </div>
        </div>
        <div className="h-52">
          <Bar data={sosBarData} options={chartOptions} />
        </div>
      </div>

      {/* Bottom Row: At-Risk Patients + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top At-Risk Patients Table */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            Top At-Risk Patients
          </h3>
          <div className="space-y-2">
            {topAtRiskPatients.map((p, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-bold text-xs flex items-center justify-center">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">{p.name}</p>
                    <p className="text-[10px] text-slate-400">HR: {p.hr} BPM • BP: {p.bp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskBadge(p.risk)}`}>
                    {p.risk}
                  </span>
                  <span className="text-xs font-bold text-slate-300">{p.score}</span>
                  {p.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5 text-red-400" /> :
                   p.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> :
                   <span className="w-3.5 h-3.5 text-slate-500 text-xs">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Real-time System Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => {
              const colorMap: Record<string, string> = {
                red: 'bg-red-500/20 text-red-400',
                orange: 'bg-orange-500/20 text-orange-400',
                amber: 'bg-amber-500/20 text-amber-400',
                emerald: 'bg-emerald-500/20 text-emerald-400',
                blue: 'bg-blue-500/20 text-blue-400',
              };
              return (
                <div key={i} className="flex items-start justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800/70 text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${colorMap[item.color]} flex items-center justify-center text-sm`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 ml-2">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
