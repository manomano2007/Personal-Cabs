import { Link } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './Icons.jsx';
import { SITE, telLink, whatsappLink } from '../config/site.js';

export function BookButton({ children = 'Book a Cab', to = '/book', className = '', arrow = false }) {
  return (
    <Link to={to} className={`btn btn--amber ${className}`}>
      {children}
      {arrow && <ArrowRight size={16} />}
    </Link>
  );
}

export function CallButton({ children = 'Call Now', variant = 'glass', className = '' }) {
  return (
    <a href={telLink} className={`btn btn--${variant} ${className}`}>
      <Phone size={15} />
      {children}
    </a>
  );
}

export function WhatsAppButton({ children = 'WhatsApp', message = '', className = '' }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn--whatsapp ${className}`}
    >
      <WhatsAppIcon size={20} />
      {children}
    </a>
  );
}

export function SectionHead({ eyebrow, title, text, center = false, children }) {
  return (
    <div className={`section-head ${center ? 'section-head--center' : ''}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="h2">{title}</h2>
        {text && <p className="lead lead--sm">{text}</p>}
      </div>
      {children}
    </div>
  );
}

export const driverNumber = SITE.phoneDisplay;
