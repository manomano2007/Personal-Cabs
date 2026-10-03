import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { User, Phone, Lock, AlertCircle, Loader2, BadgeCheck, ShieldCheck } from 'lucide-react';
import Brand from '../components/Brand.jsx';
import SmartImage from '../components/SmartImage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { SITE, telLink } from '../config/site.js';
import { digitsOnly } from '../utils/validators.js';

// Same field markup as the booking form so the look matches exactly.
function Field({ name, label, icon: I, error, children }) {
  return (
    <div className="field" data-invalid={error ? 'true' : undefined}>
      <div className="field__label"><label htmlFor={name}>{label} <span className="req">*</span></label></div>
      <div className="input-wrap has-icon">
        <I size={15} className="input-wrap__icon" />
        {children}
      </div>
      {error && <p className="field__error" role="alert"><AlertCircle size={13} /> {error}</p>}
    </div>
  );
}

function validate(mode, f) {
  const e = {};
  if (mode === 'signup' && f.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!/^[6-9]\d{9}$/.test(digitsOnly(f.mobile).replace(/^91(?=\d{10}$)/, ''))) e.mobile = 'Enter a valid 10-digit mobile number.';
  if (mode === 'signup') {
    if (f.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (f.confirm !== f.password) e.confirm = 'Passwords do not match.';
  } else if (!f.password) {
    e.password = 'Please enter your password.';
  }
  return e;
}

export default function Auth() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const goTo = location.state?.from && location.state.from !== '/auth' ? location.state.from : '/';

  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', mobile: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={goTo} replace />;

  const set = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((x) => ({ ...x, [e.target.name]: undefined }));
  };
  const switchMode = (m) => { setMode(m); setErrors({}); setServerError(''); };

  async function onSubmit(e) {
    e.preventDefault();
    setServerError('');
    const v = validate(mode, form);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      const mobile = digitsOnly(form.mobile).replace(/^91(?=\d{10}$)/, '');
      if (mode === 'signup') await signUp({ name: form.name.trim(), mobile, password: form.password });
      else await signIn({ mobile, password: form.password });
      navigate(goTo, { replace: true });
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const signup = mode === 'signup';

  return (
    <div className="auth-page">
      <div className="auth-bar"><Brand /></div>
      <section className="booking-top auth-hero">
        <div className="container auth-grid">
          <div className="auth-intro">
            <span className="chip chip--amber-soft">வணக்கம் • PERSONAL BOOKING</span>
            <h1 className="h1">Welcome to {SITE.brand}</h1>
            <p className="lead lead--sm">Sign in or create a free account to explore our car, destinations and services, and to book your ride directly with {SITE.driverName}.</p>
            <SmartImage src="/images/hero-xuv500.jpg" alt={SITE.carName} className="auth-intro__img" position="center 60%" />
            <ul className="auth-points">
              {['Owner-driver: you ride with the person you speak to', 'No surge pricing, honest fixed fares', 'Service across Tamil Nadu'].map((t) => (
                <li key={t}><BadgeCheck size={16} /> {t}</li>
              ))}
            </ul>
          </div>

          <form className="card booking-form auth-card" onSubmit={onSubmit} noValidate>
            <div className="lang auth-tabs" role="tablist" aria-label="Sign in or sign up">
              <button type="button" role="tab" aria-selected={!signup} className={`lang__btn ${!signup ? 'lang__btn--active' : ''}`} onClick={() => switchMode('signin')}>Sign In</button>
              <button type="button" role="tab" aria-selected={signup} className={`lang__btn ${signup ? 'lang__btn--active' : ''}`} onClick={() => switchMode('signup')}>Sign Up</button>
            </div>

            <div>
              <h2 className="h3 h3--lg">{signup ? 'Create your account' : 'Welcome back'}</h2>
              <p className="muted muted--sm">{signup ? 'It takes less than a minute.' : 'Sign in with your mobile number and password.'}</p>
            </div>

            {serverError && <div className="alert alert--error" role="alert"><AlertCircle size={18} /> {serverError}</div>}

            {signup && (
              <Field name="name" label="Full Name" icon={User} error={errors.name}>
                <input id="name" name="name" value={form.name} onChange={set} placeholder="e.g. Ramesh Kumar" autoComplete="name" maxLength={80} />
              </Field>
            )}
            <Field name="mobile" label="Mobile Number" icon={Phone} error={errors.mobile}>
              <input id="mobile" name="mobile" value={form.mobile} onChange={set} placeholder="98765 43210" inputMode="numeric" autoComplete="tel-national" maxLength={14} />
            </Field>
            <Field name="password" label="Password" icon={Lock} error={errors.password}>
              <input id="password" name="password" type="password" value={form.password} onChange={set} placeholder={signup ? 'At least 6 characters' : 'Your password'} autoComplete={signup ? 'new-password' : 'current-password'} maxLength={100} />
            </Field>
            {signup && (
              <Field name="confirm" label="Confirm Password" icon={Lock} error={errors.confirm}>
                <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={set} placeholder="Re-enter password" autoComplete="new-password" maxLength={100} />
              </Field>
            )}

            <button type="submit" className="btn btn--amber btn--block btn--lg" disabled={submitting}>
              {submitting ? (<><Loader2 size={18} className="spin" /> {signup ? 'Creating account…' : 'Signing in…'}</>) : (signup ? 'Create Account' : 'Sign In')}
            </button>

            <p className="auth-switch muted muted--sm">
              {signup ? 'Already have an account?' : 'New to Aravinth Cabs?'}{' '}
              <button type="button" className="link-arrow link-arrow--sm auth-switch__btn" onClick={() => switchMode(signup ? 'signin' : 'signup')}>{signup ? 'Sign In' : 'Create an account'}</button>
            </p>

            <div className="notice notice--soft">
              <ShieldCheck size={15} />
              <p>Your details are used only to manage your bookings. Need help signing in? Call <a href={telLink}><b>{SITE.phoneDisplay}</b></a>.</p>
            </div>
          </form>
        </div>
      </section>
      <p className="auth-foot muted muted--xs center">© {new Date().getFullYear()} {SITE.brand} • <Link to="/auth">Sign In</Link></p>
    </div>
  );
}
