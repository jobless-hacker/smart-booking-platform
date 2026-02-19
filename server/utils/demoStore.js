const bcrypt = require("bcrypt");

const SLOT_WINDOWS = [
  { startTime: "09:30", endTime: "10:00" },
  { startTime: "10:30", endTime: "11:00" },
  { startTime: "11:30", endTime: "12:00" },
  { startTime: "15:00", endTime: "15:30" },
  { startTime: "16:00", endTime: "16:30" }
];

const DEMO_NAMES = [
  "Aarav Sharma",
  "Priya Nair",
  "Rahul Verma",
  "Sneha Iyer",
  "Karan Mehta",
  "Ananya Roy",
  "Vikram Singh",
  "Neha Gupta"
];

const state = {
  initialized: false,
  users: [],
  slots: [],
  bookings: [],
  nextSlotId: 1,
  nextBookingId: 1
};

function normalizeDate(date) {
  return new Date(`${new Date(date).toISOString().slice(0, 10)}T00:00:00.000Z`);
}

function seed() {
  if (state.initialized) return;

  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "StrongPassword123!";
  const passwordHash = bcrypt.hashSync(adminPassword, 10);

  state.users = [
    {
      id: 1,
      email: adminEmail,
      password: passwordHash,
      role: "ADMIN",
      createdAt: new Date()
    }
  ];

  const now = new Date();
  for (let day = 1; day <= 12; day += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + day);
    if (date.getUTCDay() === 0) continue;

    SLOT_WINDOWS.forEach((window) => {
      state.slots.push({
        id: state.nextSlotId++,
        date: normalizeDate(date),
        startTime: window.startTime,
        endTime: window.endTime,
        isBooked: false
      });
    });
  }

  for (let i = 0; i < Math.min(10, state.slots.length); i += 1) {
    const slot = state.slots[i];
    const name = DEMO_NAMES[i % DEMO_NAMES.length];
    const booking = {
      id: state.nextBookingId++,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@demo-mail.com`,
      phone: `9${String(876543210 + i).padStart(9, "0")}`,
      slotId: slot.id,
      createdAt: new Date()
    };

    state.bookings.push(booking);
    slot.isBooked = true;
  }

  state.initialized = true;
}

function findAdminByEmail(email) {
  seed();
  return state.users.find((user) => user.email === email) || null;
}

function getAvailableSlots() {
  seed();
  const now = new Date();
  return state.slots
    .filter((slot) => !slot.isBooked && slot.date >= now)
    .sort((a, b) => {
      const dateDiff = a.date - b.date;
      if (dateDiff !== 0) return dateDiff;
      return a.startTime.localeCompare(b.startTime);
    });
}

function addSlot({ date, startTime, endTime }) {
  seed();
  const slot = {
    id: state.nextSlotId++,
    date: normalizeDate(date),
    startTime,
    endTime,
    isBooked: false
  };
  state.slots.push(slot);
  return slot;
}

function deleteSlot(slotId) {
  seed();
  const index = state.slots.findIndex((slot) => slot.id === slotId);
  if (index === -1) return { error: "NOT_FOUND" };
  if (state.slots[index].isBooked) return { error: "BOOKED" };
  state.slots.splice(index, 1);
  return { ok: true };
}

function createBooking({ name, email, phone, slotId }) {
  seed();
  const slot = state.slots.find((item) => item.id === slotId);
  if (!slot) return { error: "SLOT_NOT_FOUND" };
  if (slot.date < new Date()) return { error: "PAST_SLOT" };
  if (slot.isBooked) return { error: "SLOT_BOOKED" };

  slot.isBooked = true;
  const booking = {
    id: state.nextBookingId++,
    name,
    email,
    phone,
    slotId,
    createdAt: new Date()
  };
  state.bookings.push(booking);
  return { booking, slot };
}

function getBookings() {
  seed();
  return state.bookings
    .map((booking) => ({
      ...booking,
      slot: state.slots.find((slot) => slot.id === booking.slotId)
    }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

function cancelBooking(bookingId) {
  seed();
  const bookingIndex = state.bookings.findIndex((booking) => booking.id === bookingId);
  if (bookingIndex === -1) return { error: "NOT_FOUND" };

  const booking = state.bookings[bookingIndex];
  const slot = state.slots.find((item) => item.id === booking.slotId);
  if (slot) slot.isBooked = false;

  state.bookings.splice(bookingIndex, 1);
  return { booking, slot };
}

module.exports = {
  findAdminByEmail,
  getAvailableSlots,
  addSlot,
  deleteSlot,
  createBooking,
  getBookings,
  cancelBooking
};
