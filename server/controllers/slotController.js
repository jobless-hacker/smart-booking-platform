const prisma = require("../utils/prisma");

async function getAvailableSlots(_req, res, next) {
  try {
    const now = new Date();
    const slots = await prisma.slot.findMany({
      where: {
        isBooked: false,
        date: {
          gte: now
        }
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }]
    });

    return res.json(slots);
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAvailableSlots };
