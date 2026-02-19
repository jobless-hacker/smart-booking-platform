# Backend API

## Setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run admin:create
npm run dev
```

## Routes

- `POST /api/auth/login`
- `POST /api/admin/slots` (admin token required)
- `DELETE /api/admin/slots/:id` (admin token required)
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
