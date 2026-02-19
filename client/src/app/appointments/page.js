import Link from "next/link";

export default function AppointmentsPage() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <section className="panel stack">
          <h1 style={{ margin: 0 }}>Appointments</h1>
          <p className="helper">
            Appointment history view is being finalized. You can continue booking new slots meanwhile.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/book" className="btn btn-primary">
              Back to Booking
            </Link>
            <Link href="/" className="btn btn-secondary">
              Go to Homepage
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
