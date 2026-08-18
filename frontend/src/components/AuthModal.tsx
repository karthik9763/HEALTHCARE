import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [loginRole, setLoginRole] = useState<'user' | 'admin'>('admin');

  // Form states
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [email, setEmail] = useState('john@example.com');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRoleToggle = (role: 'user' | 'admin') => {
    setLoginRole(role);
    setError(null);
    if (role === 'admin') {
      setUsername('admin');
      setPassword('Admin@123');
    } else {
      setUsername('john_doe');
      setPassword('user123');
      setEmail('john@example.com');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (tab === 'login') {
      const loginId = loginRole === 'admin' ? username : email || username;
      const res = await login(loginId, password);
      setLoading(false);
      if (!res.success) {
        setError(res.message || 'Login failed');
      } else {
        onClose();
      }
    } else if (tab === 'register') {
      const res = await register({
        name: name || username,
        username,
        email,
        password,
        phone,
        role: 'user'
      });
      setLoading(false);
      if (!res.success) {
        setError(res.message || 'Registration failed');
      } else {
        setSuccess('Registration successful! Logged in.');
        setTimeout(() => onClose(), 1500);
      }
    } else if (tab === 'forgot') {
      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
          setSuccess('Password reset link sent to your email.');
        } else {
          setError(data.message || 'Email not found.');
        }
      } catch (err: any) {
        setLoading(false);
        setError('Failed to send reset link.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-2 border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Healthcare System Portal</h2>
          <p className="text-xs text-slate-400">Secure Access for Users & Administrators</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-5 text-xs font-bold">
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition-all ${tab === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition-all ${tab === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Register
          </button>
          <button
            onClick={() => { setTab('forgot'); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition-all ${tab === 'forgot' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Forgot Password
          </button>
        </div>

        {/* Role Toggle for Login */}
        {tab === 'login' && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleRoleToggle('admin')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                loginRole === 'admin'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              👑 Admin Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('user')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                loginRole === 'user'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              👤 Patient / User Login
            </button>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {(tab === 'register' || tab === 'forgot' || (tab === 'login' && loginRole === 'user')) && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {(tab === 'login' && loginRole === 'admin') && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Admin Username</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {tab !== 'forgot' && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition-all active:scale-98 mt-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : tab === 'login' ? `Login as ${loginRole.toUpperCase()}` : tab === 'register' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {tab === 'login' && loginRole === 'admin' && (
          <div className="mt-4 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 text-center">
            <span className="font-bold text-indigo-400">Default Admin Credentials:</span> Username: <code className="text-amber-300">admin</code> | Password: <code className="text-amber-300">Admin@123</code>
          </div>
        )}
      </div>
    </div>
  );
};
