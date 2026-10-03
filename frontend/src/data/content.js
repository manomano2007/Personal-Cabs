// All page copy that comes from the Figma design lives here so it is easy to edit.
// Items marked VERIFY are statements/specs from the design that the owner should confirm are true.

export const DESTINATIONS = [
  { id: 'hills', tag: 'Hill Stations', icon: 'mountain', title: 'Ooty & Kodaikanal', text: 'Misty Ghat Roads & Tea Estates. Smooth, safe hill driving with comfortable seating for the family.', img: '/images/dest-hill-stations.jpg', pos: 'center' },
  { id: 'temples', tag: 'Spiritual Pilgrimage', icon: 'temple', title: 'Madurai Meenakshi Amman & Rameswaram', text: 'Historic temple architecture, serene sea-bridge crossings, and dedicated family temple tours.', img: '/images/dest-madurai-rameswaram.jpg', pos: 'center' },
  { id: 'kanyakumari', tag: 'Southern Tip', icon: 'waves', title: 'Kanyakumari Seashore', text: 'Vivekananda Rock, peaceful ocean shores, and tri-sea union scenic coastal drives.', img: '/images/dest-kanyakumari.jpg', pos: 'center' },
  { id: 'tiruchendur', tag: 'Near Thoothukudi Base', icon: 'pin', title: 'Tiruchendur Murugan Temple Seashore', text: 'Located right near our home base in Thoothukudi. Prompt early morning darshan drop-offs and hassle-free returns right by the Bay of Bengal coastline.', img: '/images/dest-tiruchendur.jpg', pos: 'center', wide: true },
  { id: 'thanjavur', tag: 'Chola Heritage', icon: 'landmark', title: 'Thanjavur Brihadeeswarar Temple', text: 'Unesco world heritage landmark, ancient Tamil craftsmanship, and serene delta region drives.', img: '/images/dest-thanjavur.jpg', pos: 'center' },
];

export const HOW_IT_WORKS = [
  { n: 1, title: 'Send your trip details', text: 'Fill pickup, drop, date & time in the booking form, or share via phone or WhatsApp.' },
  { n: 2, title: 'Aravinth contacts you to confirm', text: 'Direct discussion over call or WhatsApp to confirm your schedule, route, and straightforward pricing.' },
  { n: 3, title: 'Enjoy a comfortable ride', text: 'Punctual doorstep pickup in a clean, sanitized, and well-maintained {car}.' },
];

export const SERVICES = [
  {
    id: 'local', type: 'local', title: 'Local Trips', short: 'Town travel, hospital visits, family functions, marriages, and personal business meetings with relaxed wait times.',
    foot: 'Thoothukudi & Nearby', icon: 'timer', img: '/images/service-local.jpg',
    leftTag: 'Intra-District Mobility', rightTag: 'Flexible Hours', rightIcon: 'clock',
    text: 'City travel within Thoothukudi, Tirunelveli, and neighboring districts. Ideal for family functions, shopping, business meetings, and hospital visits.',
    bullets: [['hourglass', 'Flexible hourly waiting'], ['door', 'Door-to-door pickup & drop'], ['route', 'Deep local route and bypass expertise']],
    cta: 'Book Local Trip',
  },
  {
    id: 'outstation', type: 'outstation', title: 'Outstation Trips', short: 'Intercity journeys, family vacations, temple tours, and leisurely travel across all districts of Tamil Nadu.',
    foot: 'Anywhere in Tamil Nadu', icon: 'map', img: '/images/service-outstation.jpg',
    leftTag: 'Statewide Reach', rightTag: 'Hills & Highways', rightIcon: 'mountain',
    text: 'Intercity long-distance travel, family tours, weekend retreats, and temple pilgrimages across all Tamil Nadu districts.',
    bullets: [['gauge', 'Smooth highway cruising & patient pace'], ['mountain', 'Vast Western Ghats hill-driving experience'], ['users', 'Relaxed family rest stops as required']],
    cta: 'Book Outstation Trip',
  },
  {
    id: 'airport', type: 'airport', title: 'Airport Transfers', cardTitle: 'Airport Pickup & Drop', short: 'Reliable airport pickups & drops for Madurai, Tuticorin, Coimbatore, Trichy, and Chennai airports.',
    foot: 'Zero Flight Miss Guarantee', icon: 'plane', img: '/images/service-airport.jpg',
    leftTag: 'Air Transfers', rightTag: 'Flight Tracking', rightIcon: 'plane',
    text: 'On-time transfers to and from airports across Tamil Nadu (Tuticorin TCR, Madurai IXM, Tiruchirappalli TRZ, Coimbatore CJB, and Chennai MAA).',
    bullets: [['monitor', 'Proactive flight timing monitoring'], ['check', 'Zero wait-time anxiety at arrival curbside'], ['luggage', 'Generous boot space for multiple heavy bags']],
    cta: 'Book Airport Transfer',
  },
  {
    id: 'railway', type: 'railway', title: 'Railway Station', cardTitle: 'Railway Station Transfers', short: 'On-time station drops and arrivals pickup. Luggage assistance and relaxed handling for senior citizens.',
    foot: 'Thoothukudi & Southern Hubs', icon: 'train', img: '/images/service-railway.jpg',
    leftTag: 'Station Connect', rightTag: 'Punctual Meets', rightIcon: 'train',
    text: 'Punctual, hassle-free pickup and drop to major railway junctions across South Tamil Nadu with dedicated porter assistance.',
    bullets: [['luggage', 'Active assistance with heavy luggage'], ['alarm', 'Guaranteed timely arrival before train departures'], ['pin', 'Exact coach-to-curb meeting coordination']],
    cta: 'Book Railway Transfer',
  },
];

