# Vehicle Rental Frontend Demo

## Direction
- Selected **Night Shift** look: deep charcoal surfaces, warm amber accents, strong automotive typography, compact controls, and realistic car photography.
- Use **Velocity Fleet** as the temporary brand name because none was provided.
- Use **Delhi NCR** as the primary city because the sample registrations and customer data are Delhi-based.

## What I’ll build
1. **Rental home and search**
   - Pickup city, start/end dates, and vehicle category controls.
   - Search updates the visible fleet and rental duration using frontend demo data.
   - Responsive navigation for Fleet, Bookings, Support, Customer Sign in, and Admin.

2. **Realistic fleet browser**
   - Use the uploaded records and exact daily rates: Swift ₹1,800, Creta ₹3,200, Honda City ₹2,600, Innova Crysta ₹4,200.
   - Category filters, availability/maintenance states, registration numbers, seating, and odometer details.
   - Generate cohesive automotive images matching the chosen night photography style.

3. **Booking experience**
   - Vehicle selection opens a booking panel with chosen dates, customer details, cost breakdown, and payment method.
   - Validate dates and required fields.
   - Successful confirmation creates a temporary booking in the browser session and shows a confirmation reference.

4. **Bookings and sign-in demos**
   - Customer sign-in screen with realistic validation and a demo account path.
   - “My Bookings” view using the uploaded sample booking/payment states.
   - Admin entry opens a read-only operations dashboard showing fleet status, active/upcoming rentals, payments due, and revenue summary from the supplied data.

5. **Polish and verification**
   - Mobile and desktop layouts, clear loading/empty/error states, keyboard-friendly controls, and restrained motion.
   - Add page-specific titles and social descriptions.
   - Verify search, filters, booking confirmation, sign-in demo, admin dashboard, and key mobile/desktop screens in the running preview.

## Technical details
- Keep this as a **frontend demo only**: no cloud database or permanent login; refreshed sessions reset newly created demo bookings.
- Build separate pages for Fleet, Bookings, Support, Sign in, and Admin so navigation feels complete.
- Store sample data in the frontend based on the uploaded SQL files; the uploaded SQLite database remains unchanged.
