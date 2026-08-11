import React, { useState } from 'react';
import { User, Role, RiskLevel, StressLevel } from '../../types';
import {
  Search, Filter, Plus, Edit2, Trash2, Lock, Unlock, Shield,
  Key, Download, FileText, Heart, Activity, Brain, AlertOctagon,
  ShieldCheck, TrendingUp, X, Save, ChevronDown
} from 'lucide-react';

const riskBadgeStyle: Record<RiskLevel, string> = {
  Healthy:         'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Low Risk':      'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Moderate Risk': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'High Risk':     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Critical:        'bg-red-500/20 text-red-400 border-red-500/30',
};

const mockUsers: User[] = [
  {
    _id: '1', name: 'Ramesh Kumar', username: 'ramesh_k', email: 'ramesh@health.in', role: 'user',
    isBlocked: false, phone: '+91 98765 43210', age: 52, gender: 'Male', bloodGroup: 'B+',
    dob: '1974-03-18', healthScore: 28, riskLevel: 'Critical',
    heartRate: 148, bloodPressureSystolic: 165, bloodPressureDiastolic: 102, spO2: 91,
    temperature: 38.4, bloodSugar: 186, weight: 92, height: 168, bmi: 32.6,
    sleepHours: 4.5, caloriesBurned: 1400, dailySteps: 2100, waterIntake: 0.9, stressLevel: 'High',
    medicalNotes: 'Coronary artery disease, Type 2 Diabetes, Hypertension',
    allergies: 'Aspirin, Sulfa drugs', chronicDiseases: 'CAD, DM Type 2, HTN',
    currentMedications: 'Metformin 500mg, Amlodipine 5mg, Atorvastatin 40mg',
    createdAt: '2026-06-01'
  },
  {
    _id: '2', name: 'Priya Sharma', username: 'priya_s', email: 'priya@health.in', role: 'user',
    isBlocked: false, phone: '+91 91234 56789', age: 34, gender: 'Female', bloodGroup: 'A+',
    dob: '1992-07-22', healthScore: 55, riskLevel: 'Moderate Risk',
    heartRate: 104, bloodPressureSystolic: 135, bloodPressureDiastolic: 88, spO2: 96,
    temperature: 37.1, bloodSugar: 118, weight: 65, height: 162, bmi: 24.8,
    sleepHours: 5.8, caloriesBurned: 1850, dailySteps: 5400, waterIntake: 1.6, stressLevel: 'Moderate',
    medicalNotes: 'Mild hypertension, anxiety disorder', allergies: 'Dust mites',
    chronicDiseases: 'Mild HTN', currentMedications: 'Losartan 25mg',
    createdAt: '2026-07-10'
  },
  {
    _id: '3', name: 'Arjun Mehta', username: 'arjun_m', email: 'arjun@health.in', role: 'user',
    isBlocked: false, phone: '+91 87654 32109', age: 28, gender: 'Male', bloodGroup: 'O+',
    dob: '1998-11-05', healthScore: 78, riskLevel: 'Low Risk',
    heartRate: 76, bloodPressureSystolic: 122, bloodPressureDiastolic: 80, spO2: 98,
    temperature: 36.8, bloodSugar: 96, weight: 72, height: 178, bmi: 22.7,
    sleepHours: 6.8, caloriesBurned: 2200, dailySteps: 8200, waterIntake: 2.2, stressLevel: 'Low',
    medicalNotes: 'Mild asthma (controlled)', allergies: 'Pollen',
    chronicDiseases: 'Mild Asthma', currentMedications: 'Salbutamol inhaler PRN',
    createdAt: '2026-07-25'
  },
  {
    _id: '4', name: 'Anita Reddy', username: 'anita_r', email: 'anita@health.in', role: 'user',
    isBlocked: false, phone: '+91 99887 76655', age: 41, gender: 'Female', bloodGroup: 'AB-',
    dob: '1985-02-14', healthScore: 91, riskLevel: 'Healthy',
    heartRate: 68, bloodPressureSystolic: 115, bloodPressureDiastolic: 76, spO2: 99,
    temperature: 36.6, bloodSugar: 88, weight: 58, height: 160, bmi: 22.7,
    sleepHours: 7.8, caloriesBurned: 2400, dailySteps: 9800, waterIntake: 2.8, stressLevel: 'Low',
    medicalNotes: 'No significant medical history. Annual screening recommended.',
    allergies: 'None known', chronicDiseases: 'None', currentMedications: 'Multivitamin daily',
    createdAt: '2026-08-01'
  },
  {
    _id: '5', name: 'Dr. Sarah Connor', username: 'admin', email: 'admin@health.org', role: 'admin',
    isBlocked: false, phone: '+91 98001 00001', age: 45, gender: 'Female', bloodGroup: 'O+',
    dob: '1981-09-03', healthScore: 88, riskLevel: 'Healthy',
    heartRate: 70, bloodPressureSystolic: 118, bloodPressureDiastolic: 78, spO2: 98,
    temperature: 36.8, bloodSugar: 92, weight: 62, height: 165, bmi: 22.8,
    sleepHours: 7.2, caloriesBurned: 2100, dailySteps: 7800, waterIntake: 2.5, stressLevel: 'Moderate',
    medicalNotes: 'Chief Administrator. Routine checkups done.', allergies: 'Penicillin',
    chronicDiseases: 'None', currentMedications: 'None',
    createdAt: '2026-06-15'
  },
];