export const POPULAR_DESTINATIONS = ['Ooty', 'Kodaikanal', 'Madurai', 'Rameswaram', 'Kanyakumari', 'Tiruchendur', 'Thanjavur', 'Mahabalipuram', 'Palani', 'Courtallam', 'Yercaud', 'Valparai'];

export const CORRIDORS = ['Madurai', 'Tirunelveli', 'Tiruchendur', 'Kanyakumari', 'Rameshwaram', 'Coimbatore / Ooty'];

export const PRINCIPLES = [
  { icon: 'chauffeur', title: 'Personally Driven', text: 'Every single trip booked is handled strictly by Aravinth. I do not outsource, sub-contract, or hand your itinerary to unknown relief drivers.', tag: 'Zero Sub-Contracting' },
  { icon: 'clock', title: 'Punctual & Respectful', text: 'Quiet professionalism, respectful attitude, and total safety for elders, women, and children. I arrive ahead of schedule for 4:00 AM temple runs and flights.', tag: 'Family-Safe Conduct' },
  { icon: 'signpost', title: 'Knows TN Routes', text: 'In-depth familiarity with East Coast Road (ECR), Madurai-Tirunelveli 4-lane bypasses, temple bypasses, and Western Ghats hairpin sections (Ooty, Kodaikanal).', tag: 'Calm Mountain Driving' },
  { icon: 'spray', title: 'Clean, Safe Car', text: 'Hand-washed and sanitized cabin before each outstation departure. Regular engine maintenance, chilled AC, clean upholstery, and properly inspected tires.', tag: 'Odor-Free Interiors' },
];

// VERIFY: confirm each of these specs with the owner before launch.
export const CAR_FEATURES = [
  { icon: 'seat', title: 'Spacious 7-Seater Layout', text: 'Ample legroom and headroom for families and small groups. Contoured ergonomic seating ensures comfortable outstation travel without cramps.', tag: 'Flexible middle & 3rd row folds' },
  { icon: 'snow', title: 'Powerful Dual-Zone AC', text: "High-performance air conditioning with individual pillar louvers and rear vents designed to keep every seat cool under Tamil Nadu's sweltering noon heat.", tag: 'Dedicated rear air vents' },
  { icon: 'luggage', title: 'Ample Luggage Capacity', text: 'Generous boot space accommodates multiple large suitcases, temple prasadam parcels, and airport trolleys. Clean interior cargo tie-downs provided.', tag: 'Flexible luggage configuration' },
  { icon: 'shield', title: 'Highway Stability & Safety', text: 'Robust monocoque chassis, dual front airbags, ABS with EBD, and disc brakes on all four wheels. Driver strictly adheres to safe 80 km/h limits.', tag: 'RTO compliant speed governor' },
  { icon: 'route', title: 'Smooth Ghat Road Comfort', text: 'Calibrated multi-link rear suspension tuned for hill ascents. Smooth hairpin cornering without body roll, minimizing motion sickness for elders and children.', tag: 'Ooty, Munnar & Kodai ready' },
  { icon: 'spray', title: 'Immaculate Hygiene', text: 'Deep vacuumed, washed, and disinfected prior to every dispatch. Strict zero-smoking and non-tobacco cabin policy guaranteed for clean, fresh air throughout.', tag: 'Spotless upholstery & mats' },
];

export const CAR_SPECS = [
  ['Seating Capacity', 'Up to 6 Passengers + Driver', 'Comfortable for 4 adults + 2 children with boot usage'],
  ['Powertrain & Fuel', '2.2L mHawk Diesel (Manual)', 'High torque for steep hill climbs & highway pace'],
  ['Active Safety Suite', 'ABS + EBD & Dual Airbags', 'All 4 disc brakes and commercial fitness certificate'],
  ['Regulatory Compliance', 'Speed Governor & GPS', 'TN RTO certified for inter-district commercial travel'],
];

export const CAR_GALLERY = [
  { img: '/images/car-hero.jpg', label: 'Exterior Three-Quarter', note: 'Full profile on scenic route', caption: 'Exterior Three-Quarter: Highway Stance & Sunlit Ghat Vistas' },
  { img: '/images/car-front.jpg', label: 'Front Highway View', note: 'Clean aerodynamic grille', caption: 'Front Highway View: Clean Aerodynamic Grille' },
  { img: '/images/car-interior.jpg', label: 'Clean Dashboard & Interior', note: 'Immaculate chauffeur console', caption: 'Clean Dashboard & Interior: Immaculate Chauffeur Console' },
  { img: '/images/car-boot.jpg', label: 'Rear Seating & Boot', note: 'Family legroom & luggage setup', caption: 'Rear Seating & Boot: Family Legroom & Luggage Setup' },
];

export const JOURNEY_CHIPS = [['users', 'Family Vacations'], ['temple', 'Pilgrimage & Temple Tours'], ['plane', 'Airport Transfers'], ['mountain', 'Hill Station Getaways'], ['party', 'Wedding & Function Travel']];
