import { Link } from 'react-router-dom';
import { BookButton } from '../components/CtaButtons.jsx';

export default function NotFound() {
  return (
    <section className="confirm">
      <div className="container container--narrow center">
        <p className="eyebrow">Error 404</p>
        <h1 className="h1">Page not found</h1>
        <p className="lead lead--sm">The page you are looking for does not exist. Head back home or send a booking request.</p>
        <div className="btn-row btn-row--center">
          <Link to="/" className="btn btn--soft">Back to Home</Link>
          <BookButton />
        </div>
      </div>
    </section>
  );
}
