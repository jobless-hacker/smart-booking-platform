const fs = require("fs");
const prisma = require("../utils/prisma");
const { writeBookingsCsv } = require("../utils/csvExporter");
const { sendBookingCancellation } = require("../utils/mailer");
const demoStore = require("../utils/demoStore");

async function addSlot(req, res, next) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { date, startTime, endTime } = req.body;
    const isDemoMode = process.env.DEMO_MODE === "true";

    if (isDemoMode) {
      const slot = demoStore.addSlot({ date, startTime, endTime });
      return res.status(201).json(slot);
    }

    const slot = await prisma.slot.create({
      data: {
        date: new Date(date),
        startTime,
        endTime
      }
    });

    return res.status(201).json(slot);
  } catch (error) {
    return next(error);
  }
}

async function deleteSlot(req, res, next) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const slotId = Number(req.params.id);
    const isDemoMode = process.env.DEMO_MODE === "true";

    if (isDemoMode) {
      const result = demoStore.deleteSlot(slotId);
      if (result.error === "NOT_FOUND") {
        return res.status(404).json({ message: "Slot not found" });
      }
      if (result.error === "BOOKED") {
        return res.status(400).json({ message: "Cannot delete booked slot" });
      }
      return res.json({ message: "Slot deleted" });
    }

    const slot = await prisma.slot.findUnique({ where: { id: slotId } });

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: "Cannot delete booked slot" });
    }

    await prisma.slot.delete({ where: { id: slotId } });
    return res.json({ message: "Slot deleted" });
  } catch (error) {
    return next(error);
  }
}

async function exportBookings(req, res, next) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const bookings =
      process.env.DEMO_MODE === "true"
        ? demoStore.getBookings()
        : await prisma.booking.findMany({
            include: { slot: true },
            orderBy: { createdAt: "desc" }
          });

    const csvPath = await writeBookingsCsv(bookings);
    res.download(csvPath, "bookings.csv", () => {
      fs.unlink(csvPath, () => {});
    });
  } catch (error) {
    return next(error);
  }
}

async function getBookings(req, res, next) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const bookings =
      process.env.DEMO_MODE === "true"
        ? demoStore.getBookings()
        : await prisma.booking.findMany({
            include: { slot: true },
            orderBy: { createdAt: "desc" }
          });

    return res.json(bookings);
  } catch (error) {
    return next(error);
  }
}

async function cancelBooking(req, res, next) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const bookingId = Number(req.params.id);
    const isDemoMode = process.env.DEMO_MODE === "true";

    if (isDemoMode) {
      const result = demoStore.cancelBooking(bookingId);
      if (result.error === "NOT_FOUND") {
        return res.status(404).json({ message: "Booking not found" });
      }

      sendBookingCancellation({
        to: result.booking.email,
        name: result.booking.name,
        slot: {
          date: result.slot.date.toISOString().slice(0, 10),
          startTime: result.slot.startTime,
          endTime: result.slot.endTime
        }
      }).catch(() => {});

      return res.json({ message: "Booking cancelled" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { slot: true }
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.delete({ where: { id: bookingId } });
      await tx.slot.update({
        where: { id: booking.slotId },
        data: { isBooked: false }
      });
    });

    sendBookingCancellation({
      to: booking.email,
      name: booking.name,
      slot: {
        date: booking.slot.date.toISOString().split("T")[0],
        startTime: booking.slot.startTime,
        endTime: booking.slot.endTime
      }
    }).catch(() => {});

    return res.json({ message: "Booking cancelled" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addSlot,
  deleteSlot,
  exportBookings,
  getBookings,
  cancelBooking
};
