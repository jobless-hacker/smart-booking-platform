# Project Scope - Smart Appointment Booking System

## Users
- Customer: books appointments through a public interface.
- Admin: clinic/salon/coaching center owner manages slots and bookings.

## Core Problems Solved
- Removes manual booking and phone/WhatsApp back-and-forth.
- Prevents scheduling confusion with structured slot-based booking.
- Sends automatic email confirmations for each booking event.
- Provides a clean admin dashboard workflow for slot and booking management.

## Core Features (MVP)
- Public slot discovery and appointment booking.
- Admin authentication and protected management APIs.
- Slot creation, listing, and deletion.
- Booking creation with double-booking protection.
- CSV export of bookings.
- Email notifications for booking confirmation/cancellation.

## Non-Functional Requirements
- Secure API using JWT auth, input validation, rate limiting, and secure headers.
- Clean modular backend architecture for future scaling.
- Environment-based configuration and no hardcoded secrets.

## Target Users
- Small to medium service businesses in India:
  - Clinics
  - Salons
  - Coaching Centers