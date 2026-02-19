## Smart Booking Frontend

Next.js frontend for the appointment booking system.

### Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

### Pages

- `/` Home
- `/book` Public booking form
- `/admin/login` Admin login
- `/admin/dashboard` Admin overview
- `/admin/slots` Add/delete slots
- `/admin/bookings` View/cancel bookings + CSV export

### API Base URL

Set in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```
