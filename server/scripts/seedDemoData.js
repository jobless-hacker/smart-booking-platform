require("dotenv").config();
const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");

const DEMO_NAMES = [
  "Aarav Sharma",
  "Priya Nair",
  "Rahul Verma",
  "Sneha Iyer",
  "Karan Mehta",
  "Ananya Roy",
  "Vikram Singh",
  "Neha Gupta",
  "Rohan Das",
  "Meera Patel"
];

const SLOT_WINDOWS = [
  { startTime: "09:30", endTime: "10:00" },
  { startTime: "10:30", endTime: "11:00" },
  { startTime: "11:30", endTime: "12:00" },
  { startTime: "15:00", endTime: "15:30" },
  { startTime: "16:00", endTime: "16:30" }
];

function randomPhone(index) {
  const base = 9876500000 + index * 37;
  return String(base).slice(0, 10);
}

function toDateOnly(value) {
  return new Date(`${value.toISOString().slice(0, 10)}T00:00:00.000Z`);
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "StrongPassword123!";
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: "ADMIN" },
    create: { email, password: hashedPassword, role: "ADMIN" }
  });
}

async function seedSlots() {
  const daysToGenerate = Number(process.env.DEMO_DAYS || 10);
  const createdSlots = [];
  const now = new Date();

  for (let i = 1; i <= daysToGenerate; i += 1) {
    const day = new Date(now);
    day.setDate(now.getDate() + i);

    // Keep Sundays empty for a more realistic weekly schedule.
    if (day.getUTCDay() === 0) continue;

    for (const window of SLOT_WINDOWS) {
      const slot = await prisma.slot.create({
        data: {
          date: toDateOnly(day),
          startTime: window.startTime,
          endTime: window.endTime,
          isBooked: false
        }
      });
      createdSlots.push(slot);
    }
  }

  return createdSlots;
}

async function seedBookings(slots) {
  const totalBookings = Math.min(slots.length, 12);

  for (let i = 0; i < totalBookings; i += 1) {
    const slot = slots[i];
    const name = DEMO_NAMES[i % DEMO_NAMES.length];
    const emailSlug = name.toLowerCase().replace(/\s+/g, ".");

    await prisma.booking.create({
      data: {
        name,
        email: `${emailSlug}@demo-mail.com`,
        phone: randomPhone(i),
        slotId: slot.id
      }
    });

    await prisma.slot.update({
      where: { id: slot.id },
      data: { isBooked: true }
    });
  }
}

async function main() {
  const reset = process.env.DEMO_RESET !== "false";

  await seedAdmin();

  if (reset) {
    await prisma.booking.deleteMany();
    await prisma.slot.deleteMany();
  }

  const slots = await seedSlots();
  await seedBookings(slots);

  console.log(`Demo seed completed: ${slots.length} slots generated.`);
}

main()
  .catch((error) => {
    console.error("Demo seed failed:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
