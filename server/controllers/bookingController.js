const prisma = require("../utils/prisma");
const { sendBookingConfirmation } = require("../utils/mailer");

async function createBooking(req, res, next) {
  try {
    const { name, email, phone, slotId } = req.body;

    const slot = await prisma.slot.findUnique({
      where: { id: Number(slotId) }
    });

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const now = new Date();
    if (slot.date < now) {
      return res.status(400).json({ message: "Cannot book past slot" });
    }

    if (slot.isBooked) {
      return res.status(409).json({ message: "Slot already booked" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updateResult = await tx.slot.updateMany({
        where: { id: Number(slotId), isBooked: false },
        data: { isBooked: true }
      });

      if (updateResult.count === 0) {
        throw Object.assign(new Error("Slot already booked"), { status: 409 });
      }

      const booking = await tx.booking.create({
        data: {
          name,
          email,
          phone,
          slotId: Number(slotId)
        },
        include: { slot: true }
      });

      return booking;
    });

    sendBookingConfirmation({
      to: email,
      name,
      slot: {
        date: result.slot.date.toISOString().split("T")[0],
        startTime: result.slot.startTime,
        endTime: result.slot.endTime
      }
    }).catch(() => {});

    return res.status(201).json({
      message: "Booking created",
      booking: result
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createBooking
};
