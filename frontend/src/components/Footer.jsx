import { Link } from 'react-router-dom';
import { Phone, MapPin, ShieldCheck, Info, MessageSquare } from 'lucide-react';
import Brand from './Brand.jsx';
import { NAV_LINKS, SITE, telLink, whatsappLink } from '../config/site.js';

export default function Footer() {
  const links = [...NAV_LINKS];
  links.splice(4, 0, { to: '/book', label: 'Book a Cab' });
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <Brand withTagline={false} />
            <p className="footer__about">
              Personal cab service across Tamil Nadu. Safe, hygienic, and punctual single-operator chauffeur journeys for families and professionals.
            </p>
            <span className="chip chip--small"><ShieldCheck size={13} /> Owner-Driven Integrity</span>
          </div>

          <div className="footer__col">
            <h3 className="footer__title">Quick Links</h3>
            <nav className="footer__links" aria-label="Footer">
              {links.map((l) => (
                <Link key={l.to} to={l.to}>{l.label}</Link>
              ))}
            </nav>
          </div>

          <div className="footer__col footer__col--contact">
            <h3 className="footer__title">Direct Driver Contact</h3>
            <ul className="footer__contact">
              <li><Phone size={14} /> <span>Phone: <a href={telLink}><b>{SITE.phoneDisplay}</b></a></span></li>
              <li><MessageSquare size={14} className="ic-green" /> <span>WhatsApp: <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><b>{SITE.phoneDisplay}</b></a></span></li>
              <li><MapPin size={14} /> <span>Base: <b>{SITE.base}</b></span></li>
            </ul>
            <div className="notice notice--small">
              <Info size={15} />
              <p>Service available within Tamil Nadu only. Bookings are confirmed directly by the driver.</p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {SITE.brand}. Owner-operated single vehicle service.</span>
          <span>Rooted in Tamil Nadu Hospitality</span>
        </div>
      </div>
    </footer>
  );
}
