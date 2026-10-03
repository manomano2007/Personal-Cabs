import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Calendar, Phone, Info, Quote, ShieldCheck, SprayCan, Clock, BadgeInfo } from 'lucide-react';
import SmartImage from '../components/SmartImage.jsx';
import Icon from '../components/Icon.jsx';
import { WhatsAppButton } from '../components/CtaButtons.jsx';
import { CAR_FEATURES, CAR_SPECS, CAR_GALLERY, JOURNEY_CHIPS } from '../data/content.js';
import { SITE, telLink } from '../config/site.js';

export default function OurCar() {
  const [active, setActive] = useState(0);
  const current = CAR_GALLERY[active];

  return (
    <section className="page-top">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link> <span>/</span> <b>Our Car</b></nav>
        <span className="chip chip--small"><BadgeInfo size={13} /> SINGLE DEDICATED VEHICLE</span>
        <div className="page-top__row">
          <div>
            <h1 className="h1">Our Car: {SITE.carName}</h1>
            <p className="lead lead--sm">Clean, well-maintained, and spacious 7-seater SUV dedicated exclusively to your journey.</p>
          </div>
          <span className="chip chip--white"><i className="dot" /> Bookings confirmed directly by the driver</span>
        </div>

        <div className="gallery">
          <div className="gallery__main">
            <SmartImage src={current.img} alt={current.caption} loading="eager" />
            <div className="gallery__shade" />
            <div className="gallery__cap">
              <span className="chip chip--amber-solid">OWNER MAINTAINED</span>
              <h2>{current.caption}</h2>
            </div>
          </div>
          <div className="thumbs" role="tablist" aria-label="Car photos">
            {CAR_GALLERY.map((g, i) => (
              <button key={g.label} type="button" role="tab" aria-selected={i === active} className={`thumb ${i === active ? 'is-active' : ''}`} onClick={() => setActive(i)}>
                <SmartImage src={g.img} alt={g.label} />
                <b>{i + 1}. {g.label}</b>
                <span>{g.note}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="journeys">
          <div>
            <h2 className="h3 h3--lg">Tailored for South Indian Journeys</h2>
            <p className="muted muted--sm">Ideal journey types for this single executive vehicle</p>
          </div>
          <div className="chips-wrap">
            {JOURNEY_CHIPS.map(([ic, t]) => <span key={t} className="chip chip--white"><Icon name={ic} size={14} /> {t}</span>)}
          </div>
        </div>

        <p className="eyebrow eyebrow--spaced">Chauffeur Assurance</p>
        <h2 className="h2">Every Mile Built Around Passenger Comfort</h2>
        <div className="features">
          {CAR_FEATURES.map((f) => (
            <article key={f.title} className="card feature">
              <span className="icon-tile"><Icon name={f.icon} size={20} /></span>
              <h3 className="h3">{f.title}</h3>
              <p className="muted muted--sm">{f.text}</p>
              <p className="principle__tag"><Check size={13} /> {f.tag}</p>
            </article>
          ))}
        </div>

        <div className="specs-wrap">
          <div className="card specs-card">
            <div className="specs-card__head"><h2 className="h3 h3--lg">Car Specifications</h2><span className="muted muted--xs">Model: {SITE.carName}</span></div>
            <div className="specs-card__grid">
              {CAR_SPECS.map(([k, v, d]) => (
                <div key={k} className="spec-box"><span>{k}</span><b>{v}</b><small>{d}</small></div>
              ))}
            </div>
            <div className="notice">
              <Info size={16} />
              <p><b>Owner's Direct Advice:</b> Please confirm your passenger count and total luggage bags with Aravinth during booking. When all 6 passenger seats are used, boot space is optimized for soft duffel bags and compact trolleys.</p>
            </div>
          </div>

          <aside className="owner-card">
            <div className="owner-card__top"><span className="avatar-ic avatar-ic--amber">A</span><div><b>Aravinth • Chauffeur &amp; Owner</b><span>Single Car Operator • Thoothukudi Base</span></div></div>
            <p className="owner-card__quote"><Quote size={14} /> "This XUV500 is my livelihood and my personal pride. When you book a cab with me, you are not assigned a random outsourced contractor. I personally drive, inspect the brakes, and ensure the vehicle is immaculate for your family."</p>
            <ul>
              <li><ShieldCheck size={15} /> Commercial Yellow Board with valid all-TN tax</li>
              <li><SprayCan size={15} /> Complete interior sanitization before every trip</li>
              <li><Clock size={15} /> 100% On-time guarantee at your pickup point</li>
            </ul>
            <a href={telLink} className="owner-card__phone"><small>DIRECT DRIVER CONTACT</small><b><Phone size={16} /> {SITE.phoneDisplay}</b></a>
          </aside>
        </div>

        <div className="card cta-card">
          <div>
            <h2 className="h3 h3--lg">Reserve This {SITE.carName}</h2>
            <p className="muted muted--sm">Direct owner confirmation with transparent outstation per-kilometer rates. No hidden surge charges.</p>
          </div>
          <div className="btn-row">
            <Link to="/book" className="btn btn--amber"><Calendar size={15} /> Book This Car</Link>
            <a href={telLink} className="btn btn--soft"><Phone size={15} /> Call ({SITE.phoneDisplay})</a>
            <WhatsAppButton>WhatsApp Aravinth</WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
