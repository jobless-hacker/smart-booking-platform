"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import useRequireAdmin from "@/lib/useRequireAdmin";
import { authApi, publicApi } from "@/lib/api";

const INITIAL_FORM = {
  date: "",
  startTime: "",
  endTime: ""
};

export default function AdminSlotsPage() {
  const { token, accessCode, ready } = useRequireAdmin();
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  async function loadSlots() {
    const data = await publicApi("/api/slots");
    setSlots(data);
  }

  useEffect(() => {
    if (!ready) return;
    loadSlots().catch((error) => setMessage({ type: "error", text: error.message }));
  }, [ready]);

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    setSubmitting(true);

    try {
      await authApi("/api/admin/slots", token, accessCode, {
        method: "POST",
        body: JSON.stringify(form)
      });
      setMessage({ type: "success", text: "Slot added successfully." });
      setForm(INITIAL_FORM);
      await loadSlots();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(slotId) {
    setMessage({ type: "", text: "" });
    try {
      await authApi(`/api/admin/slots/${slotId}`, token, accessCode, { method: "DELETE" });
      setMessage({ type: "success", text: "Slot removed." });
      await loadSlots();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  }

  if (!ready) return null;

  return (
    <main>
      <AdminNav />
      <section className="page">
        <div className="container split-2">
          <section className="panel stack">
            <h1 style={{ margin: 0 }}>Manage Slots</h1>
            <p className="helper">Create slot entries for booking availability.</p>

            <form onSubmit={onSubmit} className="stack">
              <div className="form-grid">
                <label>
                  Date
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={onChange}
                    required
                  />
                </label>
                <label>
                  Start Time
                  <input
                    name="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={onChange}
                    required
                  />
                </label>
                <label>
                  End Time
                  <input
                    name="endTime"
                    type="time"
                    value={form.endTime}
                    onChange={onChange}
                    required
                  />
                </label>
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Add Slot"}
              </button>
              {message.text && (
                <p className={message.type === "error" ? "msg error" : "msg success"}>{message.text}</p>
              )}
            </form>
          </section>

          <section className="panel stack">
            <h2 style={{ margin: 0 }}>Upcoming Open Slots</h2>
            {slots.length === 0 && <p className="helper">No slots available.</p>}
            <div className="stack">
              {slots.map((slot) => (
                <div key={slot.id} className="card">
                  <h3 style={{ marginBottom: 6 }}>{new Date(slot.date).toLocaleDateString()}</h3>
                  <p className="helper">
                    {slot.startTime} - {slot.endTime}
                  </p>
                  <button className="danger-btn" type="button" onClick={() => onDelete(slot.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
