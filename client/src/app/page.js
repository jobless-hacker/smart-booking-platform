import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <span className="tag">Made for Clinics, Salons, Coaching Centers</span>
          <h1>Smart Appointment Booking System</h1>
          <p>
            Replace manual calls and WhatsApp confusion with a clean booking flow, instant
            confirmations, and an admin dashboard built for day-to-day operations.
          </p>
          <div className="actions">
            <Link href="/book" className="btn btn-primary">
              Book Appointment
            </Link>
            <Link href="/admin/login" className="btn btn-secondary">
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      <section className="page">
        <div className="container grid cards-3">
          <article className="card">
            <h3>Public Booking</h3>
            <p>Customers pick available slots and submit details in less than a minute.</p>
          </article>
          <article className="card">
            <h3>Admin Control</h3>
            <p>Add or remove slots, view bookings, cancel when needed, and export CSV reports.</p>
          </article>
          <article className="card">
            <h3>Auto Email</h3>
            <p>Send confirmation and cancellation emails to keep customers informed instantly.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
