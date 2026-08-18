import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User as UserIcon, Siren, Moon, Sun, Bell, AlertTriangle, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onOpenSOS?: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSOS, unreadCount = 2 }) => {
  const { user, role, switchRole, theme, toggleTheme, setAuthModalOpen } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);


  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            <Siren className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                PulseCare AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                EMERGENCY 24/7
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI Ambulance Dispatch & Emergency Response</p>
          </div>
        </Link>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Quick Role Switcher Pill */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-full border border-slate-700/80 text-xs">
            <button
              onClick={() => switchRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
                role === 'admin' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
            <button
              onClick={() => switchRole('user')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
                role === 'user' 
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>User Panel</span>
            </button>
          </div>

          {/* Quick SOS Trigger Button */}
          {onOpenSOS && (
            <button
              onClick={onOpenSOS}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span className="hidden md:inline uppercase tracking-wide">Instant SOS</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-bold text-[10px] flex items-center justify-center rounded-full shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <h4 className="font-semibold text-sm text-white">Notifications</h4>
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">2 Live Alerts</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <p className="font-medium text-slate-200">Ambulance AMB-101-NYC Dispatched</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">En route to Wall Street & Broadway (4 mins away)</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Just now</span>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <p className="font-medium text-amber-400">High Heart Rate Detected</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Vitals reading 118 BPM logged for John Doe</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">5 mins ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Summary & Auth Trigger */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-800">
            {user ? (
              <>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="text-left text-xs leading-tight">
                  <p className="font-semibold text-slate-200 max-w-[120px] truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 capitalize">{role} Account</p>
                </div>
              </>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md transition-all"
              >
                Sign In
              </button>
            )}
          </div>


        </div>
      </div>
    </header>
  );
};
