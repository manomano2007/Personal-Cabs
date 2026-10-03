import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Armchair, Compass, Settings2, Check } from 'lucide-react';
import SmartImage from '../components/SmartImage.jsx';
import Icon from '../components/Icon.jsx';
import { BookButton, CallButton, WhatsAppButton } from '../components/CtaButtons.jsx';
import { SERVICES, POPULAR_DESTINATIONS } from '../data/content.js';
import { SITE } from '../config/site.js';

export default function Services() {
  return (
    <>
      <section className="page-top">
        <div className="container">
          <span className="chip chip--small"><i className="dot dot--amber" /> Tamil Nadu Chauffeur Services</span>
          <div className="page-top__row">
            <div>
              <h1 className="h1">Cab Services Across Tamil Nadu</h1>
              <p className="lead lead--sm">Dedicated, comfortable, and personally driven journeys in a {SITE.carName}.</p>
            </div>
            <div className="badges">
              <span className="chip"><ShieldCheck size={15} /> Single Executive Chauffeur</span>
              <span className="chip"><Armchair size={15} /> Up to 6 Passengers</span>
            </div>
          </div>

          <div className="svc-detail-grid">
            {SERVICES.map((s) => (
              <article key={s.id} className="card svc-detail">
                <div className="svc-detail__media">
                  <SmartImage src={s.img} alt={s.cardTitle || s.title} />
                  <span className="img-tag img-tag--left">{s.leftTag}</span>
                  <span className="img-tag img-tag--right"><Icon name={s.rightIcon} size={12} /> {s.rightTag}</span>
                </div>
                <div className="svc-detail__body">
                  <div>
                    <h2 className="h3 h3--lg">{s.cardTitle || s.title}</h2>
                    <p className="muted">{s.text}</p>
                    <ul className="ticks">
                      {s.bullets.map(([ic, t]) => <li key={t}><Icon name={ic} size={15} /> {t}</li>)}
                    </ul>
                  </div>
                  <Link to={`/book?type=${s.type}`} className="btn btn--amber btn--block">{s.cta} <ArrowRight size={15} /></Link>
                </div>
              </article>
            ))}
          </div>

          <div className="panel">
            <div className="panel__head">
              <h2 className="h3 h3--lg"><Compass size={20} /> Popular Destinations Across Tamil Nadu</h2>
              <span className="muted muted--xs">Frequently driven pilgrim &amp; tourist routes</span>
            </div>
            <div className="chips-wrap">
              {POPULAR_DESTINATIONS.map((d) => <span key={d} className="chip chip--white">{d}</span>)}
            </div>
          </div>

          <div className="fare-note">
            <span className="icon-tile icon-tile--navy"><Settings2 size={20} /></span>
            <div>
              <h2 className="h3 h3--lg">Transparent Fare Policy</h2>
              <p>Service available within Tamil Nadu only. Fares depend on total distance, duration, toll charges, and trip type. Contact Aravinth directly for an honest, upfront quote with no hidden fees.</p>
              <ul className="inline-ticks">
                <li><Check size={12} /> No Surge Algorithm</li><li><Check size={12} /> Toll &amp; Parking Clarity</li><li><Check size={12} /> Direct Driver Quote</li>
              </ul>
            </div>
          </div>

          <div className="cta-dark">
            <div>
              <p className="eyebrow eyebrow--amber">Ready to Travel?</p>
              <h2 className="h2 h2--light">Plan Your Route Across Tamil Nadu</h2>
              <p>Speak directly with Aravinth for custom outstation itineraries and timely station pickups.</p>
            </div>
            <div className="btn-row">
              <BookButton />
              <CallButton variant="white">Call Now</CallButton>
              <WhatsAppButton>WhatsApp Aravinth</WhatsAppButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
