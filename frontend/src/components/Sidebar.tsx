import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, HeartPulse, AlertOctagon, FileText,
  Bell, Settings, MapPin, PhoneCall, Bot, User, Shield, Activity,
  Brain, Stethoscope, BarChart2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const adminNav = [
    { title: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
    { title: 'User Registry', path: '/admin/users', icon: Users },
    { title: 'Health Monitoring', path: '/admin/health', icon: HeartPulse },
    { title: 'Emergency Center', path: '/admin/emergencies', icon: AlertOctagon },
    { title: 'AI Predictions', path: '/admin/ai-config', icon: Brain },
    { title: 'Hospitals & Beds', path: '/admin/hospitals', icon: Stethoscope },
    { title: 'Reports & Analytics', path: '/admin/reports', icon: BarChart2 },
    { title: 'System Notifications', path: '/admin/notifications', icon: Bell },
    { title: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const userNav = [
    { title: 'My Dashboard', path: '/', icon: LayoutDashboard },
    { title: 'AI Recommendations', path: '/user/ai-recommendations', icon: HeartPulse },
    { title: 'Health & Device History', path: '/history', icon: FileText },
    { title: 'Nearby Assistance', path: '/user/nearby-assistance', icon: MapPin },
    { title: 'Emergency Contacts', path: '/user/contacts-sos', icon: PhoneCall },
    { title: 'AI Health Assistant', path: '/user/voice-assistant', icon: Bot },
    { title: 'Medical Profile & QR', path: '/user/profile', icon: User },
  ];

  const navItems = role === 'admin' ? adminNav : userNav;

  return (
    <aside className="w-64 bg-slate-900/80 border-r border-slate-800 flex flex-col justify-between min-h-[calc(100vh-65px)] p-4 shrink-0 hidden md:flex">
      <div>
        {/* Role Header Badge */}
        <div className="mb-6 px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
          {role === 'admin' ? (
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Shield className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
              <Activity className="w-4 h-4" />
            </div>
          )}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {role === 'admin' ? 'Admin Control Center' : 'My Health Portal'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {role === 'admin' ? 'AI Health Monitoring' : 'Personal Emergency Hub'}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? role === 'admin'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* AI Engine Status Footer */}
      <div className="mt-8 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[11px] font-semibold text-emerald-400">AI Risk Engine Active</span>
        </div>
        <p className="text-[10px] text-slate-500">5-Tier Risk Classification</p>
        <p className="text-[10px] text-slate-600">api:4000 • 18 Parameters</p>
      </div>
    </aside>
  );
};
