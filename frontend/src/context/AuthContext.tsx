import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  role: Role;
  token: string | null;
  theme: 'dark' | 'light';
  login: (username?: string, password?: string) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: Role) => void;
  toggleTheme: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const defaultAdminUser: User = {
  _id: 'admin_123',
  name: 'Dr. Sarah Connor',
  username: 'admin',
  email: 'admin@health.org',
  role: 'admin',
  phone: '+1 (555) 911-0001',
  bloodGroup: 'O+',
  medicalNotes: 'Chief Dispatch Administrator & Emergency Coordinator'
};

const defaultNormalUser: User = {
  _id: 'user_456',
  name: 'John Doe',
  username: 'john_doe',
  email: 'john@example.com',
  role: 'user',
  phone: '+1 (555) 234-5678',
  age: 34,
  gender: 'Male',
  bloodGroup: 'A+',
  medicalNotes: 'Hypertension history, allergic to penicillin',
  emergencyContacts: [
    { name: 'Mary Doe', phone: '+1 (555) 987-6543', relationship: 'Spouse', isPrimary: true },
    { name: 'Dr. Robert Vance', phone: '+1 (555) 555-0199', relationship: 'Doctor', isPrimary: false }
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('admin');
  const [user, setUser] = useState<User | null>(defaultAdminUser);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || 'demo_token');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const switchRole = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setUser(defaultAdminUser);
    } else {
      setUser(defaultNormalUser);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const login = async (username = 'admin', password = 'password123') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setRole(data.user.role || 'user');
      } else {
        // Fallback for offline demo mode
        if (username === 'admin') switchRole('admin');
        else switchRole('user');
      }
    } catch (e) {
      if (username === 'admin') switchRole('admin');
      else switchRole('user');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, theme, login, logout, switchRole, toggleTheme, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
