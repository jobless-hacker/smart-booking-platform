"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { publicApi } from "@/lib/api";

export default function BookPage() {
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId),
    [slots, selectedSlotId]
  );

  useEffect(() => {
    async function fetchSlots() {
      try {
        const data = await publicApi("/api/slots");
        setSlots(data);
      } catch (error) {
        setMessage({ type: "error", text: error.message });
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, []);

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!selectedSlotId) {
      setMessage({ type: "error", text: "Please select a slot." });
      return;
    }

    setSubmitting(true);
    try {
      await publicApi("/api/book", {
        method: "POST",
        body: JSON.stringify({ ...form, slotId: selectedSlotId })
      });
      setMessage({ type: "success", text: "Booking confirmed. Check your email for details." });
      setForm({ name: "", email: "", phone: "" });
      setSelectedSlotId(null);
      const refreshed = await publicApi("/api/slots");
      setSlots(refreshed);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page">
      <div className="container stack">
        <div className="panel stack">
          <p className="tag">Customer Booking</p>
          <h1 style={{ margin: 0 }}>Book Appointment</h1>
          <p className="helper">
            Pick one available slot and fill your details. Need admin access?{" "}
            <Link href="/admin/login">Login here</Link>.
          </p>
        </div>

        <div className="split-2">
          <section className="panel stack">
            <h2 style={{ margin: 0 }}>Available Slots</h2>
            {loadingSlots && <p className="helper">Loading slots...</p>}
            {!loadingSlots && slots.length === 0 && (
              <p className="helper">No future slots available. Please check again later.</p>
            )}
            <div className="slot-grid">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  className={selectedSlotId === slot.id ? "slot-btn active" : "slot-btn"}
                  onClick={() => setSelectedSlotId(slot.id)}
                >
                  <p className="slot-date">{new Date(slot.date).toLocaleDateString()}</p>
                  <p className="slot-time">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="panel stack">
            <h2 style={{ margin: 0 }}>Your Details</h2>
            {selectedSlot && (
              <p className="helper">
                Selected: {new Date(selectedSlot.date).toLocaleDateString()} |{" "}
                {selectedSlot.startTime} - {selectedSlot.endTime}
              </p>
            )}
            <form onSubmit={onSubmit} className="stack">
              <div className="form-grid">
                <label>
                  Name
                  <input name="name" value={form.name} onChange={onChange} required />
                </label>
                <label>
                  Email
                  <input name="email" value={form.email} onChange={onChange} required type="email" />
                </label>
                <label>
                  Phone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    required
                    pattern="[6-9][0-9]{9}"
                    title="Enter a valid 10-digit Indian mobile number"
                  />
                </label>
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
              {message.text && (
                <p className={message.type === "error" ? "msg error" : "msg success"}>{message.text}</p>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
