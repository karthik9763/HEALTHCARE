import React, { useState } from 'react';
import {
  FileText, Download, BarChart3, FileSpreadsheet,
  Heart, Brain, AlertOctagon, Activity, TrendingUp,
  Users, ShieldCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const reportData = [
  { id: 'HR-001', date: '2026-08-10', type: 'Daily AI Risk Summary', patients: 142, critical: 4, highRisk: 11, sosCount: 7, avgScore: 64 },
  { id: 'HR-002', date: '2026-08-09', type: 'Daily AI Risk Summary', patients: 139, critical: 5, highRisk: 13, sosCount: 9, avgScore: 61 },
  { id: 'HR-003', date: '2026-08-08', type: 'Daily AI Risk Summary', patients: 138, critical: 3, highRisk: 10, sosCount: 6, avgScore: 66 },
  { id: 'HR-004', date: '2026-08-04', type: 'Weekly Health Report', patients: 142, critical: 18, highRisk: 62, sosCount: 34, avgScore: 63 },
  { id: 'HR-005', date: '2026-07-31', type: 'Monthly Health Report', patients: 135, critical: 72, highRisk: 245, sosCount: 128, avgScore: 62 },
];

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
};

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('daily');

  const weeklyRiskData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Critical', data: [5, 6, 4, 4, 5, 4, 4], backgroundColor: 'rgba(239,68,68,0.75)', borderRadius: 6 },
      { label: 'High Risk', data: [14, 12, 11, 13, 12, 11, 11], backgroundColor: 'rgba(249,115,22,0.65)', borderRadius: 6 },
      { label: 'Moderate', data: [22, 24, 23, 22, 23, 22, 22], backgroundColor: 'rgba(245,158,11,0.55)', borderRadius: 6 },
    ],
  };

  const riskDistData = {
    labels: ['Healthy', 'Low Risk', 'Moderate', 'High Risk', 'Critical'],
    datasets: [{
      data: [67, 38, 22, 11, 4],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
      borderWidth: 0,
    }],
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('PulseCare AI — Health Analytics Report', 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Type: ${reportType.toUpperCase()}`, 14, 30);
    doc.setFontSize(10);
    let y = 42;
    doc.text('Summary Statistics:', 14, y); y += 10;
    doc.text('• Total Patients Monitored: 142', 14, y); y += 8;
    doc.text('• Critical Risk Users: 4', 14, y); y += 8;
    doc.text('• High Risk Users: 11', 14, y); y += 8;
    doc.text('• SOS Requests Today: 7', 14, y); y += 8;
    doc.text('• Average Health Score: 64/100', 14, y); y += 14;
    doc.text('Report Entries:', 14, y); y += 10;
    reportData.forEach((r, i) => {
      doc.text(`${i + 1}. [${r.date}] ${r.type} — ${r.patients} patients, ${r.critical} Critical, ${r.sosCount} SOS`, 14, y);
      y += 8;
    });
    doc.save(`PulseCare_HealthReport_${Date.now()}.pdf`);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Health Reports');
    XLSX.writeFile(workbook, `PulseCare_HealthReport_${Date.now()}.xlsx`);
  };

  const exportCSV = () => {
    const hdr = ['Report ID,Date,Type,Patients,Critical,High Risk,SOS Count,Avg Score\n'];
    const rows = reportData.map(r => `${r.id},${r.date},"${r.type}",${r.patients},${r.critical},${r.highRisk},${r.sosCount},${r.avgScore}\n`);
    const blob = new Blob([...hdr, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `PulseCare_Report_${Date.now()}.csv`; a.click();
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            AI Health Analytics & Report Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Generate, analyze, and export health risk reports — PDF, Excel, CSV</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={exportPDF} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-lg transition-all">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={exportExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-lg transition-all">
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-lg transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Users', val: 142, color: 'text-blue-400', icon: <Users className="w-4 h-4 text-blue-400" /> },
          { label: 'Avg Health Score', val: '64/100', color: 'text-indigo-400', icon: <Brain className="w-4 h-4 text-indigo-400" /> },
          { label: 'Critical Users', val: 4, color: 'text-red-400', icon: <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" /> },
          { label: 'SOS Requests', val: 7, color: 'text-amber-400', icon: <Activity className="w-4 h-4 text-amber-400" /> },
          { label: 'AI Predictions', val: 58, color: 'text-purple-400', icon: <TrendingUp className="w-4 h-4 text-purple-400" /> },
          { label: 'Healthy Users', val: 67, color: 'text-emerald-400', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-center">
            <div className="flex justify-center mb-1.5">{s.icon}</div>
            <p className={`text-xl font-extrabold ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl">
          <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" /> Weekly Risk Distribution (Last 7 Days)
          </h3>
          <div className="h-52">
            <Bar data={weeklyRiskData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl">
          <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" /> Current Risk Tier Split
          </h3>
          <div className="h-44">
            <Doughnut
              data={riskDistData}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 }, padding: 8 } } } }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
        <FileText className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-400 font-medium">Report Type:</span>
        {(['daily', 'weekly', 'monthly', 'ai-risk', 'sos'] as const).map(t => (
          <button
            key={t} onClick={() => setReportType(t)}
            className={`px-3 py-1.5 rounded-xl capitalize text-xs font-medium transition-all ${reportType === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            {t === 'ai-risk' ? 'AI Risk Report' : t === 'sos' ? 'SOS Report' : `${t} Report`}
          </button>
        ))}
      </div>

      {/* Report Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Report ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Report Type</th>
              <th className="p-4">Patients</th>
              <th className="p-4">Critical</th>
              <th className="p-4">High Risk</th>
              <th className="p-4">SOS Events</th>
              <th className="p-4">Avg Health Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {reportData.map(row => (
              <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-mono font-bold text-white">{row.id}</td>
                <td className="p-4 text-slate-300">{row.date}</td>
                <td className="p-4 font-medium text-slate-200">{row.type}</td>
                <td className="p-4 font-bold text-blue-400">{row.patients}</td>
                <td className="p-4">
                  <span className="font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-lg border border-red-500/20">{row.critical}</span>
                </td>
                <td className="p-4 font-bold text-orange-400">{row.highRisk}</td>
                <td className="p-4 font-bold text-amber-400">{row.sosCount}</td>
                <td className="p-4">
                  <span className={`font-bold ${row.avgScore >= 70 ? 'text-emerald-400' : row.avgScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {row.avgScore}/100
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
