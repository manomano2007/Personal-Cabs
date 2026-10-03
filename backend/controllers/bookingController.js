const crypto = require('crypto');
const supabase = require('../supabase');
const { validateBooking } = require('../utils/validate');
const rzp = require('../config/razorpay');

const serialize = (b) => ({
  id: b.id,
  bookingCode: b.booking_code,
  customerName: b.customer_name,
  mobile: b.mobile,
  pickupLocation: b.pickup_location,
  dropLocation: b.drop_location,
  travelDate: b.travel_date,
  pickupTime: b.pickup_time,
  passengers: b.passengers,
  tripType: b.trip_type,
  carName: b.car_name,
  message: b.message,
  status: b.status,
  advanceAmount: b.advance_amount,
  paymentStatus: b.payment_status,
  razorpayPaymentId: b.razorpay_payment_id,
  paidAt: b.paid_at,
  createdAt: b.created_at,
});

const newBookingCode = () =>
  `AC${Date.now().toString(36).toUpperCase().slice(-5)}${crypto
    .randomBytes(2)
    .toString('hex')
    .toUpperCase()}`;

const paymentPayload = (booking) => ({
  keyId: rzp.keyId(),
  orderId: booking.razorpay_order_id,
  amount: rzp.ADVANCE_PAISE,
  currency: rzp.CURRENCY,
});

function sendPaymentError(res, err, next) {
  if (err instanceof rzp.PaymentConfigError) {
    return res.status(503).json({
      success: false,
      message: err.message,
    });
  }

  if (
    err.message &&
    err.message.startsWith('Could not start the payment')
  ) {
    return res.status(502).json({
      success: false,
      message: err.message,
    });
  }

  return next(err);
}

async function findOwnBooking(req, res) {
  const bookingId = req.params.id;

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('user_id', req.user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!booking) {
    res.status(404).json({
      success: false,
      message: 'Booking not found.',
    });
    return null;
  }

  return booking;
}

// Create booking + Razorpay order
exports.createBooking = async (req, res, next) => {
  let booking = null;

  try {
    const { errors, data, isValid } = validateBooking(req.body);

    if (!isValid) {
      return res.status(422).json({
        success: false,
        message: 'Please correct the highlighted fields.',
        errors,
      });
    }

    if (!rzp.isConfigured()) {
      return res.status(503).json({
        success: false,
        message:
          'Online payment is not configured yet. Please call the driver to book.',
      });
    }

    const bookingCode = newBookingCode();

    const { data: createdBooking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        customer_name: data.customerName,
        mobile: data.mobile,
        pickup_location: data.pickupLocation,
        drop_location: data.dropLocation,
        travel_date: data.travelDate,
        pickup_time: data.pickupTime,
        passengers: data.passengers,
        trip_type: data.tripType,
        message: data.message,
        car_name: data.carName,
        user_id: req.user.id,
        booking_code: bookingCode,
        status: 'awaiting_payment',
        advance_amount: rzp.ADVANCE_AMOUNT,
        payment_status: 'pending',
      })
      .select('*')
      .single();

    if (insertError) {
      throw insertError;
    }

    booking = createdBooking;

    const order = await rzp.createOrder({
      receipt: booking.booking_code,
      notes: {
        bookingId: String(booking.id),
        bookingCode: booking.booking_code,
      },
    });

    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        razorpay_order_id: order.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking.id)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    booking = updatedBooking;

    res.status(201).json({
      success: true,
      message:
        'Booking saved. Complete the ₹200 advance payment to confirm it.',
      booking: serialize(booking),
      payment: paymentPayload(booking),
    });
  } catch (err) {
    if (booking && !booking.razorpay_order_id) {
  try {
    await supabase
      .from('bookings')
      .delete()
      .eq('id', booking.id);
  } catch (cleanupError) {
    console.error('Booking cleanup error:', cleanupError.message);
  }
}

    sendPaymentError(res, err, next);
  }
};

// Retry payment
exports.startPayment = async (req, res, next) => {
  try {
    const booking = await findOwnBooking(req, res);

    if (!booking) return;

    if (booking.payment_status === 'paid') {
      return res.status(409).json({
        success: false,
        message: 'The advance for this booking is already paid.',
      });
    }

    if (!booking.razorpay_order_id) {
      const order = await rzp.createOrder({
        receipt: booking.booking_code,
        notes: {
          bookingId: String(booking.id),
          bookingCode: booking.booking_code,
        },
      });

      const { data: updatedBooking, error } = await supabase
        .from('bookings')
        .update({
          razorpay_order_id: order.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking.id)
        .select('*')
        .single();

      if (error) throw error;

      Object.assign(booking, updatedBooking);
    }

    res.json({
      success: true,
      booking: serialize(booking),
      payment: paymentPayload(booking),
    });
  } catch (err) {
    sendPaymentError(res, err, next);
  }
};

function markPaidData(paymentId) {
  return {
    payment_status: 'paid',
    status: 'confirmed',
    razorpay_payment_id: paymentId,
    payment_failure_reason: null,
    paid_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Verify Razorpay payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const booking = await findOwnBooking(req, res);

    if (!booking) return;

    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    } = req.body || {};

    if (
      booking.payment_status === 'paid' &&
      booking.razorpay_payment_id === paymentId
    ) {
      return res.json({
        success: true,
        message: 'Payment already verified.',
        booking: serialize(booking),
      });
    }

    const valid =
      typeof orderId === 'string' &&
      typeof paymentId === 'string' &&
      typeof signature === 'string' &&
      orderId === booking.razorpay_order_id &&
      rzp.isConfigured() &&
      rzp.verifyCheckoutSignature(orderId, paymentId, signature);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message:
          'Payment could not be verified, so the booking is not confirmed. If money was deducted, call the driver and it will be sorted out.',
      });
    }

    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update(markPaidData(paymentId))
      .eq('id', booking.id)
      .eq('user_id', req.user.id)
      .select('*')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Payment successful. Your booking is confirmed.',
      booking: serialize(updatedBooking),
    });
  } catch (err) {
    next(err);
  }
};

// Payment failed
exports.paymentFailed = async (req, res, next) => {
  try {
    const booking = await findOwnBooking(req, res);

    if (!booking) return;

    if (booking.payment_status !== 'paid') {
      const reason = String(
        (req.body && req.body.reason) ||
          'Payment failed or cancelled'
      ).slice(0, 200);

      const { data: updatedBooking, error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'failed',
          payment_failure_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking.id)
        .eq('user_id', req.user.id)
        .select('*')
        .single();

      if (error) throw error;

      return res.json({
        success: true,
        booking: serialize(updatedBooking),
      });
    }

    res.json({
      success: true,
      booking: serialize(booking),
    });
  } catch (err) {
    next(err);
  }
};

// Razorpay webhook
exports.webhook = async (req, res, next) => {
  try {
    if (
      !rzp.verifyWebhookSignature(
        req.rawBody,
        req.get('x-razorpay-signature')
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature.',
      });
    }

    const event = req.body || {};

    if (
      event.event === 'payment.captured' ||
      event.event === 'order.paid'
    ) {
      const payment = event.payload?.payment?.entity;

      if (
        payment?.order_id &&
        payment.amount === rzp.ADVANCE_PAISE
      ) {
        const { data: booking, error: findError } = await supabase
          .from('bookings')
          .select('*')
          .eq('razorpay_order_id', payment.order_id)
          .maybeSingle();

        if (findError) throw findError;

        if (booking && booking.payment_status !== 'paid') {
          const { error: updateError } = await supabase
            .from('bookings')
            .update(markPaidData(payment.id))
            .eq('id', booking.id);

          if (updateError) throw updateError;
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Customer's bookings
exports.myBookings = async (req, res, next) => {
  try {
    const dayAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', req.user.id)
      .or(`payment_status.eq.paid,created_at.gte.${dayAgo}`)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.map(serialize),
    });
  } catch (err) {
    next(err);
  }
};

// Admin booking list
exports.listBookings = async (req, res, next) => {
  try {
    const all = req.query.all === '1';

    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (!all) {
      query = query.not('payment_status', 'in', '(pending,failed)');
    }

    const { data: bookings, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.map(serialize),
    });
  } catch (err) {
    next(err);
  }
};