// Small hand-written validators (no extra dependency needed).
const TRIP_TYPES = ['local', 'outstation', 'airport', 'railway'];
const MAX_PASSENGERS = 6;

const clean = (v) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '');

function normalizeMobile(value) {
  return String(value || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
}

function isValidIndianMobile(value) {
  return /^[6-9]\d{9}$/.test(value);
}

function todayISO() {
  // Date in India time so "today" matches the customer's day.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

function validateBooking(body = {}) {
  const errors = {};
  const data = {
    customerName: clean(body.customerName),
    mobile: normalizeMobile(body.mobile),
    pickupLocation: clean(body.pickupLocation),
    dropLocation: clean(body.dropLocation),
    travelDate: clean(body.travelDate),
    pickupTime: clean(body.pickupTime),
    passengers: Number(body.passengers),
    tripType: clean(body.tripType),
    message: typeof body.message === 'string' ? body.message.trim() : '',
    carName: clean(body.carName).slice(0, 80) || 'Mahindra XUV500',
  };

  if (data.customerName.length < 2 || data.customerName.length > 80) {
    errors.customerName = 'Please enter your full name (2 to 80 characters).';
  }
  if (!isValidIndianMobile(data.mobile)) {
    errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
  }
  if (data.pickupLocation.length < 3 || data.pickupLocation.length > 200) {
    errors.pickupLocation = 'Please enter the pickup location.';
  }
  if (data.dropLocation.length < 3 || data.dropLocation.length > 200) {
    errors.dropLocation = 'Please enter the drop location (within Tamil Nadu).';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.travelDate) || Number.isNaN(Date.parse(data.travelDate))) {
    errors.travelDate = 'Please choose a valid travel date.';
  } else if (data.travelDate < todayISO()) {
    errors.travelDate = 'Travel date cannot be in the past.';
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.pickupTime)) {
    errors.pickupTime = 'Please choose a valid pickup time.';
  }
  if (!Number.isInteger(data.passengers) || data.passengers < 1 || data.passengers > MAX_PASSENGERS) {
    errors.passengers = `Passengers must be between 1 and ${MAX_PASSENGERS}.`;
  }
  if (!TRIP_TYPES.includes(data.tripType)) {
    errors.tripType = 'Please select a trip category.';
  }
  if (data.message.length > 500) {
    errors.message = 'Message must be 500 characters or fewer.';
  }

  return { errors, data, isValid: Object.keys(errors).length === 0 };
}

function validateContact(body = {}) {
  const errors = {};
  const data = {
    name: clean(body.name),
    mobile: normalizeMobile(body.mobile),
    message: typeof body.message === 'string' ? body.message.trim() : '',
  };
  if (data.name.length < 2 || data.name.length > 80) errors.name = 'Please enter your name.';
  if (!isValidIndianMobile(data.mobile)) errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
  if (data.message.length < 5 || data.message.length > 800) {
    errors.message = 'Please write a short message (5 to 800 characters).';
  }
  return { errors, data, isValid: Object.keys(errors).length === 0 };
}

module.exports = { TRIP_TYPES, MAX_PASSENGERS, validateBooking, validateContact };
