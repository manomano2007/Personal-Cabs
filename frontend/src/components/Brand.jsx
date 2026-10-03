import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogoMark } from './Icons.jsx';
import { SITE } from '../config/site.js';

export default function Brand({ withTagline = true }) {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <Link to="/" className="brand" aria-label={`${SITE.brand} home`}>
      {logoFailed ? (
        <LogoMark size={32} />
      ) : (
        <img src="/images/logo.png" alt="" className="brand__logo" onError={() => setLogoFailed(true)} />
      )}
      <span className="brand__text">
        <span className="brand__name">{SITE.brand}</span>
        {withTagline && <span className="brand__tag">வணக்கம் • Executive Chauffeur</span>}
      </span>
    </Link>
  );
}
