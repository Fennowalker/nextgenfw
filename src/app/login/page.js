'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import styles from './login.module.css';

/* ─── Demo OTP (always 123456 for any number) ─────────────── */
const DEMO_OTP = '123456';

export default function UserLoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();

  /* Steps: 'phone' | 'otp' | 'success' */
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [whatsapp, setWhatsapp] = useState(true);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const otpRefs = useRef([]);

  /* Redirect if already logged in */
  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === 'admin' ? '/admin' : '/account');
    }
  }, [user, loading, router]);

  /* Countdown timer on OTP step */
  useEffect(() => {
    if (step !== 'otp') return;
    setTimer(30);
    const id = setInterval(() => setTimer(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [step]);

  if (loading) return null;

  /* ── Step 1: Send OTP ── */
  async function handleSendOtp(e) {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    setStep('otp');
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  }

  /* ── OTP box key handler ── */
  function handleOtpKey(i, e) {
    const val = e.target.value.replace(/\D/, '');
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  /* ── Step 2: Verify OTP ── */
  async function handleVerifyOtp(e) {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 6) { setError('Please enter the complete 6-digit OTP.'); return; }
    setError('');
    setVerifying(true);
    await new Promise(r => setTimeout(r, 700));

    if (entered === DEMO_OTP) {
      const result = login(`${countryCode}${phone}@fennowalker.com`, 'User@123');
      if (result.ok) {
        setStep('success');
        setTimeout(() => router.push('/account'), 900);
      }
    } else {
      setVerifying(false);
      setError('Incorrect OTP. Try 123456 for demo.');
    }
  }

  function handleResend() {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimer(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  }

  return (
    <div className={styles.root}>
      {/* Fenno Walker top bar */}
      <header className={styles.topbar}>
        <Link href="/" className={styles.topbarLogo}>
          <span className={styles.topbarIcon}>👓</span>
          <span className={styles.topbarName}>Fenno Walker</span>
        </Link>
        <Link href="/admin/login" className={styles.adminLink}>Admin Login →</Link>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>

          {/* ── STEP: PHONE ── */}
          {step === 'phone' && (
            <>
              <div className={styles.iconCircle}>
                <span>📱</span>
              </div>
              <h1 className={styles.heading}>Enter Mobile Number</h1>
              <p className={styles.sub}>We will send an OTP to verify your account</p>

              <form onSubmit={handleSendOtp} className={styles.form}>
                <label className={styles.fieldLabel}>Mobile Number</label>
                <div className={styles.phoneRow}>
                  <select
                    className={styles.countrySelect}
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                  >
                    <option value="+91">+91 🇮🇳</option>
                    <option value="+1">+1 🇺🇸</option>
                    <option value="+44">+44 🇬🇧</option>
                    <option value="+971">+971 🇦🇪</option>
                    <option value="+65">+65 🇸🇬</option>
                  </select>
                  <input
                    type="tel"
                    className={styles.phoneInput}
                    placeholder="9560552337"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/, '').slice(0, 10))}
                    required
                    autoFocus
                    maxLength={10}
                  />
                </div>

                <label className={styles.whatsappCheck}>
                  <input
                    type="checkbox"
                    checked={whatsapp}
                    onChange={e => setWhatsapp(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.whatsappText}>
                    <span className={styles.waIcon}>✅</span>
                    Agreed to get order updates and custom offers on WhatsApp
                  </span>
                </label>

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" className={styles.ctaBtn} disabled={sending}>
                  {sending ? <span className={styles.spinner} /> : 'Continue'}
                </button>

                <p className={styles.terms}>
                  By continuing, I agree to the{' '}
                  <a href="#">Terms of Use</a> &amp; <a href="#">Privacy Policy</a>
                </p>
              </form>
            </>
          )}

          {/* ── STEP: OTP ── */}
          {step === 'otp' && (
            <>
              <div className={styles.iconCircle}>
                <span>🔐</span>
              </div>
              <h1 className={styles.heading}>Verify OTP</h1>
              <p className={styles.sub}>
                Sent to <strong>{countryCode} {phone}</strong>{' '}
                <button className={styles.changeLink} onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError(''); }}>
                  Change
                </button>
              </p>

              <form onSubmit={handleVerifyOtp} className={styles.form}>
                <label className={styles.fieldLabel}>Enter 6-digit OTP</label>
                <div className={styles.otpRow}>
                  {otp.map((v, i) => (
                    <input
                      key={i}
                      ref={el => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={v}
                      onChange={e => handleOtpKey(i, e)}
                      onKeyDown={e => handleOtpKey(i, e)}
                      className={`${styles.otpBox} ${v ? styles.otpFilled : ''}`}
                    />
                  ))}
                </div>

                <div className={styles.demoBadge}>
                  💡 Demo OTP: <strong>123456</strong>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" className={styles.ctaBtn} disabled={verifying || step === 'success'}>
                  {verifying ? <span className={styles.spinner} /> : 'Verify & Continue'}
                </button>

                <div className={styles.resendRow}>
                  {timer > 0 ? (
                    <span className={styles.timerText}>Resend OTP in <strong>{timer}s</strong></span>
                  ) : (
                    <button type="button" className={styles.resendBtn} onClick={handleResend}>
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </>
          )}

          {/* ── STEP: SUCCESS ── */}
          {step === 'success' && (
            <div className={styles.successState}>
              <div className={styles.successCheck}>✓</div>
              <h2>Login Successful!</h2>
              <p>Taking you to the store…</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
