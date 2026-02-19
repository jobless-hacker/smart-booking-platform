"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { publicApi } from "@/lib/api";
import {
  WEEKDAY_LABELS,
  toAppointmentDateTimeLabel,
  buildMonthCells,
  toDateKey,
  toDisplayDate,
  toMonthLabel
} from "./dateUtils";
import styles from "./BookPage.module.css";

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" role="presentation" aria-hidden>
      <path d="M7.9 14.4 4 10.5l1.4-1.4 2.5 2.5 6.7-6.7 1.4 1.4-8.1 8.1z" />
    </svg>
  );
}

function CalendarPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden>
      <path d="M7 2h2v2h6V2h2v2h2.2A2.8 2.8 0 0 1 22 6.8v12.4A2.8 2.8 0 0 1 19.2 22H4.8A2.8 2.8 0 0 1 2 19.2V6.8A2.8 2.8 0 0 1 4.8 4H7V2zm13 8H4v9.2c0 .4.4.8.8.8h14.4c.4 0 .8-.4.8-.8V10zm-8 2v2H10v2H8v-2H6v-2h2V10h2v2h2zM4.8 6a.8.8 0 0 0-.8.8V8h16V6.8a.8.8 0 0 0-.8-.8H4.8z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden>
      <path d="M17 8h-1V6a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-7-2a2 2 0 1 1 4 0v2h-4V6zm2 10.7a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" role="presentation" aria-hidden>
      <path d="M3.3 5.7 8 10.4l4.7-4.7 1.1 1.1L8 12.6 2.2 6.8z" />
    </svg>
  );
}

function ConfirmedBadgeIcon() {
  return (
    <svg viewBox="0 0 140 140" role="presentation" aria-hidden>
      <defs>
        <linearGradient id="confirmOuter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#72acef" />
          <stop offset="100%" stopColor="#2d63b8" />
        </linearGradient>
        <linearGradient id="confirmInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f8ddd" />
          <stop offset="100%" stopColor="#2d63b8" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="118" rx="48" ry="10" fill="#bfd2ef" />
      <circle cx="70" cy="68" r="54" fill="url(#confirmOuter)" />
      <circle cx="70" cy="68" r="47" fill="url(#confirmInner)" />
      <path d="m57.5 70.9-9-9 4.4-4.4 4.6 4.6 19.6-19.6 4.4 4.4z" fill="#dce7f8" />
      <path d="M22 42.8c1.2-1.1 3-1 4.1.2 1.1 1.2 1 3-.2 4.1-1.2 1.1-3 1-4.1-.2zM114 32.8c1-1.2 2.9-1.4 4.1-.4 1.2 1 1.4 2.9.4 4.1-1 1.2-2.9 1.4-4.1.4zM25 83.8c1-.9 2.5-.9 3.4 0 .9 1 .9 2.5 0 3.4-1 1-2.5 1-3.4 0zM110.4 78.3c.9-.9 2.4-.9 3.3 0 .9.9.9 2.4 0 3.3-.9.9-2.4.9-3.3 0z" fill="#56c0b1" />
      <path d="M18.8 60.8c.8-.8 2.1-.8 2.8 0 .8.8.8 2.1 0 2.8-.8.8-2.1.8-2.8 0zM117.6 61.9c.8-.8 2.1-.8 2.8 0 .8.8.8 2.1 0 2.8-.8.8-2.1.8-2.8 0zM103 24c.8-.9 2.2-1 3.1-.2.9.8 1 2.2.2 3.1-.8.9-2.2 1-3.1.2zM31.4 28c.8-.9 2.2-1 3.1-.2.9.8 1 2.2.2 3.1-.8.9-2.2 1-3.1.2z" fill="#f2a24f" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden>
      <path d="M12 12.5a4.8 4.8 0 1 0-4.8-4.8A4.8 4.8 0 0 0 12 12.5zm0 2.3c-4.4 0-8 2.2-8 4.9v1h16v-1c0-2.7-3.6-4.9-8-4.9z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden>
      <path d="M3.8 5h16.4A1.8 1.8 0 0 1 22 6.8v10.4a1.8 1.8 0 0 1-1.8 1.8H3.8A1.8 1.8 0 0 1 2 17.2V6.8A1.8 1.8 0 0 1 3.8 5zm8.2 6.7L20 7.4v-.6L12 11 4 6.8v.6z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden>
      <path d="M8.9 3A2.1 2.1 0 0 1 10.8 4.3l1 2.8a2.1 2.1 0 0 1-.5 2.2l-1.4 1.5a13.2 13.2 0 0 0 4.9 4.9l1.5-1.4a2.1 2.1 0 0 1 2.2-.5l2.8 1a2.1 2.1 0 0 1 1.3 1.9V20A2 2 0 0 1 20.6 22C10.8 22 2 13.2 2 3.4A2 2 0 0 1 4 1.4h2.6z" />
    </svg>
  );
}

