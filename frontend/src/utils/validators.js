import { SITE } from '../config/site.js';
import { todayISO } from './format.js';

export const digitsOnly = (v) => String(v || '').replace(/\D/g, '');

export function validateBookingForm(f) {
  const e = {};
  if (f.customerName.trim().length < 2) e.customerName = 'Please enter your full name.';
  if (!/^[6-9]\d{9}$/.test(digitsOnly(f.mobile))) e.mobile = 'Enter a valid 10-digit mobile number.';
  if (f.pickupLocation.trim().length < 3) e.pickupLocation = 'Please enter the pickup location.';
  if (f.dropLocation.trim().length < 3) e.dropLocation = 'Please enter the drop location.';
  if (!f.travelDate) e.travelDate = 'Please choose a travel date.';
  else if (f.travelDate < todayISO()) e.travelDate = 'Travel date cannot be in the past.';
  if (!f.pickupTime) e.pickupTime = 'Please choose a pickup time.';
  if (!f.tripType) e.tripType = 'Please select a trip category.';
  if (f.passengers < 1 || f.passengers > SITE.maxPassengers) e.passengers = `Passengers must be 1 to ${SITE.maxPassengers}.`;
  if (f.message.length > 500) e.message = 'Please keep the note under 500 characters.';
  return e;
}

export function validateContactForm(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!/^[6-9]\d{9}$/.test(digitsOnly(f.mobile).replace(/^91(?=\d{10}$)/, ''))) e.mobile = 'Enter a valid 10-digit mobile number.';
  if (f.message.trim().length < 5) e.message = 'Please write a short message.';
  return e;
}
