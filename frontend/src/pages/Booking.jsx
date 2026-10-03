import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarClock, User, Phone, Crosshair, MapPin, Flag, Calendar, Car, Send, Lock, Minus, Plus, Info, ShieldCheck, BadgeCheck, CheckCircle2, AlertCircle, Loader2, ReceiptText, Wallet, ArrowLeft } from 'lucide-react';
import SmartImage from '../components/SmartImage.jsx';
import LocationPicker from '../components/LocationPicker.jsx';
import Icon from '../components/Icon.jsx';
import { WhatsAppIcon } from '../components/Icons.jsx';
import { SITE, TRIP_TYPES, telLink, whatsappLink } from '../config/site.js';
import { createBooking } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useAdvancePayment } from '../hooks/useAdvancePayment.js';
import { validateBookingForm, digitsOnly } from '../utils/validators.js';
import { todayISO, formatDate, formatTime, formatINR } from '../utils/format.js';

const TILE_ICONS = { local: 'pin', outstation: 'map', airport: 'plane', railway: 'train' };

// Defined outside Booking so inputs keep focus while typing.
function Field({ name, label, required = true, hint, icon: I, error, children }) {
  return (
    <div className="field" data-invalid={error ? 'true' : undefined}>
      <div className="field__label">
        <label htmlFor={name}>{label} {required ? <span className="req">*</span> : <span className="opt">(Optional)</span>}</label>
        {hint && <span className="field__hint">{hint}</span>}
      </div>
      <div className={`input-wrap ${I ? 'has-icon' : ''}`}>
        {I && <I size={15} className="input-wrap__icon" />}
        {children}
      </div>
      {error && <p className="field__error" role="alert"><AlertCircle size={13} /> {error}</p>}
    </div>
  );
}

