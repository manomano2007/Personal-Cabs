import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, MapPin, Clock, Languages, Map, Navigation, Send, ArrowRight, ShieldCheck, Sparkles, BadgeDollarSign, Phone, ShieldQuestion, AlertCircle, CheckCircle2, Loader2, CircleDot } from 'lucide-react';
import SmartImage from '../components/SmartImage.jsx';
import { WhatsAppIcon } from '../components/Icons.jsx';
import { CORRIDORS } from '../data/content.js';
import { SITE, telLink, whatsappLink } from '../config/site.js';
import { sendContactMessage } from '../services/api.js';
import { validateContactForm, digitsOnly } from '../utils/validators.js';

const EMPTY = { name: '', mobile: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    const v = validateContactForm(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSending(true);
    try {
      const data = await sendContactMessage({ ...form, mobile: digitsOnly(form.mobile) });
      setStatus({ type: 'ok', text: data.message });
      setForm(EMPTY);
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      setStatus({ type: 'error', text: err.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="page-top">
      <div className="container">
        <span className="chip chip--amber-soft"><i className="dot dot--amber" /> DIRECT SINGLE CHAUFFEUR ACCESS</span>
        <h1 className="h1">Contact Aravinth</h1>
        <p className="lead lead--sm">Speak directly with your chauffeur. Available for outstation trips, local rides, and airport transfers across Tamil Nadu. No call centers, no dispatch delays.</p>

        <div className="card contact-profile">
          <div className="contact-profile__who">
            <span className="contact-profile__avatar"><SmartImage src="/images/aravinth.jpg" alt="Aravinth, owner and personal chauffeur" position="center 20%" /></span>
            <div>
              <b>Aravinth <em>Owner-Driven</em></b>
              <span className="gold">Personal Chauffeur &amp; Owner</span>
              <small><Languages size={13} /> Languages: Tamil &amp; English <MapPin size={13} /> Base: {SITE.base}</small>
            </div>
          </div>
          <span className="chip chip--soft"><Clock size={14} /> Active Hours: {SITE.hours}</span>
        </div>

        <div className="contact-cards">
          <article className="card contact-card">
            <span className="icon-tile icon-tile--soft"><PhoneCall size={20} /></span>
            <small>INSTANT PHONE VOICE</small>
            <h2>{SITE.phoneDisplay}</h2>
            <p className="muted muted--sm">Call anytime between 6:00 AM – 10:00 PM for trip inquiries, urgent bookings, or route advice.</p>
            <a href={telLink} className="btn btn--dark btn--block"><Phone size={15} /> Call Now</a>
          </article>
          <article className="card contact-card">
            <span className="icon-tile icon-tile--green"><WhatsAppIcon size={22} /></span>
            <small>DIRECT MESSAGING</small>
            <h2>{SITE.phoneDisplay}</h2>
            <p className="muted muted--sm">Fastest way to share pickup location pins, date schedules, and get an honest fare estimate.</p>
            <a href={whatsappLink('Hello Aravinth, I would like to enquire about a cab.')} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--block"><WhatsAppIcon size={18} /> Chat on WhatsApp</a>
          </article>
          <article className="card contact-card">
            <span className="icon-tile icon-tile--soft"><MapPin size={20} /></span>
            <small>BASE HUB &amp; BOUNDS</small>
            <h2>Thoothukudi, TN</h2>
            <p className="muted muted--sm">Service strictly available within Tamil Nadu state boundaries. Outstation pickups across all TN districts.</p>
            <div className="notice notice--soft"><ShieldCheck size={14} /><p>Owner-operated single car service. Bookings confirmed directly by Aravinth.</p></div>
          </article>
        </div>

        <div className="contact-split">
          <div className="card coverage">
            <div className="coverage__head"><h2 className="h3 h3--lg"><Map size={18} /> Tamil Nadu Coverage</h2><span className="chip chip--small">38 Districts</span></div>
            <div className="map">
              <iframe
                title="Map of the Thoothukudi region"
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.6%2C8.4%2C78.6%2C9.2&layer=mapnik&marker=8.7642%2C78.1348"
              />
              <span className="map__pin"><CircleDot size={13} /> Base Hub: Thoothukudi</span>
            </div>
            <div className="notice notice--soft"><Navigation size={15} /><p>Base: {SITE.base} • Operational across all 38 Districts of Tamil Nadu</p></div>
            <p className="corridor-title">FREQUENTLY TRAVELED CORRIDORS:</p>
            <div className="corridors">{CORRIDORS.map((c) => <span key={c}><ArrowRight size={12} /> {c}</span>)}</div>
          </div>

          <div className="contact-right">
            <form className="card msg-form" onSubmit={onSubmit} noValidate>
              <p className="eyebrow">Direct Communication</p>
              <h2 className="h3 h3--lg">Send a Direct Message</h2>
              <p className="muted muted--sm">Inquire about date availability, custom pilgrimage packages, or family airport transfers.</p>

              {status.text && (
                <div className={`alert ${status.type === 'ok' ? 'alert--ok' : 'alert--error'}`} role="status">
                  {status.type === 'ok' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} {status.text}
                </div>
              )}

              <div className="field">
                <div className="field__label"><label htmlFor="c-name">Your Name</label></div>
                <div className="input-wrap"><input id="c-name" name="name" value={form.name} onChange={onChange} placeholder="e.g. Karthik Sundaram" maxLength={80} autoComplete="name" /></div>
                {errors.name && <p className="field__error"><AlertCircle size={13} /> {errors.name}</p>}
              </div>
              <div className="field">
                <div className="field__label"><label htmlFor="c-mobile">Phone Number</label></div>
                <div className="input-wrap"><input id="c-mobile" name="mobile" value={form.mobile} onChange={onChange} placeholder="+91 98765 43210" inputMode="tel" autoComplete="tel" maxLength={16} /></div>
                {errors.mobile && <p className="field__error"><AlertCircle size={13} /> {errors.mobile}</p>}
              </div>
              <div className="field">
                <div className="field__label"><label htmlFor="c-msg">Trip Details / Message</label></div>
                <div className="input-wrap"><textarea id="c-msg" name="message" rows={4} value={form.message} onChange={onChange} maxLength={800} placeholder="From where, destination, travel dates, passenger count, or luggage questions..." /></div>
                {errors.message && <p className="field__error"><AlertCircle size={13} /> {errors.message}</p>}
              </div>
              <button type="submit" className="btn btn--dark btn--block" disabled={sending}>
                {sending ? (<><Loader2 size={16} className="spin" /> Sending…</>) : (<><Send size={15} /> Send Message</>)}
              </button>
            </form>

            <div className="ready-box">
              <div>
                <small>DEFINITE SCHEDULE?</small>
                <h3>Ready to confirm your dates?</h3>
                <p>Lock in your journey with zero middleman commissions.</p>
              </div>
              <Link to="/book" className="btn btn--amber">Go to Booking Page</Link>
            </div>
          </div>
        </div>

        <div className="authentic">
          <ShieldQuestion size={22} className="ic-gold" />
          <div><b>100% Driver Authenticity</b><span>The driver you talk to on the phone is the exact professional chauffeur who arrives at your doorstep.</span></div>
          <div className="authentic__tags"><span><Sparkles size={14} /> Clean Vehicle</span><span><BadgeDollarSign size={14} /> Transparent Pricing</span></div>
        </div>
      </div>
    </section>
  );
}
