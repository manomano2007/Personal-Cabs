const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const adminAuth = require('../middleware/adminAuth');
const requireUser = require('../middleware/requireUser');
const ctrl = require('../controllers/bookingController');

// Stops a single IP from flooding the driver with requests.
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later or call the driver directly.' },
});

// Payment retries / verification need a looser limit than creating new bookings.
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many payment attempts. Please try again later or call the driver directly.' },
});

router.post('/', requireUser, submitLimiter, ctrl.createBooking);
router.get('/mine', requireUser, ctrl.myBookings);
router.post('/:id/pay', requireUser, paymentLimiter, ctrl.startPayment);
router.post('/:id/verify', requireUser, paymentLimiter, ctrl.verifyPayment);
router.post('/:id/payment-failed', requireUser, paymentLimiter, ctrl.paymentFailed);
router.get('/', adminAuth, ctrl.listBookings);

module.exports = router;
