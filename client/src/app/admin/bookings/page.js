"use client";

import { useCallback, useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import useRequireAdmin from "@/lib/useRequireAdmin";
import { API_BASE_URL, authApi } from "@/lib/api";

export default function AdminBookingsPage() {
  const { token, ready } = useRequireAdmin();
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadBookings = useCallback(async () => {
    const data = await authApi("/api/admin/bookings", token, { method: "GET" });
    setBookings(data);
  }, [token]);

  useEffect(() => {
    if (!ready) return;

    loadBookings().catch((error) => setMessage({ type: "error", text: error.message }));
  }, [ready, loadBookings]);

  async function onCancel(bookingId) {
    setMessage({ type: "", text: "" });
    try {
      await authApi(`/api/admin/bookings/${bookingId}`, token, { method: "DELETE" });
      setMessage({ type: "success", text: "Booking cancelled." });
      await loadBookings();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  }

  async function onExport() {
    setMessage({ type: "", text: "" });
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/export`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to export CSV");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "bookings.csv";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  }

  if (!ready) return null;

  return (
    <main>
      <AdminNav />
      <section className="page">
        <div className="container stack">
          <section className="panel stack">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div>
                <h1 style={{ margin: 0 }}>Bookings</h1>
                <p className="helper">Monitor and cancel appointments if required.</p>
              </div>
              <button className="btn btn-secondary" onClick={onExport} type="button">
                Export CSV
              </button>
            </div>
            {message.text && (
              <p className={message.type === "error" ? "msg error" : "msg success"}>{message.text}</p>
            )}
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.name}</td>
                      <td>{booking.email}</td>
                      <td>{booking.phone}</td>
                      <td>{new Date(booking.slot.date).toLocaleDateString()}</td>
                      <td>
                        {booking.slot.startTime} - {booking.slot.endTime}
                      </td>
                      <td>
                        <button className="danger-btn" onClick={() => onCancel(booking.id)} type="button">
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="helper">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
