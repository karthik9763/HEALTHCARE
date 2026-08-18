import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User as UserIcon, AlertCircle, ArrowRight, Activity } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');
  const [identifier, setIdentifier] = useState('john@example.com'); // email or username
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleModeSwitch = (mode: 'user' | 'admin') => {
    setLoginMode(mode);
    setError(null);
    if (mode === 'admin') {
      setIdentifier('admin');
      setPassword('Admin@123');
    } else {
      setIdentifier('john@example.com');
      setPassword('user123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setError(null);
    setLoading(true);

    const result = await login(identifier, password);
    setLoading(false);

    if (result.success) {
      if (loginMode === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">

        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30 border border-indigo-500/30">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Healthcare System Login</h1>
          <p className="text-xs text-slate-400">Continuous AI Health Monitoring & Emergency Dispatch</p>
        </div>

        {/* User vs Admin Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleModeSwitch('user')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              loginMode === 'user'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Patient / User</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('admin')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              loginMode === 'admin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator</span>
          </button>
        </div>

        {/* Inline Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-2xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              {loginMode === 'admin' ? 'Admin Username:' : 'Email Address or Username:'}
            </label>
            <div className="relative">
              {loginMode === 'admin' ? (
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              ) : (
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              )}
              <input
                type="text"
                required
                placeholder={loginMode === 'admin' ? 'admin' : 'john@example.com'}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">Password:</label>
              <button
                type="button"
                onClick={() => alert('Enter your email on the signup or password recovery screen.')}
                className="text-[11px] text-indigo-400 hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Authenticating...
              </span>
            ) : (
              <>
                <span>SIGN IN TO DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Info Box */}
        {loginMode === 'admin' ? (
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-[11px] text-purple-300 text-center">
            <span className="font-bold">Default Admin Credentials:</span><br />
            Username: <code className="text-white bg-slate-950 px-1.5 py-0.5 rounded font-mono">admin</code> • Password: <code className="text-white bg-slate-950 px-1.5 py-0.5 rounded font-mono">Admin@123</code>
          </div>
        ) : (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-[11px] text-blue-300 text-center">
            <span className="font-bold">Demo User Credentials:</span><br />
            Email: <code className="text-white bg-slate-950 px-1.5 py-0.5 rounded font-mono">john@example.com</code> • Password: <code className="text-white bg-slate-950 px-1.5 py-0.5 rounded font-mono">user123</code>
          </div>
        )}

        {/* Footer Redirect */}
        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-indigo-400 hover:underline font-bold">
            Sign Up for Free
          </Link>
        </div>

      </div>
    </div>
  );
};
