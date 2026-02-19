const fs = require("fs");
const prisma = require("../utils/prisma");
const { writeBookingsCsv } = require("../utils/csvExporter");

async function addSlot(req, res, next) {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { date, startTime, endTime } = req.body;

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

    const bookings = await prisma.booking.findMany({
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

module.exports = {
  addSlot,
  deleteSlot,
  exportBookings
};
