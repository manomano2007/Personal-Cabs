// Single source of truth for business details used across the site.
export const SITE = {
  brand: 'Aravinth Cabs',
  driverName: 'Aravinth',
  base: 'Thoothukudi, Tamil Nadu',
  languages: 'Tamil & English',
  phoneDisplay: '+91 88258 03237',
  phoneTel: '+918825803237',
  whatsappNumber: '918825803237', // wa.me format: country code + number, no "+"
  // Working hours shown in the design. Edit here if they change.
  hours: '6:00 AM – 10:00 PM IST',
  // NOTE: The XUV500 is made by Mahindra. The Figma used "Maruti Suzuki" on most
  // pages and "Mahindra" on the Our Car page. Change this one line to switch the name everywhere.
  carName: 'Mahindra XUV500',
  carMake: 'Mahindra',
  maxPassengers: 6,
  // Advance paid online to confirm a booking. The server enforces the same amount.
  advanceAmount: 200,
};

export const telLink = `tel:${SITE.phoneTel}`;

export function whatsappLink(text = '') {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/our-car', label: 'Our Car' },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/contact', label: 'Contact' },
];

export const TRIP_TYPES = [
  { value: 'local', label: 'Local Trip', hint: 'City & errands', short: 'Local Trip' },
  { value: 'outstation', label: 'Outstation Trip', hint: 'Across TN districts', short: 'Outstation Journey' },
  { value: 'airport', label: 'Airport Transfer', hint: 'Madurai, TCR, IXM', short: 'Airport Transfer' },
  { value: 'railway', label: 'Railway Station', hint: 'Punctual station drop', short: 'Railway Station Transfer' },
];
