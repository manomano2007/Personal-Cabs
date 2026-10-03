import { Link, useLocation } from 'react-router-dom';
import { Check, Phone, MapPin, Flag, Calendar, Car, Search, Headset, TrendingUp, Asterisk, ArrowLeft } from 'lucide-react';
import SmartImage from '../components/SmartImage.jsx';
import { WhatsAppButton } from '../components/CtaButtons.jsx';
import { SITE, TRIP_TYPES, telLink } from '../config/site.js';
import { formatDate, formatTime, formatINR, formatStamp } from '../utils/format.js';

function readBooking(state) {
  if (state?.booking) return state.booking;
  try { return JSON.parse(sessionStorage.getItem('lastBooking') || 'null'); } catch { return null; }
}

export default function BookingConfirmation() {
  const { state } = useLocation();
  const found = readBooking(state);
  // A booking only counts as confirmed once the advance payment has been verified.
  const b = found && found.paymentStatus === 'paid' ? found : null;

  if (!b) {
    return (
      <section className="confirm">
        <div className="container container--narrow center">
          <h1 className="h1">No confirmed booking found</h1>
          <p className="lead lead--sm">We couldn't find a paid booking from this browser. Check My Bookings, make a new booking, or contact Aravinth directly.</p>
          <div className="btn-row btn-row--center">
            <Link to="/book" className="btn btn--amber">Request a Booking</Link>
            <Link to="/my-bookings" className="btn btn--soft">My Bookings</Link>
            <a href={telLink} className="btn btn--dark"><Phone size={15} /> Call Driver Now</a>
          </div>
        </div>
      </section>
    );
  }

  const trip = TRIP_TYPES.find((t) => t.value === b.tripType);
  const people = `${b.passengers} ${b.passengers === 1 ? 'Person' : 'Persons'}`;

  return (
    <section className="confirm">
      <div className="container container--confirm">
        <div className="confirm__head">
          <span className="success-ring"><span><Check size={28} strokeWidth={3} /></span></span>
          <span className="chip chip--amber-soft">• PERSONAL BOOKING SERVICE</span>
          <h1 className="h1">Booking Confirmed</h1>
          <p className="lead lead--sm">Thank you, {b.customerName.split(' ')[0]}! Your {formatINR(b.advanceAmount)} advance payment was received and your booking is confirmed. Aravinth will contact you shortly on your mobile number to confirm the timing and exact trip details.</p>
        </div>

        <div className="card driver-strip">
          <div className="driver-strip__who">
            <span className="driver-strip__avatar"><SmartImage src="/images/aravinth.jpg" alt="Aravinth" position="center 20%" /><i /></span>
            <div>
              <b>Your Driver: Aravinth <em>Owner-Operator</em></b>
              <span>{b.carName || SITE.carName} • Base: Thoothukudi, TN</span>
            </div>
          </div>
          <a href={telLink} className="btn btn--soft btn--sm"><Phone size={13} /> Direct Line</a>
        </div>

        <div className="card summary">
          <div className="summary__head">
            <div><p className="eyebrow">Ride Summary</p><h2 className="h3 h3--lg">Trip Details &amp; Route</h2></div>
            <span className="chip chip--small chip--paid">Status: Confirmed • Advance Paid</span>
          </div>
          <dl className="summary__grid">
            <div><dt>Booking ID</dt><dd className="strong">{b.bookingCode}</dd></div>
            <div><dt>Payment Status</dt><dd className="strong"><span className="chip chip--small chip--paid">Paid</span>{b.razorpayPaymentId ? <small>Payment ref: {b.razorpayPaymentId}</small> : null}</dd></div>
            <div><dt>Advance Amount Paid</dt><dd className="strong">{formatINR(b.advanceAmount)}</dd></div>
            <div><dt>Booking Date</dt><dd>{formatStamp(b.paidAt || b.createdAt)}</dd></div>
            <div><dt>Passenger Name</dt><dd className="strong">{b.customerName}</dd></div>
            <div><dt>Mobile Contact</dt><dd className="strong">+91 {b.mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}</dd></div>
            <div><dt>Pick-up Location</dt><dd><MapPin size={14} className="ic-gold" /> {b.pickupLocation}</dd></div>
            <div><dt>Drop Location</dt><dd><Flag size={14} className="ic-green" /> {b.dropLocation}<small>Within Tamil Nadu Region</small></dd></div>
            <div><dt>Date &amp; Departure Time</dt><dd><Calendar size={14} /> {formatDate(b.travelDate)}, {formatTime(b.pickupTime)}</dd></div>
            <div><dt>Capacity &amp; Journey Type</dt><dd className="strong">{people} <i className="sep" /> {trip?.short || b.tripType}</dd></div>
          </dl>
          <div className="summary__block">
            <p className="dt">Selected Vehicle</p>
            <div className="vehicle-line"><Car size={18} /><div><b>{b.carName || SITE.carName}</b><span>Air-Conditioned • Sanitized Clean Interior • Spacious Trunk</span></div></div>
          </div>
          {b.message && (
            <div className="summary__block">
              <p className="dt">Special Requests / Notes</p>
              <p className="note-box">"{b.message}"</p>
            </div>
          )}
          <div className="summary__foot"><span>Single-operator chauffeur pledge</span><b>Zero surge pricing guarantee</b></div>
        </div>

        <div className="card next">
          <h2 className="h3"><TrendingUp size={16} /> What Happens Next</h2>
          <div className="next__grid">
            <div><span className="next__dot next__dot--done"><Check size={16} /></span><small className="ok">STEP 1 • COMPLETED</small><b>Advance Received</b><p>Your {formatINR(b.advanceAmount)} advance is paid and your trip details are recorded securely.</p></div>
            <div><span className="next__dot next__dot--now"><Search size={16} /></span><small className="gold">STEP 2 • IN PROGRESS</small><b>Aravinth Reviews Route</b><p>Aravinth personally evaluates vehicle sanitization, highway conditions, and rest stops.</p></div>
            <div><span className="next__dot"><Headset size={16} /></span><small>STEP 3 • NEXT</small><b>Direct Confirmation</b><p>You will receive a call and WhatsApp message with total fixed fare and pickup timing.</p></div>
          </div>
        </div>

        <div className="urgent">
          <span className="urgent__ic"><Asterisk size={20} /></span>
          <div>
            <b>Urgent Departure or Early Morning Travel?</b>
            <p>Need immediate departure or urgent assistance? Please call <a href={telLink}>{SITE.phoneDisplay}</a> directly without waiting.</p>
          </div>
        </div>

        <div className="btn-row btn-row--center">
          <a href={telLink} className="btn btn--dark"><Phone size={15} /> Call Driver Now</a>
          <WhatsAppButton message={`Hello Aravinth, I just confirmed a booking (ID ${b.bookingCode}, ${b.pickupLocation} to ${b.dropLocation} on ${formatDate(b.travelDate)}; ${formatINR(b.advanceAmount)} advance paid).`}>WhatsApp Driver</WhatsAppButton>
          <Link to="/" className="btn btn--soft">Back to Home</Link>
        </div>
        <p className="center"><Link to="/my-bookings" className="link-arrow link-arrow--sm">View My Bookings</Link> &nbsp;•&nbsp; <Link to="/book" className="link-arrow link-arrow--sm"><ArrowLeft size={13} /> Make Another Booking Request</Link></p>
      </div>
    </section>
  );
}
