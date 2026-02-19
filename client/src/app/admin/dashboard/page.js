"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import useRequireAdmin from "@/lib/useRequireAdmin";
import { authApi } from "@/lib/api";

export default function AdminDashboardPage() {
  const { token, accessCode, ready } = useRequireAdmin();
  const [stats, setStats] = useState({ slots: 0, bookings: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;

    async function loadData() {
      try {
        const [slots, bookings] = await Promise.all([
          authApi("/api/slots", token, accessCode, { method: "GET" }),
          authApi("/api/admin/bookings", token, accessCode, { method: "GET" })
        ]);

        setStats({
          slots: slots.length,
          bookings: bookings.length
        });
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadData();
  }, [ready, token, accessCode]);

  if (!ready) return null;

  return (
    <main>
      <AdminNav />
      <section className="page">
        <div className="container stack">
          <div className="panel stack">
            <p className="tag">Operations Center</p>
            <h1 style={{ margin: 0 }}>Dashboard</h1>
            <p className="helper">Manage slots, monitor bookings, and export records for reporting.</p>
            {error && <p className="msg error">{error}</p>}
          </div>

          <div className="grid cards-3">
            <article className="card">
              <h3>Open Slots</h3>
              <p>{stats.slots}</p>
            </article>
            <article className="card">
              <h3>Total Bookings</h3>
              <p>{stats.bookings}</p>
            </article>
            <article className="card">
              <h3>Quick Actions</h3>
              <p>
                <Link href="/admin/slots">Manage Slots</Link> |{" "}
                <Link href="/admin/bookings">View Bookings</Link>
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
