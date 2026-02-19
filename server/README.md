# Backend API

## Setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run admin:create
npm run demo:seed
npm run dev
npm test
```

If PostgreSQL is unavailable and you want a shareable fake-data demo:

```bash
# in .env
DEMO_MODE=true
```

In demo mode, API uses in-memory fake data and all booking/admin flows remain functional.

## Routes

- `POST /api/auth/login`
- `GET /api/auth/access-check`
- `POST /api/admin/slots` (admin token required)
- `DELETE /api/admin/slots/:id` (admin token required)
- `GET /api/admin/bookings` (admin token required)
- `DELETE /api/admin/bookings/:id` (admin token required)
- `GET /api/admin/export` (admin token required)
- `GET /api/slots`
- `POST /api/book`
- `GET /health`

## Security Included

- Helmet
- Global + endpoint rate limiting
- JWT auth middleware
- Input validation with `express-validator`
- Password hashing with bcrypt (admin creation script)

## Notes

- CSRF middleware is not added because this backend expects JWT via `Authorization: Bearer <token>` header, not cookie sessions.
- Booking confirmation email is best-effort; booking succeeds even if email provider fails.
- Admin routes and login can be protected with `ADMIN_ACCESS_CODE` via `x-admin-access-code` header.
