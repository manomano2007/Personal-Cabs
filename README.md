# Aravinth Cabs – personal cab booking website

React (Vite) + CSS frontend, Node/Express + MongoDB backend, built from the Figma file
`v9NcvJRlhsbTpEXc3MCjNR` (7 desktop frames: Landing, About, Services, Our Car, Book a Cab, Booking Confirmation, Contact).

## Run locally

Requirements: Node 18+ and a MongoDB (local install or a free MongoDB Atlas cluster).

```bash
# 1) Backend
cd backend
cp .env.example .env        # then edit MONGODB_URI and ADMIN_API_KEY
npm install
npm run dev                 # http://localhost:5000  (GET /api/health to test)

# 2) Frontend (new terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173  (proxies /api to port 5000)
```

Production build: `cd frontend && npm run build` (output in `frontend/dist`).
Set `VITE_API_BASE_URL` to the deployed API URL and `CLIENT_ORIGIN` (backend) to the deployed site URL.

## How a booking flows

Booking form → `POST /api/bookings` (validated again on the server, saved in MongoDB) → success response →
Booking Confirmation page. The page says "request received, the driver will contact you", never a confirmed booking.

The driver can read saved requests (newest first):

```bash
curl -H "x-admin-key: <ADMIN_API_KEY from .env>" http://localhost:5000/api/bookings
curl -H "x-admin-key: <ADMIN_API_KEY from .env>" http://localhost:5000/api/contact
```

Note: nothing pushes a notification to the driver yet (no SMS/WhatsApp/email). Until that is added he has to check
the list above, so keep the phone/WhatsApp buttons prominent. A WhatsApp or email alert is a natural next step.

## Sign-in and ₹200 advance payment (Razorpay)

Visitors must sign up / sign in (mobile number + password) before they can browse; `/auth` is the only public page.
Booking flow: details form -> booking summary with "Advance Booking Amount: ₹200" -> Razorpay checkout -> server verifies
the payment signature -> booking becomes Confirmed / Paid -> confirmation page (booking ID, payment status). A failed or
cancelled payment never confirms the booking and can be retried from the summary page or from **My Bookings**.

Backend `.env` (copy `backend/.env.example`; these stay on the server only, never in the React app):
`JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, optional `RAZORPAY_WEBHOOK_SECRET`
(webhook URL `https://<your-api>/api/payments/webhook`, events `payment.captured`, `order.paid`).
Use `rzp_test_` keys while testing. The ₹200 amount is fixed on the server, so the browser cannot change it.

Note: the older "How a booking flows" text above describes the previous request-only flow.

## Images (not included – see below)

Copy the photos into `frontend/public/images/` with these exact names. Missing files show a grey placeholder.

| File name | Used for | Figma node to export |
|---|---|---|
| logo.png | Header/footer logo | 1:2 |
| aravinth.jpg | Driver photo everywhere | 1:930 (also About 1:408) |
| hero-xuv500.jpg | Landing hero background | 1:706 |
| dest-hill-stations.jpg | Ooty & Kodaikanal card | 1:766 |
| dest-madurai-rameswaram.jpg | Madurai & Rameswaram card | 1:779 |
| dest-kanyakumari.jpg | Kanyakumari card | 1:792 |
| dest-tiruchendur.jpg | Tiruchendur card | 1:805 |
| dest-thanjavur.jpg | Thanjavur card | 1:820 |
| car-hero.jpg | Car teaser + gallery photo 1 | 1:1006 (Our Car 1:1573) |
| car-front.jpg / car-interior.jpg / car-boot.jpg | Gallery photos 2, 3, 4 | 1:1605 / 1:1612 / 1:1619 |
| car-mini.jpg | Small car photo on booking page | 1:1371 |
| service-local.jpg / service-outstation.jpg / service-airport.jpg / service-railway.jpg | Services page | 1:43 / 1:82 / 1:121 / 1:160 |

## Please verify before launch

1. **Car make.** The XUV500 is a Mahindra model. The Figma says "Maruti Suzuki XUV500" on most pages and "Mahindra XUV500" on Our Car.
   The site uses `Mahindra XUV500`; change `carName` in `frontend/src/config/site.js` to switch everywhere.
2. **Design claims and specs that the brother must confirm are true** (all in `frontend/src/data/content.js` and the page files):
   engine/safety/permit specs (2.2L diesel, ABS/EBD, dual airbags, speed governor & GPS, commercial yellow board/permit),
   "7-seater", flight tracking, "Zero Flight Miss Guarantee", "100% on-time guarantee", "zero surge pricing guarantee",
   working hours 6 AM – 10 PM, and the "arrives 10 minutes early" promise. Remove anything that is not true.
3. **Photos.** The Figma pictures look AI/stock-generated. For a genuine business site replace them with real photos of the actual
   car and driver, and do not label them "real vehicle".

## Differences from the Figma (and why)

- Hamburger menu and stacked layouts added for tablet/mobile (Figma has desktop frames only).
- Tamil toggle is shown but disabled ("coming soon"); there is no Tamil copy yet.
- Our Car badge "Ready for immediate outstation booking" changed to "Bookings confirmed directly by the driver" (no availability claims).
- "Single Vehicle Reality Guarantee" photo badge removed (the photos are not verified as real).
- Contact page map is a live OpenStreetMap embed instead of the Figma screenshot.
- Icons come from `lucide-react` (closest match); swap in the Figma SVGs if exact icons matter.
- "Booking Confirmation" appears in the top menu only while on that page.
