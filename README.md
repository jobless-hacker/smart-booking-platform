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
6. Run `npm run admin:create`.
7. Run `npm run dev`.