export default function Booking() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const typeFromUrl = params.get('type');
  const initialType = TRIP_TYPES.some((t) => t.value === typeFromUrl) ? typeFromUrl : 'outstation';

  const { user } = useAuth();
  const [form, setForm] = useState({
    customerName: user?.name || '', mobile: user?.mobile || '', pickupLocation: '', dropLocation: '', travelDate: '', pickupTime: '',
    passengers: 2, tripType: initialType, message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [step, setStep] = useState('form'); // 'form' -> 'summary' (advance payment)
  const [bookingId, setBookingId] = useState(''); // saved (unpaid) booking for this attempt
  const [payError, setPayError] = useState('');
  const { phase, busy, pay } = useAdvancePayment();
  const today = useMemo(() => todayISO(), []);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };
  const onChange = (e) => set(e.target.name, e.target.value);
  const stepPassengers = (d) => set('passengers', Math.min(SITE.maxPassengers, Math.max(1, form.passengers + d)));

  // Step 1: check the details, then show the booking summary with the advance payment.
  function onSubmit(e) {
    e.preventDefault();
    setServerError('');
    const v = validateBookingForm(form);
    setErrors(v);
    if (Object.keys(v).length) {
      document.querySelector('[data-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setPayError('');
    setStep('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function editDetails() {
    setBookingId(''); // details may change, so a fresh booking is saved when paying again
    setPayError('');
    setStep('form');
  }

  // Step 2: save the booking (unconfirmed), then open Razorpay for the advance.
  async function payAdvance() {
    setPayError('');
    setSubmitting(true);
    try {
      let id = bookingId;
      if (!id) {
        const payload = { ...form, mobile: digitsOnly(form.mobile), carName: SITE.carName };
        const data = await createBooking(payload);
        id = data.booking.id;
        setBookingId(id);
      }
      const result = await pay(id, { name: form.customerName, mobile: digitsOnly(form.mobile) });
      if (result.status === 'paid') {
        try { sessionStorage.setItem('lastBooking', JSON.stringify(result.booking)); } catch { /* storage unavailable */ }
        navigate('/booking-confirmation', { state: { booking: result.booking } });
        return;
      }
      const base = result.status === 'cancelled' ? 'Payment was cancelled.' : result.message;
      setPayError(`${base} Your booking is NOT confirmed yet. You can retry the ${formatINR(SITE.advanceAmount)} payment below.`);
    } catch (err) {
      if (err.fieldErrors) { setErrors(err.fieldErrors); setStep('form'); setBookingId(''); }
      setPayError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="booking-top">
        <div className="container">
          <span className="chip chip--amber-soft">வணக்கம் • PERSONAL BOOKING</span>
          <h1 className="h1">Request a Cab Booking</h1>
          <p className="lead lead--sm">Fill in your trip details below. Aravinth will review and call or WhatsApp you directly to confirm timing and tariff.</p>
          <div className="notice notice--wide">
            <Info size={18} />
            <p>Service is available strictly within <b className="gold">Tamil Nadu</b>. Direct verification and individual itinerary confirmation for every trip.</p>
          </div>
        </div>
      </section>

      <section className="section section--compact">
        <div className="container booking-grid">
          {step === 'summary' ? (
            <div className="card booking-form">
              <div className="form-head">
                <span><ReceiptText size={18} /> Booking Summary</span>
                <small>Step 2 of 2</small>
              </div>

              {payError && <div className="alert alert--error" role="alert"><AlertCircle size={18} /> {payError}</div>}

              <div className="summary summary--flat">
                <dl className="summary__grid summary__grid--flat">
                  <div><dt>Passenger Name</dt><dd className="strong">{form.customerName}</dd></div>
                  <div><dt>Mobile Contact</dt><dd className="strong">+91 {digitsOnly(form.mobile).replace(/(\d{5})(\d{5})/, '$1 $2')}</dd></div>
                  <div><dt>Pick-up Location</dt><dd><MapPin size={14} className="ic-gold" /> {form.pickupLocation}</dd></div>
                  <div><dt>Drop Location</dt><dd><Flag size={14} className="ic-green" /> {form.dropLocation}</dd></div>
                  <div><dt>Date &amp; Departure Time</dt><dd><Calendar size={14} /> {formatDate(form.travelDate)}, {formatTime(form.pickupTime)}</dd></div>
                  <div><dt>Capacity &amp; Journey Type</dt><dd className="strong">{form.passengers} {form.passengers === 1 ? 'Person' : 'Persons'} <i className="sep" /> {TRIP_TYPES.find((t) => t.value === form.tripType)?.short}</dd></div>
                </dl>
                <div className="summary__block">
                  <p className="dt">Selected Vehicle</p>
                  <div className="vehicle-line"><Car size={18} /><div><b>{SITE.carName}</b><span>Air-Conditioned • Sanitized Clean Interior • Spacious Trunk</span></div></div>
                </div>
                {form.message && (
                  <div className="summary__block">
                    <p className="dt">Special Requests / Notes</p>
                    <p className="note-box">"{form.message}"</p>
                  </div>
                )}
              </div>

              <div className="advance">
                <div className="advance__head"><Wallet size={18} /><b>Advance Payment</b></div>
                <div className="advance__row"><span>Advance Booking Amount</span><strong>{formatINR(SITE.advanceAmount)}</strong></div>
                <p className="advance__note">Advance Booking Amount: {formatINR(SITE.advanceAmount)}. Pay it securely online with Razorpay (UPI, cards, net banking or wallets) to confirm your booking. The remaining fare is settled directly with Aravinth as agreed when he confirms your trip.</p>
              </div>

              <div className="submit-area">
                <button type="button" className="btn btn--amber btn--block btn--lg" onClick={payAdvance} disabled={submitting || busy}>
                  {submitting || busy ? (
                    <><Loader2 size={18} className="spin" /> {phase === 'verifying' ? 'Confirming your booking…' : phase === 'checkout' ? 'Complete the payment…' : 'Preparing payment…'}</>
                  ) : (
                    <><Lock size={16} /> {payError ? `Retry ${formatINR(SITE.advanceAmount)} Payment` : `Pay ${formatINR(SITE.advanceAmount)} Advance & Confirm Booking`}</>
                  )}
                </button>
                <button type="button" className="btn btn--soft btn--block" onClick={editDetails} disabled={submitting || busy}><ArrowLeft size={15} /> Edit Details</button>
                <div className="notice notice--soft">
                  <Lock size={14} />
                  <p>Your booking is confirmed only after the {formatINR(SITE.advanceAmount)} payment succeeds. Payments are handled by Razorpay; your card or UPI details never touch this website.</p>
                </div>
              </div>
            </div>
          ) : (
          <form className="card booking-form" onSubmit={onSubmit} noValidate>
            <div className="form-head">
              <span><CalendarClock size={18} /> Travel Information Form</span>
              <small>Step 1 of 2</small>
            </div>

            {serverError && <div className="alert alert--error" role="alert"><AlertCircle size={18} /> {serverError}</div>}

            <Field name="customerName" error={errors.customerName} label="Customer Full Name" icon={User}>
              <input id="customerName" name="customerName" value={form.customerName} onChange={onChange} placeholder="e.g. Ramesh Kumar" autoComplete="name" maxLength={80} />
            </Field>

            <Field name="mobile" error={errors.mobile} label="Mobile Number (for Call & WhatsApp)" icon={Phone}>
              <div className="phone-row">
                <span className="phone-prefix">🇮🇳 +91</span>
                <input id="mobile" name="mobile" value={form.mobile} onChange={onChange} placeholder="98765 43210" inputMode="numeric" autoComplete="tel-national" maxLength={14} />
              </div>
            </Field>

            <Field name="pickupLocation" error={errors.pickupLocation} label="Pickup Location" icon={Crosshair}>
              <LocationPicker id="pickupLocation" name="pickupLocation" value={form.pickupLocation} onText={(v) => set('pickupLocation', v)} placeholder="Town/Street, e.g., Millerpuram, Thoothukudi" maxLength={200} currentLabel="Use my current location" />
            </Field>

            <Field name="dropLocation" error={errors.dropLocation} label="Drop Location" icon={MapPin} hint="Must be within Tamil Nadu">
              <LocationPicker id="dropLocation" name="dropLocation" value={form.dropLocation} onText={(v) => set('dropLocation', v)} placeholder="Destination, e.g., Madurai Meenakshi Temple" maxLength={200} currentLabel="Use my location" />
            </Field>

            <div className="two-col">
              <Field name="travelDate" error={errors.travelDate} label="Travel Date">
                <input id="travelDate" type="date" name="travelDate" min={today} value={form.travelDate} onChange={onChange} />
              </Field>
              <Field name="pickupTime" error={errors.pickupTime} label="Pickup Time">
                <input id="pickupTime" type="time" name="pickupTime" value={form.pickupTime} onChange={onChange} />
              </Field>
            </div>

            <div className="field">
              <div className="field__label"><label>Number of Passengers</label></div>
              <div className="stepper">
                <div><b>Passenger Count</b><small>Max {SITE.maxPassengers} passengers for comfortable travel</small></div>
                <div className="stepper__ctrl">
                  <button type="button" onClick={() => stepPassengers(-1)} disabled={form.passengers <= 1} aria-label="Decrease passenger count"><Minus size={16} /></button>
                  <output aria-live="polite">{form.passengers}</output>
                  <button type="button" onClick={() => stepPassengers(1)} disabled={form.passengers >= SITE.maxPassengers} aria-label="Increase passenger count"><Plus size={16} /></button>
                </div>
              </div>
            </div>

            <div className="field" data-invalid={errors.tripType ? 'true' : undefined}>
              <div className="field__label"><label id="trip-label">Trip Category <span className="req">*</span></label></div>
              <div className="tiles" role="radiogroup" aria-labelledby="trip-label">
                {TRIP_TYPES.map((t) => {
                  const selected = form.tripType === t.value;
                  return (
                    <button key={t.value} type="button" role="radio" aria-checked={selected} className={`tile ${selected ? 'is-selected' : ''}`} onClick={() => set('tripType', t.value)}>
                      <span className="tile__top"><Icon name={TILE_ICONS[t.value]} size={18} /><i className="radio" /></span>
                      <b>{t.label}</b>
                      <small>{t.hint}</small>
                    </button>
                  );
                })}
              </div>
              {errors.tripType && <p className="field__error" role="alert"><AlertCircle size={13} /> {errors.tripType}</p>}
            </div>

            <Field name="message" error={errors.message} label="Special Requests or Trip Notes" required={false}>
              <textarea id="message" name="message" rows={3} value={form.message} onChange={onChange} maxLength={500} placeholder="Luggage count, intermediate stops, temple darshan timings, or return journey plans..." />
            </Field>

            <div className="submit-area">
              <button type="submit" className="btn btn--amber btn--block btn--lg">
                Continue to Advance Payment <Send size={16} />
              </button>
              <div className="notice notice--soft">
                <Lock size={14} />
                <p>Next you will see your booking summary and pay a {formatINR(SITE.advanceAmount)} advance to confirm. Aravinth will then personally get in touch over call or WhatsApp about timing and fare.</p>
              </div>
            </div>
          </form>
          )}

          <aside className="booking-side">
            <div className="card side-card">
              <div className="side-card__head">
                <span className="eyebrow">Direct Driver Assurance</span>
                <span className="chip chip--small"><CheckCircle2 size={13} /> Owner-Driver</span>
              </div>
              <div className="mini-profile">
                <SmartImage src="/images/aravinth.jpg" alt="Aravinth, owner and chauffeur" className="mini-profile__img" position="center 20%" />
                <div>
                  <small className="gold">Your Driver</small>
                  <h3 className="h3 h3--lg">Aravinth</h3>
                  <span className="muted muted--sm">Owner &amp; Sole Chauffeur</span>
                  <span className="muted muted--xs"><MapPin size={12} /> Base: {SITE.base}</span>
                </div>
              </div>

              <div className="vehicle-mini">
                <div className="vehicle-mini__top"><small>Assigned Vehicle</small><small className="gold">Single-Car Integrity</small></div>
                <div className="vehicle-mini__body">
                  <SmartImage src="/images/car-mini.jpg" alt={SITE.carName} className="vehicle-mini__img" />
                  <div>
                    <b>{SITE.carName}</b>
                    <span className="muted muted--xs">Only vehicle operated • AC cabin</span>
                    <span className="mini-tags"><em>1–{SITE.maxPassengers} Seats</em><em>Luggage Room</em></span>
                  </div>
                </div>
              </div>

              <div className="talk-box">
                <div className="talk-box__top"><b>Prefer talking right now?</b><small>Direct Line</small></div>
                <p>Skip the form if your ride is immediate or within the next 4 hours. Connect with Aravinth right now:</p>
                <div className="talk-box__btns">
                  <a href={telLink} className="btn btn--white btn--sm"><Phone size={14} /> Call: {SITE.phoneDisplay}</a>
                  <a href={whatsappLink('Hello Aravinth, I would like to book a cab.')} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--sm"><WhatsAppIcon size={16} /> WhatsApp Chat</a>
                </div>
              </div>

              <div className="notice notice--soft">
                <ShieldCheck size={15} />
                <p><b>No surge pricing algorithms.</b> Direct, respectful conversation with the person driving your family across Tamil Nadu.</p>
              </div>
            </div>

            <div className="card side-list">
              <h3>Owner-Driver Code of Service</h3>
              <ul>
                {['Punctual arrival 10 minutes before requested time', 'Fresh, washed, and odor-free cabin before each trip', 'Safe hill driving experience (Kodaikanal, Nilgiris, Yercaud)', 'Zero sudden cancellation or reassignment to strangers'].map((t) => (
                  <li key={t}><BadgeCheck size={15} /> {t}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
