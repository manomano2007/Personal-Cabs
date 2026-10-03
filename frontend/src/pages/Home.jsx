import { Link } from 'react-router-dom';
import { ArrowRight, UserCheck, Languages, SprayCan, ShieldCheck, Compass, BadgeCheck, MapPin, Languages as Lang, Armchair, Snowflake, Luggage, Gauge, MessageCircle } from 'lucide-react';
import SmartImage from '../components/SmartImage.jsx';
import Icon from '../components/Icon.jsx';
import { BookButton, CallButton, WhatsAppButton, SectionHead } from '../components/CtaButtons.jsx';
import { DESTINATIONS, HOW_IT_WORKS, SERVICES } from '../data/content.js';
import { SITE, whatsappLink } from '../config/site.js';

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <section className="hero">
        <SmartImage src="/images/hero-xuv500.jpg" alt="" className="hero__bg" loading="eager" />
        <div className="hero__shade" />
        <div className="container hero__content">
          <div className="hero__box">
            <span className="hero__eyebrow"><Compass size={12} /> வணக்கம் | Personal Cab Service in Tamil Nadu</span>
            <h1 className="h1 h1--light">Comfortable &amp; Reliable Rides Across Tamil Nadu in a {SITE.carName}</h1>
            <p className="hero__lead">
              Local trips, outstation journeys, airport and railway station transfers, personally driven by Aravinth from Thoothukudi.
            </p>
            <div className="btn-row">
              <BookButton />
              <CallButton />
              <WhatsAppButton />
            </div>
            <ul className="trust">
              <li><UserCheck size={18} /> Personally driven by Aravinth</li>
              <li><Languages size={20} /> Tamil &amp; English spoken</li>
              <li><SprayCan size={18} /> Clean &amp; well-maintained car</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Travel across Tamil Nadu */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Destinations" title="Travel Across Tamil Nadu" text="Hill stations, temples, beaches and heritage places within Tamil Nadu.">
            <span className="inline-note"><BadgeCheck size={20} /> Single-operator customized routes</span>
          </SectionHead>
          <div className="dest-grid">
            {DESTINATIONS.map((d) => (
              <article key={d.id} className={`card dest-card ${d.wide ? 'dest-card--wide' : ''}`}>
                <SmartImage src={d.img} alt={d.title} className="dest-card__img" position={d.pos} />
                <div className="dest-card__body">
                  <p className="tag"><Icon name={d.icon} size={14} /> {d.tag}</p>
                  <h3 className="h3">{d.title}</h3>
                  <p className="muted">{d.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How it works */}
      <section className="section section--tint">
        <div className="container">
          <SectionHead center eyebrow="Direct & Honest" title="How Booking Works" text="Simple three-step process with zero third-party brokers or automated call centers." />
          <div className="steps">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} className="card step">
                <span className={`step__num ${s.n === 2 ? 'step__num--amber' : ''}`}>{s.n}</span>
                <h3 className="h3">{s.title}</h3>
                <p className="muted">{s.text.replace('{car}', SITE.carName)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Services preview */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Tailored Travel" title="Our Dedicated Services">
            <Link to="/services" className="link-arrow">View all services <ArrowRight size={13} /></Link>
          </SectionHead>
          <div className="svc-grid">
            {SERVICES.map((s) => (
              <Link key={s.id} to={`/book?type=${s.type}`} className="card svc-card">
                <div>
                  <span className="icon-tile"><Icon name={s.icon} size={20} /></span>
                  <h3 className="h3">{s.title}</h3>
                  <p className="muted muted--sm">{s.short}</p>
                </div>
                <p className="svc-card__foot">{s.foot}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Meet your driver */}
      <section className="section section--tint">
        <div className="container split split--driver">
          <div className="driver-photo">
            <SmartImage src="/images/aravinth.jpg" alt="Aravinth, owner and driver" className="driver-photo__img" position="center 20%" />
            <span className="driver-photo__badge"><ShieldCheck size={18} /> Owner &amp; Driver</span>
          </div>
          <div className="stack">
            <div>
              <p className="eyebrow">Meet Your Driver</p>
              <h2 className="h2">Direct Assurance, Zero Middlemen</h2>
            </div>
            <p className="lead lead--dark">
              "Hello, I'm Aravinth from Thoothukudi. I personally drive every trip in my own {SITE.carName}. When you book with me, there are no middle agents, no unknown drivers, and no surprise vehicle swaps."
            </p>
            <div className="badges">
              <span className="chip"><MapPin size={14} /> Base: Thoothukudi</span>
              <span className="chip"><Lang size={15} /> Languages: Tamil &amp; English</span>
              <span className="chip"><Compass size={14} /> Service: All Tamil Nadu districts</span>
            </div>
            <Link to="/about" className="link-arrow">Know more about Aravinth <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* 6. Our car teaser */}
      <section className="section">
        <div className="container split split--car">
          <div className="stack">
            <div>
              <p className="eyebrow">The Vehicle</p>
              <h2 className="h2">{SITE.carName}</h2>
              <p className="lead lead--sm">Clean, spacious, and safe. Maintained strictly to high personal standards for highway comfort and long journeys.</p>
            </div>
            <div className="mini-grid">
              {[[Armchair, 'Spacious 7-seater layout', 'Ample legroom for family tours'], [Snowflake, 'Chilled Dual-Zone AC', 'Vents across all seat rows'], [Luggage, 'Large boot for luggage', 'Generous outstation storage'], [Gauge, 'Highway stability', 'Solid braking & smooth ride']].map(([I, t, d]) => (
                <div key={t} className="mini-card"><I size={20} /><div><b>{t}</b><span>{d}</span></div></div>
              ))}
            </div>
            <Link to="/our-car" className="link-arrow">View car details &amp; gallery <ArrowRight size={14} /></Link>
          </div>
          <div className="car-img-card">
            <SmartImage src="/images/car-hero.jpg" alt={`${SITE.carName} on a Tamil Nadu road`} />
          </div>
        </div>
      </section>

      <Reviews />

      {/* 8. Closing CTA */}
      <section className="section section--navy">
        <div className="container cta-band">
          <h2 className="h2 h2--light">Ready to travel? Send your trip details and Aravinth will get back to you.</h2>
          <p className="cta-band__text">Owner-driven, on-time, transparent pricing across Tamil Nadu. Direct communication from start to finish.</p>
          <div className="btn-row btn-row--center">
            <BookButton />
            <CallButton>Call ({SITE.phoneDisplay})</CallButton>
            <WhatsAppButton>WhatsApp ({SITE.phoneDisplay})</WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}

export function Reviews() {
  return (
    <section className="section section--tint">
      <div className="container container--narrow">
        <SectionHead center eyebrow="Transparency First" title="Customer Reviews" text="We don't post synthetic ratings or artificial reviews. Real passenger testimonials will be published here directly." />
        <div className="card empty">
          <span className="empty__icon"><MessageCircle size={26} /></span>
          <h3 className="h3">Reviews from real customers will appear here.</h3>
          <p className="muted">Travelled with Aravinth? Share your experience on WhatsApp so it can be added here.</p>
          <a className="btn btn--soft" href={whatsappLink('Hello Aravinth, I travelled with you and would like to share my feedback: ')} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> Share Your Feedback
          </a>
        </div>
      </div>
    </section>
  );
}
