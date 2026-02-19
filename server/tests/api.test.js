const request = require("supertest");
const bcrypt = require("bcrypt");

const mockPrisma = {
  user: {
    findUnique: jest.fn()
  },
  slot: {
    findUnique: jest.fn(),
    updateMany: jest.fn(),
    update: jest.fn()
  },
  booking: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn()
  },
  $transaction: jest.fn()
};

jest.mock("../utils/prisma", () => mockPrisma);
jest.mock("../utils/mailer", () => ({
  sendBookingConfirmation: jest.fn().mockResolvedValue(undefined),
  sendBookingCancellation: jest.fn().mockResolvedValue(undefined)
}));

const app = require("../app");

describe("API security and booking flows", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/auth/login returns token for valid admin credentials", async () => {
    const hashed = await bcrypt.hash("StrongPassword123!", 10);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "admin@example.com",
      password: hashed,
      role: "ADMIN"
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "StrongPassword123!"
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });

  test("POST /api/auth/login rejects invalid credentials", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const response = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "WrongPass123!"
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  test("POST /api/book prevents double booking when slot is already booked", async () => {
    mockPrisma.slot.findUnique.mockResolvedValue({
      id: 11,
      date: new Date("2099-12-01T00:00:00.000Z"),
      startTime: "10:00",
      endTime: "10:30",
      isBooked: true
    });

    const response = await request(app).post("/api/book").send({
      name: "Santo",
      email: "santo@example.com",
      phone: "9876543210",
      slotId: 11
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Slot already booked");
  });

  test("POST /api/admin/slots requires authorization token", async () => {
    const response = await request(app).post("/api/admin/slots").send({
      date: "2099-12-01",
      startTime: "10:00",
      endTime: "10:30"
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authorization token required");
  });
});
