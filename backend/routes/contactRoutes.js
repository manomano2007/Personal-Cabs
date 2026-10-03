const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const adminAuth = require('../middleware/adminAuth');
const { createMessage, listMessages } = require('../controllers/contactController');

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages. Please try again later or call the driver directly.' },
});

router.post('/', submitLimiter, createMessage);
router.get('/', adminAuth, listMessages);

module.exports = router;
