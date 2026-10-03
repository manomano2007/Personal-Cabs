const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const requireUser = require('../middleware/requireUser');
const { signUp, signIn, me } = require('../controllers/authController');

// Slows down password guessing and mass sign-ups from one IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in a few minutes.' },
});

router.post('/signup', authLimiter, signUp);
router.post('/signin', authLimiter, signIn);
router.get('/me', requireUser, me);

module.exports = router;
