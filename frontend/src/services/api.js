const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'ac_token';

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
};
export const setToken = (t) => {
  try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
};

async function request(path, body, { method = 'POST', auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: method === 'GET' ? undefined : JSON.stringify(body || {}),
    });
  } catch {
    const err = new Error('Could not reach the server. Please check your internet connection or call the driver directly.');
    err.network = true;
    throw err;
  }
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (!res.ok || data.success === false) {
    // An expired / invalid login: let the app send the user back to Sign In.
    if (res.status === 401 && auth) window.dispatchEvent(new Event('ac:unauthorized'));
    const err = new Error(data.message || 'Something went wrong. Please try again.');
    err.fieldErrors = data.errors || null;
    err.status = res.status;
    throw err;
  }
  return data;
}

// Customer accounts
export const signUpRequest = (payload) => request('/api/auth/signup', payload);
export const signInRequest = (payload) => request('/api/auth/signin', payload);
export const fetchMe = () => request('/api/auth/me', null, { method: 'GET', auth: true });

// Bookings + ₹200 advance payment
export const createBooking = (payload) => request('/api/bookings', payload, { auth: true });
export const startBookingPayment = (id) => request(`/api/bookings/${id}/pay`, {}, { auth: true });
export const verifyBookingPayment = (id, razorpay) => request(`/api/bookings/${id}/verify`, razorpay, { auth: true });
export const reportPaymentFailed = (id, reason) => request(`/api/bookings/${id}/payment-failed`, { reason }, { auth: true });
export const fetchMyBookings = () => request('/api/bookings/mine', null, { method: 'GET', auth: true });

export const sendContactMessage = (payload) => request('/api/contact', payload);
