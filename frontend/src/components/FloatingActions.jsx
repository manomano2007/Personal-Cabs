import { Phone } from 'lucide-react';
import { WhatsAppIcon } from './Icons.jsx';
import { telLink, whatsappLink } from '../config/site.js';

export default function FloatingActions() {
  return (
    <div className="floating">
      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="floating__btn floating__btn--wa" aria-label="Chat on WhatsApp">
        <WhatsAppIcon size={24} />
      </a>
      <a href={telLink} className="floating__btn floating__btn--call" aria-label="Call the driver now">
        <Phone size={20} />
      </a>
    </div>
  );
}
