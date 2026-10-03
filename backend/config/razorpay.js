const crypto = require('crypto');

// The advance is fixed on the server so the browser can never change the amount.
const ADVANCE_AMOUNT = 200; // rupees
const ADVANCE_PAISE = ADVANCE_AMOUNT * 100;
const CURRENCY = 'INR';

const keyId = () => process.env.RAZORPAY_KEY_ID || '';
const keySecret = () => process.env.RAZORPAY_KEY_SECRET || '';
const isConfigured = () => Boolean(keyId() && keySecret());

class PaymentConfigError extends Error {}

// Creates a Razorpay order through the REST API (secret key stays on the server).
async function createOrder({ receipt, notes }) {
  if (!isConfigured()) throw new PaymentConfigError('Online payment is not configured yet. Please call the driver to book.');
  const auth = Buffer.from(`${keyId()}:${keySecret()}`).toString('base64');
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount: ADVANCE_PAISE, currency: CURRENCY, receipt, notes }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id) {
    console.error('Razorpay order error:', res.status, data?.error?.description || data);
    throw new Error('Could not start the payment. Please try again.');
  }
  return data;
}

const safeEqualHex = (a, b) => {
  const x = Buffer.from(String(a || ''), 'utf8');
  const y = Buffer.from(String(b || ''), 'utf8');
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

// Checkout signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
function verifyCheckoutSignature(orderId, paymentId, signature) {
  const expected = crypto.createHmac('sha256', keySecret()).update(`${orderId}|${paymentId}`).digest('hex');
  return safeEqualHex(signature, expected);
}

function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !rawBody) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return safeEqualHex(signature, expected);
}

module.exports = {
  ADVANCE_AMOUNT, ADVANCE_PAISE, CURRENCY, PaymentConfigError,
  keyId, isConfigured, createOrder, verifyCheckoutSignature, verifyWebhookSignature,
};
