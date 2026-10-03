import { useCallback, useState } from 'react';
import { SITE } from '../config/site.js';
import { reportPaymentFailed, startBookingPayment, verifyBookingPayment } from '../services/api.js';

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CHECKOUT_SRC}"]`);
    const script = existing || Object.assign(document.createElement('script'), { src: CHECKOUT_SRC, async: true });
    script.addEventListener('load', () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('x'))));
    script.addEventListener('error', () => reject(new Error('x')));
    if (!existing) document.body.appendChild(script);
  });
}

/**
 * Runs the ₹200 advance payment for a saved booking.
 * Only the public key id is used in the browser; the order and the payment check happen on the server.
 *
 * pay(bookingId, { name, mobile }) resolves with one of:
 *   { status: 'paid', booking }      payment verified by the server, booking confirmed
 *   { status: 'cancelled', message } window closed without paying
 *   { status: 'failed', message }    payment failed (can be retried)
 *   { status: 'error', message }     could not start / verify (can be retried)
 */
export function useAdvancePayment() {
  const [phase, setPhase] = useState('idle'); // idle | preparing | checkout | verifying
  const busy = phase !== 'idle';

  const pay = useCallback(async (bookingId, prefill = {}) => {
    setPhase('preparing');
    let order;
    try {
      order = await startBookingPayment(bookingId);
    } catch (err) {
      setPhase('idle');
      return { status: 'error', message: err.message };
    }

    let Razorpay;
    try {
      Razorpay = await loadRazorpay();
    } catch {
      setPhase('idle');
      return { status: 'error', message: 'Could not load the secure payment window. Check your internet connection and try again.' };
    }

    const { payment, booking } = order;
    return new Promise((resolve) => {
      let settled = false;
      let verifying = false;
      let lastFailure = '';
      const finish = (result) => {
        if (settled) return;
        settled = true;
        setPhase('idle');
        resolve(result);
      };

      const checkout = new Razorpay({
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency,
        order_id: payment.orderId,
        name: SITE.brand,
        description: `Advance booking amount • ${booking.bookingCode}`,
        prefill: { name: prefill.name || booking.customerName, contact: prefill.mobile ? `+91${prefill.mobile}` : `+91${booking.mobile}` },
        notes: { bookingCode: booking.bookingCode },
        theme: { color: '#101c2e' },
        handler: async (response) => {
          verifying = true;
          setPhase('verifying');
          try {
            const data = await verifyBookingPayment(bookingId, response);
            finish({ status: 'paid', booking: data.booking });
          } catch (err) {
            finish({ status: 'error', message: err.message });
          }
        },
        modal: {
          ondismiss: () => {
            if (verifying) return;
            if (lastFailure) {
              finish({ status: 'failed', message: lastFailure });
            } else {
              reportPaymentFailed(bookingId, 'Payment cancelled by customer').catch(() => {});
              finish({ status: 'cancelled', message: 'Payment was cancelled.' });
            }
          },
        },
      });

      // Razorpay lets the customer retry inside its own window, so only remember the failure here.
      checkout.on('payment.failed', (resp) => {
        lastFailure = resp?.error?.description || 'The payment could not be completed.';
        reportPaymentFailed(bookingId, lastFailure).catch(() => {});
      });

      setPhase('checkout');
      checkout.open();
    });
  }, []);

  return { phase, busy, pay };
}
