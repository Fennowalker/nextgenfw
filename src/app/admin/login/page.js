'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import styles from './admin-login.module.css';

export default function AdminLoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('admin@fennowalker.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  /* Already logged-in admin → redirect */
  useEffect(() => {
    if (!loading && user?.role === 'admin') router.replace('/admin');
  }, [user, loading, router]);

  if (loading) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));

    const result = login(email, password);
    setSubmitting(false);

    if (result.ok && result.role === 'admin') {
      setSuccess(true);
      setTimeout(() => router.push('/admin'), 900);
    } else if (result.ok && result.role !== 'admin') {
      setError('This account does not have admin privileges.');
    } else {
      setError(result.error || 'Invalid admin credentials.');
    }
  }

  return (
    <div className={styles.root}>
      {/* Animated background */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.grid} />

      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandMark}>⚡</div>
          <div>
            <p className={styles.brandName}>Fenno Walker</p>
            <p className={styles.brandRole}>Admin Command Center</p>
          </div>
        </div>

        <div className={styles.divider} />

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="adm-email">Admin Email</label>
            <div className={styles.inputWrap}>
              <span className={styles.icoL}>✉️</span>
              <input
                id="adm-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@fennowalker.com"
                className={styles.input}
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="adm-pw">Password</label>
            <div className={styles.inputWrap}>
              <span className={styles.icoL}>🔒</span>
              <input
                id="adm-pw"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={styles.input}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw(v => !v)}
                tabIndex={-1}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className={styles.successBox}>
              <span>✅</span> Authenticated! Redirecting to panel…
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || success}
          >
            {submitting ? <span className={styles.spinner} /> : success ? '✅ Welcome!' : '⚡ Access Admin Panel'}
          </button>
        </form>

        <div className={styles.footer}>
          <Link href="/" className={styles.backLink}>← Back to Store</Link>
          <Link href="/login" className={styles.customerLink}>Customer Login →</Link>
        </div>
      </div>
    </div>
  );
}
