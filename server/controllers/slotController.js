const prisma = require("../utils/prisma");
const demoStore = require("../utils/demoStore");

async function getAvailableSlots(_req, res, next) {
  try {
    if (process.env.DEMO_MODE === "true") {
      return res.json(demoStore.getAvailableSlots());
    }

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