const inputCls = "w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors";
const labelCls = "text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1";

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [editingHealth, setEditingHealth] = useState<User | null>(null);
  const [healthDraft, setHealthDraft] = useState<Partial<User>>({});

  const [newUser, setNewUser] = useState({
    name: '', username: '', email: '', password: '',
    role: 'user' as Role, phone: '', bloodGroup: 'O+', age: 30, gender: 'Male',
    medicalNotes: ''
  });

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone || '').includes(searchTerm);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchRisk = riskFilter === 'all' || u.riskLevel === riskFilter;
    return matchSearch && matchRole && matchRisk;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = {
      _id: Date.now().toString(),
      ...newUser,
      isBlocked: false,
      riskLevel: 'Healthy',
      healthScore: 85,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [created, ...prev]);
    setShowAddModal(false);
    setNewUser({ name: '', username: '', email: '', password: '', role: 'user', phone: '', bloodGroup: 'O+', age: 30, gender: 'Male', medicalNotes: '' });
  };

  const openHealthEditor = (u: User) => {
    setEditingHealth(u);
    setHealthDraft({ ...u });
    setShowHealthModal(true);
  };

  const saveHealthData = () => {
    if (!editingHealth) return;
    setUsers(prev => prev.map(u => u._id === editingHealth._id ? { ...u, ...healthDraft } : u));
    setShowHealthModal(false);
    setEditingHealth(null);
  };

  const toggleBlock = (id: string) => setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
  const changeRole = (id: string, r: Role) => setUsers(prev => prev.map(u => u._id === id ? { ...u, role: r } : u));
  const deleteUser = (id: string) => { if (confirm('Delete this user?')) setUsers(prev => prev.filter(u => u._id !== id)); };

  const exportCSV = () => {
    const hdr = ['ID,Name,Email,Role,Risk Level,Health Score,Blood Group,Status\n'];
    const rows = users.map(u => `${u._id},"${u.name}",${u.email},${u.role},${u.riskLevel || 'N/A'},${u.healthScore || ''},${u.bloodGroup || ''},${u.isBlocked ? 'Blocked' : 'Active'}\n`);
    const blob = new Blob([...hdr, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `users_${Date.now()}.csv`; a.click();
  };

  const stats = {
    total: users.length,
    active: users.filter(u => !u.isBlocked).length,
    critical: users.filter(u => u.riskLevel === 'Critical').length,
    highRisk: users.filter(u => u.riskLevel === 'High Risk').length,
    healthy: users.filter(u => u.riskLevel === 'Healthy').length,
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            User & Health Data Registry
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage patient accounts, 18-parameter health profiles, risk levels & access control</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all">
            <Plus className="w-4 h-4" /> Add Patient
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Users', val: stats.total, color: 'text-blue-400' },
          { label: 'Active', val: stats.active, color: 'text-emerald-400' },
          { label: 'Critical', val: stats.critical, color: 'text-red-400' },
          { label: 'High Risk', val: stats.highRisk, color: 'text-orange-400' },
          { label: 'Healthy', val: stats.healthy, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {(['all', 'admin', 'user'] as const).map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${roleFilter === r ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <AlertOctagon className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="Healthy">Healthy</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Moderate Risk">Moderate Risk</option>
            <option value="High Risk">High Risk</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">Contact</th>
                <th className="p-4">AI Risk Level</th>
                <th className="p-4">Health Score</th>
                <th className="p-4">Key Vitals</th>
                <th className="p-4">Status</th>
                <th className="p-4">Health Record</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map(u => (
                <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-400">@{u.username} • {u.role === 'admin' ? '🛡️ Admin' : '👤 Patient'}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="text-slate-200">{u.email}</p>
                    <p className="text-[10px] text-slate-400">{u.phone}</p>
                    <p className="text-[10px] text-slate-500">{u.age}y • {u.gender} • {u.bloodGroup}</p>
                  </td>

                  <td className="p-4">
                    {u.riskLevel ? (
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${riskBadgeStyle[u.riskLevel]}`}>
                        {u.riskLevel}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">N/A</span>
                    )}
                  </td>

                  <td className="p-4">
                    {u.healthScore !== undefined ? (
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10">
                          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="15" stroke="#1e293b" strokeWidth="4" fill="none" />
                            <circle cx="20" cy="20" r="15"
                              stroke={u.healthScore >= 80 ? '#10b981' : u.healthScore >= 60 ? '#f59e0b' : u.healthScore >= 40 ? '#f97316' : '#ef4444'}
                              strokeWidth="4" fill="none"
                              strokeDasharray={`${2 * Math.PI * 15}`}
                              strokeDashoffset={`${2 * Math.PI * 15 * (1 - u.healthScore / 100)}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[9px] font-extrabold text-white">{u.healthScore}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">/ 100</span>
                      </div>
                    ) : <span className="text-slate-500 text-[10px]">—</span>}
                  </td>

                  <td className="p-4">
                    <div className="space-y-0.5 text-[10px]">
                      <p><span className="text-slate-500">HR:</span> <span className={u.heartRate && u.heartRate > 100 ? 'text-red-400 font-bold' : 'text-slate-300'}>{u.heartRate || '—'} bpm</span></p>
                      <p><span className="text-slate-500">BP:</span> <span className="text-slate-300">{u.bloodPressureSystolic}/{u.bloodPressureDiastolic} mmHg</span></p>
                      <p><span className="text-slate-500">SpO₂:</span> <span className={u.spO2 && u.spO2 < 95 ? 'text-red-400 font-bold' : 'text-slate-300'}>{u.spO2}%</span></p>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {u.isBlocked ? (
                        <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-500/30 w-fit">Blocked</span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30 w-fit">Active</span>
                      )}
                      <select
                        value={u.role}
                        onChange={e => changeRole(u._id, e.target.value as Role)}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-1.5 py-0.5 text-[10px] text-slate-300 w-fit focus:outline-none"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => openHealthEditor(u)}
                      className="flex items-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-2.5 py-1.5 rounded-xl font-semibold text-[10px] transition-colors"
                    >
                      <Heart className="w-3 h-3" /> Edit 18 Metrics
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => toggleBlock(u._id)}
                        className={`p-1.5 rounded-lg border transition-colors ${u.isBlocked ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'}`}
                        title={u.isBlocked ? 'Unblock' : 'Block'}>
                        {u.isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => alert(`Reset link sent to ${u.email}`)}
                        className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white" title="Reset Password">
                        <Key className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteUser(u._id)}
                        className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== 18-PARAMETER HEALTH EDITOR MODAL ====== */}
      {showHealthModal && editingHealth && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 max-w-3xl w-full shadow-2xl my-4">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">18-Parameter Health Data Editor</h3>
                  <p className="text-[11px] text-slate-400">Patient: {editingHealth.name} • Admin Access Only</p>
                </div>
              </div>
              <button onClick={() => setShowHealthModal(false)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Risk Override */}
            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>AI Risk Level (Override)</label>
                <select
                  value={healthDraft.riskLevel || 'Healthy'}
                  onChange={e => setHealthDraft(p => ({ ...p, riskLevel: e.target.value as RiskLevel }))}
                  className={inputCls}
                >
                  {(['Healthy', 'Low Risk', 'Moderate Risk', 'High Risk', 'Critical'] as RiskLevel[]).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Health Score (0–100)</label>
                <input type="number" min={0} max={100}
                  value={healthDraft.healthScore ?? 85}
                  onChange={e => setHealthDraft(p => ({ ...p, healthScore: +e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Vitals Section */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Cardiovascular & Respiratory
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Heart Rate (BPM)', key: 'heartRate', unit: 'bpm' },
                  { label: 'BP Systolic (mmHg)', key: 'bloodPressureSystolic', unit: '' },
                  { label: 'BP Diastolic (mmHg)', key: 'bloodPressureDiastolic', unit: '' },
                  { label: 'SpO₂ (%)', key: 'spO2', unit: '%' },
                ].map(f => (
                  <div key={f.key}>
                    <label className={labelCls}>{f.label}</label>
                    <input type="number" step="0.1"
                      value={(healthDraft as any)[f.key] ?? ''}
                      onChange={e => setHealthDraft(p => ({ ...p, [f.key]: +e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" /> Metabolic Parameters
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Temperature (°C)', key: 'temperature' },
                  { label: 'Blood Sugar (mg/dL)', key: 'bloodSugar' },
                  { label: 'Weight (kg)', key: 'weight' },
                  { label: 'Height (cm)', key: 'height' },
                  { label: 'BMI', key: 'bmi' },
                  { label: 'Calories Burned', key: 'caloriesBurned' },
                ].map(f => (
                  <div key={f.key}>
                    <label className={labelCls}>{f.label}</label>
                    <input type="number" step="0.1"
                      value={(healthDraft as any)[f.key] ?? ''}
                      onChange={e => setHealthDraft(p => ({ ...p, [f.key]: +e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Lifestyle & Activity
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Sleep Hours', key: 'sleepHours' },
                  { label: 'Daily Steps', key: 'dailySteps' },
                  { label: 'Water Intake (L)', key: 'waterIntake' },
                ].map(f => (
                  <div key={f.key}>
                    <label className={labelCls}>{f.label}</label>
                    <input type="number" step="0.1"
                      value={(healthDraft as any)[f.key] ?? ''}
                      onChange={e => setHealthDraft(p => ({ ...p, [f.key]: +e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                ))}
                <div>
                  <label className={labelCls}>Stress Level</label>
                  <select
                    value={healthDraft.stressLevel || 'Low'}
                    onChange={e => setHealthDraft(p => ({ ...p, stressLevel: e.target.value as StressLevel }))}
                    className={inputCls}
                  >
                    {['Low', 'Moderate', 'High'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Medical History & Notes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Medical Notes', key: 'medicalNotes' },
                  { label: 'Allergies', key: 'allergies' },
                  { label: 'Chronic Diseases', key: 'chronicDiseases' },
                  { label: 'Current Medications', key: 'currentMedications' },
                ].map(f => (
                  <div key={f.key}>
                    <label className={labelCls}>{f.label}</label>
                    <textarea rows={2}
                      value={(healthDraft as any)[f.key] ?? ''}
                      onChange={e => setHealthDraft(p => ({ ...p, [f.key]: e.target.value }))}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button onClick={() => setShowHealthModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors">
                Cancel
              </button>
              <button onClick={saveHealthData}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all">
                <Save className="w-4 h-4" /> Save Health Data
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create New Patient Account</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Full Name</label>
                <input type="text" required placeholder="Full Name" value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Username</label>
                <input type="text" required placeholder="username" value={newUser.username}
                  onChange={e => setNewUser({ ...newUser, username: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input type="text" placeholder="+91 XXXXX XXXXX" value={newUser.phone}
                  onChange={e => setNewUser({ ...newUser, phone: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Email</label>
                <input type="email" required placeholder="email@example.com" value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Password</label>
                <input type="password" required placeholder="••••••••" value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Role</label>
                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })} className={inputCls}>
                  <option value="user">Patient (User)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Blood Group</label>
                <select value={newUser.bloodGroup} onChange={e => setNewUser({ ...newUser, bloodGroup: e.target.value })} className={inputCls}>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Age</label>
                <input type="number" min={1} max={120} value={newUser.age}
                  onChange={e => setNewUser({ ...newUser, age: +e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Gender</label>
                <select value={newUser.gender} onChange={e => setNewUser({ ...newUser, gender: e.target.value })} className={inputCls}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Medical Notes</label>
                <textarea rows={2} placeholder="Initial medical history, allergies, conditions..."
                  value={newUser.medicalNotes}
                  onChange={e => setNewUser({ ...newUser, medicalNotes: e.target.value })}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium">
                Cancel
              </button>
              <button type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg">
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
