import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Flag, Calendar, Car, Loader2, AlertCircle, Hash, Wallet } from 'lucide-react';
import { fetchMyBookings } from '../services/api.js';
import { useAdvancePayment } from '../hooks/useAdvancePayment.js';
import { TRIP_TYPES } from '../config/site.js';
import { formatDate, formatINR, formatStamp, formatTime } from '../utils/format.js';

const STATUS_LABEL = { awaiting_payment: 'Awaiting Payment', pending: 'Pending', confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled' };
const PAYMENT_LABEL = { paid: 'Paid', pending: 'Unpaid', failed: 'Payment Failed' };

function BookingCard({ b, onPay, busyId, phase, notice }) {
  const trip = TRIP_TYPES.find((t) => t.value === b.tripType);
  const paid = b.paymentStatus === 'paid';
  const busy = busyId === b.id;
  const cancelled = b.status === 'cancelled';
  return (
    <article className="card summary booking-item">
      <div className="summary__head">
        <div>
          <p className="eyebrow"><Hash size={11} /> Booking ID</p>
          <h2 className="h3 h3--lg">{b.bookingCode}</h2>
          <small className="muted muted--xs">Booked on {formatStamp(b.createdAt)}</small>
        </div>
        <div className="booking-item__chips">
          <span className={`chip chip--small ${paid ? 'chip--paid' : 'chip--unpaid'}`}>Payment: {PAYMENT_LABEL[b.paymentStatus] || b.paymentStatus}</span>
          <span className="chip chip--small">Status: {STATUS_LABEL[b.status] || b.status}</span>
        </div>
      </div>
      <dl className="summary__grid">
        <div><dt>Customer Name</dt><dd className="strong">{b.customerName}</dd></div>
        <div><dt>Selected Car</dt><dd className="strong"><Car size={14} className="ic-gold" /> {b.carName}</dd></div>
        <div><dt>Pickup Location</dt><dd><MapPin size={14} className="ic-gold" /> {b.pickupLocation}</dd></div>
        <div><dt>Drop Location</dt><dd><Flag size={14} className="ic-green" /> {b.dropLocation}</dd></div>
        <div><dt>Date</dt><dd><Calendar size={14} /> {formatDate(b.travelDate)}</dd></div>
        <div><dt>Time</dt><dd>{formatTime(b.pickupTime)}{trip ? <small>{trip.short}</small> : null}</dd></div>
        <div><dt>Advance Amount</dt><dd className="strong"><Wallet size={14} className="ic-gold" /> {formatINR(b.advanceAmount)}</dd></div>
        <div><dt>Payment Status</dt><dd className="strong">{PAYMENT_LABEL[b.paymentStatus] || b.paymentStatus}{paid && b.razorpayPaymentId ? <small>Ref: {b.razorpayPaymentId}</small> : null}</dd></div>
      </dl>
      {!paid && !cancelled && (
        <div className="booking-item__pay">
          <p className="muted muted--sm">This booking is <b>not confirmed</b> until the {formatINR(b.advanceAmount)} advance is paid.</p>
          <button type="button" className="btn btn--amber btn--sm" onClick={() => onPay(b)} disabled={Boolean(busyId)}>
            {busy ? (<><Loader2 size={15} className="spin" /> {phase === 'verifying' ? 'Confirming…' : 'Opening payment…'}</>) : (b.paymentStatus === 'failed' ? `Retry ${formatINR(b.advanceAmount)} Payment` : `Pay ${formatINR(b.advanceAmount)} Advance`)}
          </button>
        </div>
      )}
      {notice && notice.id === b.id && <div className="alert alert--error" role="alert"><AlertCircle size={18} /> {notice.message}</div>}
    </article>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const [notice, setNotice] = useState(null);
  const { phase, pay } = useAdvancePayment();

  const load = useCallback(async () => {
    try {
      const d = await fetchMyBookings();
      setBookings(d.bookings);
      setError('');
    } catch (err) {
      setError(err.message);
      setBookings((b) => b || []);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function onPay(b) {
    setNotice(null);
    setBusyId(b.id);
    const result = await pay(b.id, { name: b.customerName, mobile: b.mobile });
    setBusyId('');
    if (result.status !== 'paid') {
      setNotice({ id: b.id, message: `${result.message} Your booking is not confirmed yet. You can retry the ${formatINR(b.advanceAmount)} payment.` });
    }
    load();
  }

  return (
    <>
      <section className="booking-top">
        <div className="container">
          <span className="chip chip--amber-soft">YOUR ACCOUNT</span>
          <h1 className="h1">My Bookings</h1>
          <p className="lead lead--sm">All your cab bookings with Aravinth, with advance payment and booking status.</p>
        </div>
      </section>
      <section className="section section--compact">
        <div className="container container--confirm bookings-list">
          {error && <div className="alert alert--error" role="alert"><AlertCircle size={18} /> {error}</div>}
          {bookings === null && <div className="auth-loading" role="status" aria-label="Loading"><Loader2 size={28} className="spin" /></div>}
          {bookings && bookings.length === 0 && !error && (
            <div className="card empty center">
              <h2 className="h3">No bookings yet</h2>
              <p className="muted">When you book a cab and pay the advance, it will appear here.</p>
              <Link to="/book" className="btn btn--amber">Book a Cab</Link>
            </div>
          )}
          {bookings && bookings.map((b) => (
            <BookingCard key={b.id} b={b} onPay={onPay} busyId={busyId} phase={phase} notice={notice} />
          ))}
        </div>
      </section>
    </>
  );
}
