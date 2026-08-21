'use client';
import { createContext, useContext, useState, useEffect } from 'react';

/* ─── HARDCODED CREDENTIALS ────────────────────────────────
   In a real app these would come from a backend/API.
   Admin:  admin@fennowalker.com  / Admin@123
   User:   user@fennowalker.com   / User@123
   (Any other email creates a guest user account on login)
──────────────────────────────────────────────────────────── */
const ADMIN_CREDENTIALS = {
  email: 'admin@fennowalker.com',
  password: 'Admin@123',
  name: 'Admin',
  role: 'admin',
};

const DEMO_USER = {
  email: 'user@fennowalker.com',
  password: 'User@123',
  name: 'Demo User',
  role: 'user',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);  // { name, email, role }
  const [loading, setLoading] = useState(true);

  /* Restore session from localStorage on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('fw_session');
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {}
    setLoading(false);
  }, []);

  function login(email, password) {
    const emailLc = email.trim().toLowerCase();

    if (emailLc === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const session = { name: ADMIN_CREDENTIALS.name, email: ADMIN_CREDENTIALS.email, role: 'admin' };
      localStorage.setItem('fw_session', JSON.stringify(session));
      setUser(session);
      return { ok: true, role: 'admin' };
    }

    if (emailLc === DEMO_USER.email && password === DEMO_USER.password) {
      const session = { name: DEMO_USER.name, email: DEMO_USER.email, role: 'user' };
      localStorage.setItem('fw_session', JSON.stringify(session));
      setUser(session);
      return { ok: true, role: 'user' };
    }

    /* Guest login — any other valid-looking email */
    if (emailLc.includes('@') && password.length >= 6) {
      const name = emailLc.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const session = { name, email: emailLc, role: 'user' };
      localStorage.setItem('fw_session', JSON.stringify(session));
      setUser(session);
      return { ok: true, role: 'user' };
    }

    return { ok: false, error: 'Invalid credentials. Please try again.' };
  }

  function logout() {
    localStorage.removeItem('fw_session');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
