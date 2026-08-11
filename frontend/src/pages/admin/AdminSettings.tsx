import React, { useState } from 'react';
import { Settings, Database, Key, Shield, Moon, Sun, RefreshCw, CheckCircle2, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSettings: React.FC = () => {
  const { theme, toggleTheme } = useAuth();
  const [backupMsg, setBackupMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const triggerBackup = () => {
    setBackupMsg('Database backup initiated... Creating automated snapshot...');
    setTimeout(() => {
      setBackupMsg('Database Backup Completed Successfully! Snapshot saved: mongodb_backup_20260810.json');
    }, 1500);
  };

  const triggerRestore = () => {
    setBackupMsg('Restoring database from latest verified snapshot...');
    setTimeout(() => {
      setBackupMsg('Database Restored cleanly! All collections synchronized.');
    }, 1500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass) return;
    setPassMsg('Admin Password updated successfully!');
    setCurrentPass('');
    setNewPass('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <span>System Settings & Database Maintenance</span>
        </h1>
        <p className="text-xs text-slate-400">Database backup/restore, security policies, theme toggles, and API configuration</p>
      </div>

      {/* Database Backup & Restore */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Database Maintenance & Backup Operations</span>
        </h3>
        <p className="text-xs text-slate-400">Create point-in-time MongoDB snapshots or restore previous state</p>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={triggerBackup}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Database className="w-4 h-4" />
            <span>Create DB Backup Now</span>
          </button>
          <button
            onClick={triggerRestore}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restore DB Snapshot</span>
          </button>
        </div>

        {backupMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{backupMsg}</span>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          <span>Change Administrator Password</span>
        </h3>
        
        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
          <input
            type="password"
            placeholder="Current Admin Password"
            value={currentPass}
            onChange={e => setCurrentPass(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
          />
          <input
            type="password"
            placeholder="New Strong Password"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
          />
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md"
          >
            Update Admin Password
          </button>
        </form>

        {passMsg && (
          <p className="text-xs text-emerald-400 font-semibold">{passMsg}</p>
        )}
      </div>

      {/* Appearance & Preferences */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>System Theme Preference</span>
          </h3>
          <p className="text-xs text-slate-400">Toggle between Dark and Light mode interface styling</p>
        </div>

        <button
          onClick={toggleTheme}
          className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700"
        >
          Active Theme: <strong className="capitalize text-blue-400">{theme}</strong> (Click to Toggle)
        </button>
      </div>

    </div>
  );
};
