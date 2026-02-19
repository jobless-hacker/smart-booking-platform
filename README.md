# Smart Appointment Booking System

Monorepo structure:

- `client/` - Next.js frontend (to be initialized with `create-next-app`).
- `server/` - Node.js + Express + Prisma backend.
- `prisma/` - Reserved root-level Prisma assets/documentation if needed.

## Quick Start (Backend)

1. Install Node.js 20+.
2. Go to `server/`.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and update values.
5. Run `npx prisma migrate dev --name init`.
6. Run `npm run demo:seed` for realistic fake slots/bookings.
7. Run `npm run dev`.

If PostgreSQL is not available, set `DEMO_MODE=true` in `server/.env` to run a fully functional fake-data demo.

## Admin Access (Hidden)

- Public pages do not show admin links.
- Open `client` route `/staff-access` and enter your private access code.
- Set `ADMIN_ACCESS_CODE` in `server/.env` to enforce backend admin access control.
