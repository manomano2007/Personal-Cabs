import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, LogOut } from 'lucide-react';
import Brand from './Brand.jsx';
import SmartImage from './SmartImage.jsx';
import { NAV_LINKS, SITE, telLink } from '../config/site.js';
import { useAuth } from '../context/AuthContext.jsx';

function LanguageToggle() {
  // Only English content exists, so Tamil is shown as "coming soon" instead of faking a switch.
  return (
    <div className="lang" role="group" aria-label="Language">
      <button type="button" className="lang__btn lang__btn--active" aria-pressed="true">EN</button>
      <span className="lang__sep" aria-hidden="true">|</span>
      <button type="button" className="lang__btn lang__btn--tamil" disabled title="Tamil version coming soon">
        தமிழ்
      </button>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { signOut } = useAuth();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = [...NAV_LINKS];
  if (pathname === '/booking-confirmation') {
    links.splice(4, 0, { to: '/booking-confirmation', label: 'Booking Confirmation' });
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Brand />

        <nav className="pill-nav" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `pill-nav__link ${isActive ? 'is-active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <LanguageToggle />
          <a href={telLink} className="header__phone" aria-label={`Call ${SITE.phoneDisplay}`}>
            <Phone size={15} />
            <span>{SITE.phoneDisplay}</span>
          </a>
          <Link to="/book" className="btn btn--amber btn--header">Book a Cab</Link>
          <Link to="/about" className="header__avatar" aria-label="About Aravinth">
            <SmartImage src="/images/aravinth.jpg" alt="Aravinth" position="center 20%" />
          </Link>
          <button type="button" className="header__signout" aria-label="Sign out" title="Sign out" onClick={signOut}><LogOut size={16} /></button>
        </div>

        <button type="button" className="header__burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          <nav aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `mobile-menu__link ${isActive ? 'is-active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mobile-menu__actions">
            <Link to="/book" className="btn btn--amber">Book a Cab</Link>
            <a href={telLink} className="btn btn--dark"><Phone size={15} /> Call Now</a>
            <button type="button" className="btn btn--soft" onClick={signOut}><LogOut size={15} /> Sign Out</button>
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