const STEP_CONFIG = [
  { number: 1, label: "Select Service" },
  { number: 2, label: "Choose Date" },
  { number: 3, label: "Select Time" },
  { number: 4, label: "Enter Details" }
];

function toPhoneDisplay(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 10) return `+91 ${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+91 ${digits.slice(2)}`;
  return String(value || "");
}

export default function BookPage() {
  const [allSlots, setAllSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [monthCursor, setMonthCursor] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sendEmailOptIn, setSendEmailOptIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const slotsByDate = useMemo(() => {
    const grouped = {};
    for (const slot of allSlots) {
      const dateKey = toDateKey(slot.date);
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(slot);
    }
    return grouped;
  }, [allSlots]);

  const availableDateKeys = useMemo(() => Object.keys(slotsByDate).sort(), [slotsByDate]);
  const availableDateSet = useMemo(() => new Set(availableDateKeys), [availableDateKeys]);
  const timeSlots = selectedDateKey ? slotsByDate[selectedDateKey] || [] : [];

  const selectedSlot = useMemo(() => {
    for (const dateKey of availableDateKeys) {
      const slot = (slotsByDate[dateKey] || []).find((item) => item.id === selectedSlotId);
      if (slot) return slot;
    }
    return null;
  }, [availableDateKeys, slotsByDate, selectedSlotId]);

  const monthCells = useMemo(() => buildMonthCells(monthCursor), [monthCursor]);
  const stepItems = useMemo(
    () =>
      STEP_CONFIG.map((step) => {
        const isDone =
          step.number <= 2 ||
          (step.number === 3 ? Boolean(selectedSlot) : false) ||
          (step.number === 4 && showDetails && Boolean(selectedSlot));
        const isActive = step.number === 4 && showDetails;

        return {
          ...step,
          isDone,
          isActive
        };
      }),
    [selectedSlot, showDetails]
  );

  const selectedDateTimeLabel = selectedSlot
    ? toAppointmentDateTimeLabel(selectedSlot.date, selectedSlot.startTime)
    : "Select a time slot to continue";
  const confirmedDateTimeLabel = confirmedBooking?.slot
    ? toAppointmentDateTimeLabel(confirmedBooking.slot.date, confirmedBooking.slot.startTime).replace(", at", " at")
    : "";
  const isConfirmationView = Boolean(confirmedBooking);

  useEffect(() => {
    async function fetchSlots() {
      try {
        const data = await publicApi("/api/slots");
        setAllSlots(data);
        const firstDate = data.length ? toDateKey(data[0].date) : "";
        setSelectedDateKey(firstDate);
        if (firstDate) {
          const [year, month] = firstDate.split("-").map(Number);
          setMonthCursor(new Date(year, month - 1, 1));
        }
      } catch (error) {
        setMessage({ type: "error", text: error.message });
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, []);

  useEffect(() => {
    if (!selectedDateKey) return;
    const slots = slotsByDate[selectedDateKey] || [];
    if (!slots.length) {
      setSelectedSlotId(null);
      return;
    }
    if (!slots.some((slot) => slot.id === selectedSlotId)) {
      setSelectedSlotId(slots[0].id);
    }
  }, [selectedDateKey, slotsByDate, selectedSlotId]);

  useEffect(() => {
    if (!showDetails || selectedSlot) return;
    setShowDetails(false);
    setMessage({
      type: "error",
      text: "Selected slot is no longer available. Please choose another time."
    });
  }, [showDetails, selectedSlot]);

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function goToPreviousMonth() {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function bookAnother() {
    setConfirmedBooking(null);
    setShowDetails(false);
    setForm({ name: "", email: "", phone: "" });
    setSendEmailOptIn(true);
    setMessage({ type: "", text: "" });
  }

  async function onSubmit(event) {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!selectedSlot) {
      setMessage({ type: "error", text: "Please select a time slot." });
      return;
    }

    setSubmitting(true);
    try {
      const response = await publicApi("/api/book", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          slotId: selectedSlot.id
        })
      });

      setConfirmedBooking(response.booking || null);
      setForm({ name: "", email: "", phone: "" });
      setSendEmailOptIn(true);
      setShowDetails(false);

      const refreshed = await publicApi("/api/slots");
      setAllSlots(refreshed);
      const firstDate = refreshed.length ? toDateKey(refreshed[0].date) : "";
      setSelectedDateKey(firstDate);
      setSelectedSlotId(firstDate ? refreshed.find((slot) => toDateKey(slot.date) === firstDate)?.id || null : null);
      if (!firstDate) {
        setSelectedSlotId(null);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.root}>
      <header className={styles.topbar}>
        <div className={`${styles.container} ${styles.topbarInner}`}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden>
              SA
            </span>
            <span className={styles.brandText}>SmartAppointments</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/staff-access" className={styles.navLink}>
              Staff Login
            </Link>
            <button className={styles.langBtn} type="button">
              EN v
            </button>
            <Link href="/book" className={`${styles.btn} ${styles.btnPrimary}`}>
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          {isConfirmationView ? (
            <>
              <div className={styles.confirmHeroIcon} aria-hidden>
                <ConfirmedBadgeIcon />
              </div>
              <h1>Appointment Confirmed!</h1>
              <p>
                Thank you {confirmedBooking?.name}, your appointment has been successfully booked.
              </p>
            </>
          ) : (
            <>
              <h1>{showDetails ? "Enter Your Details" : "Book Your Appointment"}</h1>
              <p>
                {showDetails
                  ? "Provide your information to confirm your appointment"
                  : "Select Service, Date &amp; Time Below"}
              </p>
            </>
          )}
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.container}>
          {isConfirmationView ? (
            <section className={styles.confirmSection}>
              <div className={styles.confirmFrame}>
                <h2>Your Appointment Details</h2>

                <article className={styles.confirmCard}>
                  <div className={styles.confirmService}>
                    <span className={styles.confirmServiceIcon} aria-hidden>
                      <CalendarPlusIcon />
                    </span>
                    <div>
                      <strong>General Consultation</strong>
                      <p>{confirmedDateTimeLabel}</p>
                    </div>
                  </div>

                  <div className={styles.confirmRow}>
                    <span className={styles.confirmRowIcon} aria-hidden>
                      <UserIcon />
                    </span>
                    <span>{confirmedBooking?.name}</span>
                  </div>

                  <div className={styles.confirmRow}>
                    <span className={styles.confirmRowIcon} aria-hidden>
                      <MailIcon />
                    </span>
                    <span>{confirmedBooking?.email}</span>
                  </div>

                  <div className={styles.confirmRow}>
                    <span className={styles.confirmRowIcon} aria-hidden>
                      <PhoneIcon />
                    </span>
                    <span>{toPhoneDisplay(confirmedBooking?.phone)}</span>
                  </div>
                </article>

                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.btnFull} ${styles.confirmCta}`}
                  onClick={bookAnother}
                >
                  Book Another Appointment
                </button>

                <Link href="/appointments" className={styles.confirmLink}>
                  View Appointments
                </Link>

                <div className={styles.confirmDivider} />

                <Link href="/" className={styles.confirmLink}>
                  Go to Homepage
                </Link>
              </div>
            </section>
          ) : (
            <>
              <div className={styles.steps}>
                {stepItems.map((step, index) => (
                  <div
                    key={step.number}
                    className={`${styles.step} ${step.isDone ? styles.stepDone : ""} ${step.isActive ? styles.stepActive : ""}`}
                  >
                    <span className={styles.stepBadge} aria-hidden>
                      {step.isDone ? <CheckIcon /> : step.number}
                    </span>
                    <span className={styles.stepText}>{step.label}</span>
                    {index < stepItems.length - 1 && <span className={styles.stepLine} aria-hidden />}
                  </div>
                ))}
              </div>

              {!showDetails ? (
                <div className={styles.grid}>
                  <section className={styles.panel}>
                    <h2>Select Service</h2>
                    <div className={styles.divider} />

                    <div className={styles.servicePill}>
                      <span className={styles.serviceIcon} aria-hidden>
                        <CalendarPlusIcon />
                      </span>
                      <span>General Consultation</span>
                      <span className={styles.serviceChevron} aria-hidden>
                        <ChevronDownIcon />
                      </span>
                    </div>

                    <h3 className={styles.subhead}>Upcoming Availability</h3>
                    <div className={styles.calendar}>
                      <div className={styles.calendarHead}>
                        <button type="button" onClick={goToPreviousMonth} aria-label="Previous month">
                          &lt;
                        </button>
                        <strong>{toMonthLabel(monthCursor)}</strong>
                        <button type="button" onClick={goToNextMonth} aria-label="Next month">
                          &gt;
                        </button>
                      </div>

                      <div className={styles.weekdays}>
                        {WEEKDAY_LABELS.map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                      </div>

                      <div className={styles.days}>
                        {monthCells.map((cell) => {
                          if (cell.type === "empty") {
                            return <span key={cell.key} className={`${styles.day} ${styles.dayEmpty}`} />;
                          }

                          const isAvailable = availableDateSet.has(cell.key);
                          const isSelected = selectedDateKey === cell.key;
                          const className = isSelected
                            ? `${styles.day} ${styles.daySelected}`
                            : isAvailable
                              ? `${styles.day} ${styles.dayAvailable}`
                              : `${styles.day} ${styles.dayDisabled}`;

                          return (
                            <button
                              key={cell.key}
                              type="button"
                              className={className}
                              onClick={() => {
                                if (!isAvailable) return;
                                setSelectedDateKey(cell.key);
                                setShowDetails(false);
                                setMessage({ type: "", text: "" });
                              }}
                            >
                              {cell.day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <p className={styles.note}>Note: Only available slots are shown.</p>
                  </section>

                  <section className={styles.panel}>
                    <h2>Select Time Slot</h2>
                    <div className={styles.divider} />

                    <p className={styles.timeHelp}>
                      {selectedDateKey
                        ? `Available time slots for General Consultation on ${toDisplayDate(selectedDateKey)}`
                        : "No available date selected."}
                    </p>

                    <div className={styles.timeList}>
                      {loadingSlots && <p className={styles.muted}>Loading slots...</p>}
                      {!loadingSlots && !timeSlots.length && (
                        <p className={styles.muted}>No available slots for this date.</p>
                      )}
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          className={
                            selectedSlotId === slot.id ? `${styles.timeItem} ${styles.timeItemActive}` : styles.timeItem
                          }
                          onClick={() => {
                            setSelectedSlotId(slot.id);
                            setShowDetails(false);
                            setMessage({ type: "", text: "" });
                          }}
                        >
                          <span>{slot.startTime}</span>
                          <span>{slot.endTime}</span>
                        </button>
                      ))}
                    </div>

                    <div className={styles.summary}>
                      <h3>Your Appointment</h3>
                      <div className={styles.summaryCard}>
                        <strong>General Consultation</strong>
                        <p>{selectedDateTimeLabel}</p>
                      </div>

                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnFull}`}
                        onClick={() => {
                          if (!selectedSlot) {
                            setMessage({ type: "error", text: "Please select a time slot." });
                            return;
                          }
                          setMessage({ type: "", text: "" });
                          setShowDetails(true);
                        }}
                        disabled={!selectedSlot}
                      >
                        Next
                      </button>
                    </div>

                    {message.text && (
                      <p
                        className={
                          message.type === "error" ? `${styles.msg} ${styles.msgError}` : `${styles.msg} ${styles.msgSuccess}`
                        }
                      >
                        {message.text}
                      </p>
                    )}
                  </section>
                </div>
              ) : (
                <section className={styles.detailsSection}>
                  <div className={styles.detailsFrame}>
                    <div className={styles.detailsHeader}>
                      <h2>Confirm Your Appointment</h2>
                    </div>

                    <div className={styles.detailsBody}>
                      <article className={styles.detailsSummary}>
                        <div className={styles.detailsService}>
                          <span className={styles.detailsServiceIcon} aria-hidden>
                            <CalendarPlusIcon />
                          </span>
                          <div>
                            <h3>General Consultation</h3>
                            <p>{selectedDateTimeLabel}</p>
                          </div>
                        </div>
                      </article>

                      <form className={styles.detailsForm} onSubmit={onSubmit}>
                        <label className={styles.detailsLabel}>
                          <span className={styles.detailsLabelText}>
                            Full Name <strong>*</strong>
                          </span>
                          <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            required
                            placeholder="Rahul Kumar"
                            autoComplete="name"
                          />
                        </label>

                        <label className={styles.detailsLabel}>
                          <span className={styles.detailsLabelText}>
                            Email Address <strong>*</strong>
                          </span>
                          <input
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            required
                            type="email"
                            placeholder="rahul.kumar@gmail.com"
                            autoComplete="email"
                          />
                        </label>

                        <label className={styles.detailsLabel}>
                          <span className={styles.detailsLabelText}>
                            Phone Number <strong>*</strong>
                          </span>
                          <input
                            name="phone"
                            value={form.phone}
                            onChange={onChange}
                            pattern="[6-9][0-9]{9}"
                            title="Enter a valid 10-digit Indian mobile number"
                            required
                            placeholder="9876543210"
                            autoComplete="tel-national"
                          />
                        </label>

                        <label className={styles.reminderRow}>
                          <input
                            type="checkbox"
                            checked={sendEmailOptIn}
                            onChange={(event) => setSendEmailOptIn(event.target.checked)}
                          />
                          <span>Send me appointment details and reminders via email.</span>
                        </label>

                        <button
                          type="submit"
                          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnFull} ${styles.detailsSubmit}`}
                          disabled={submitting}
                        >
                          {submitting ? "Booking..." : "Confirm Booking"}
                        </button>
                      </form>

                      <button type="button" className={styles.backLink} onClick={() => setShowDetails(false)}>
                        <span aria-hidden>&lt;</span> Back
                      </button>

                      <p className={styles.securityNote}>
                        <span className={styles.securityIcon} aria-hidden>
                          <LockIcon />
                        </span>
                        Your information is secured and will only be used for appointment purposes.
                      </p>

                      {message.text && (
                        <p
                          className={
                            message.type === "error" ? `${styles.msg} ${styles.msgError}` : `${styles.msg} ${styles.msgSuccess}`
                          }
                        >
                          {message.text}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.container}>
            <div className={styles.footerSocials}>
              <span>f</span>
              <span>t</span>
              <span>ig</span>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.container}>
            <p>(c) 2024 SmartAppointments. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
