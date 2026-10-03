const router = require('express').Router();
const { webhook } = require('../controllers/bookingController');

// Configure this URL in the Razorpay dashboard: https://<your-api>/api/payments/webhook
router.post('/webhook', webhook);

module.exports = router;
