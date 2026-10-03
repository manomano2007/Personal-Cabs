import { Link } from 'react-router-dom';
import { BadgeCheck, MapPin, Compass, Languages, Phone, Quote, Tag, Briefcase } from 'lucide-react';
import SmartImage from '../components/SmartImage.jsx';
import Icon from '../components/Icon.jsx';
import { BookButton, WhatsAppButton } from '../components/CtaButtons.jsx';
import { PRINCIPLES } from '../data/content.js';
import { SITE, telLink } from '../config/site.js';

export default function About() {
  return (
    <>
      <section className="page-top">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link> <span>/</span> <b>About Aravinth</b></nav>
          <div className="page-top__row">
            <div>
              <p className="eyebrow">Verified Owner Chauffeur</p>
              <h1 className="h1">About Your Driver</h1>
            </div>
            <span className="chip chip--white"><i className="dot" /> Independent Single-Vehicle Chauffeur</span>
          </div>

          <div className="about-grid">
            <div className="about-photo-col">
              <div className="about-photo">
                <SmartImage src="/images/aravinth.jpg" alt="Aravinth, professional private chauffeur in Tamil Nadu" position="center 20%" />
                <div className="about-photo__cap"><b>Aravinth</b><span>Owner &amp; Chauffeur • Aravinth Cabs</span></div>
              </div>
              <div className="card strip">
                <span className="icon-tile icon-tile--amber"><BadgeCheck size={20} /></span>
                <div><b>100% Direct Responsibility</b><span className="muted muted--sm">No third-party aggregators or substitute drivers</span></div>
              </div>
            </div>

            <div className="card about-bio">
              <span className="chip chip--amber"><Compass size={12} /> Warm Tamil Nadu Hospitality</span>
              <h2 className="h2">வணக்கம், I am Aravinth.</h2>
              <p>I run a dedicated personal cab service based out of Thoothukudi, Tamil Nadu. Rather than operating as an anonymous fleet contractor on corporate ride-hailing apps, I personally manage, maintain, and drive my single vehicle — a reliable, well-cared-for {SITE.carName}.</p>
              <p>With aggregator apps, passengers frequently face sudden cancellations, tired unknown drivers, surge spikes, and neglected vehicle hygiene. My approach is completely personal: when you book a journey with Aravinth Cabs, you speak directly with me, you ride with me, and your safety is my singular duty from pick-up to destination.</p>
              <p>Whether it is a multi-day family temple pilgrimage through southern districts, an airport transfer, or corporate business travel, I provide calm, respectful, and transparent chauffeur travel across all corners of Tamil Nadu.</p>
              <h3 className="specs-title">Chauffeur Profile &amp; Operating Specs</h3>
              <div className="spec-grid">
                <div className="spec"><MapPin size={16} /><span>Base Location<b>{SITE.base}</b></span></div>
                <div className="spec"><Compass size={16} /><span>Service Radius<b>Within Tamil Nadu (All Districts)</b></span></div>
                <div className="spec"><Languages size={16} /><span>Languages Spoken<b>{SITE.languages}</b></span></div>
                <a className="spec" href={telLink}><Phone size={16} /><span>Direct Line<b>{SITE.phoneDisplay}</b></span></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section-head"><div>
            <p className="eyebrow">Honest Service Foundations</p>
            <h2 className="h2">Core Principles Behind the Wheel</h2>
            <p className="lead lead--sm">No inflated claims or corporate slogans. Four fundamental promises upheld on every single trip.</p>
          </div></div>
          <div className="principles">
            {PRINCIPLES.map((p) => (
              <article key={p.title} className="card principle">
                <span className="icon-tile icon-tile--navy"><Icon name={p.icon} size={20} /></span>
                <h3 className="h3">{p.title}</h3>
                <p className="muted muted--sm">{p.text}</p>
                <p className="principle__tag"><BadgeCheck size={13} /> {p.tag}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="promise">
            <div>
              <p className="promise__label"><Quote size={16} /> MY PERSONAL PROMISE</p>
              <blockquote>“When you travel with me, you are riding in a clean, personal vehicle with someone who prioritizes your family's safety and comfort above all else. I believe in honest communication, calm driving, and direct personal accountability.”</blockquote>
              <div className="promise__by"><span className="avatar-ic"><Briefcase size={16} /></span><div><b>Aravinth</b><span>Chauffeur &amp; Founder, Aravinth Cabs (Thoothukudi)</span></div></div>
            </div>
            <aside className="promise__box">
              <p><Tag size={14} /> No Surprise Charges</p>
              <span>Every quote shared over phone or WhatsApp is complete and honest. Tolls, parking, and driver allowances are communicated clearly before we start.</span>
            </aside>
          </div>

          <div className="card cta-card">
            <div>
              <p className="eyebrow">Direct Communication</p>
              <h2 className="h3 h3--lg">Ready to Plan Your Tamil Nadu Trip?</h2>
              <p className="muted muted--sm">Speak directly with Aravinth to check dates, get exact tariff estimates, and secure your schedule.</p>
            </div>
            <div className="btn-row">
              <BookButton />
              <a href={telLink} className="btn btn--soft"><Phone size={15} /> {SITE.phoneDisplay}</a>
              <WhatsAppButton>WhatsApp Aravinth</WhatsAppButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
