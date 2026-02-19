require("dotenv").config();

const app = require("./app");
const prisma = require("./utils/prisma");

const PORT = Number(process.env.PORT || 5000);

async function start() {
  try {
    if (process.env.DEMO_MODE !== "true") {
      await prisma.$connect();
      console.log("Database connected");
    } else {
      console.log("Demo mode enabled: running without database");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
