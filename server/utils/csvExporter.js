const os = require("os");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

async function writeBookingsCsv(bookings) {
  const filePath = path.join(os.tmpdir(), `bookings-${Date.now()}.csv`);

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: "id", title: "Booking ID" },
      { id: "name", title: "Name" },
      { id: "email", title: "Email" },
      { id: "phone", title: "Phone" },
      { id: "slotDate", title: "Slot Date" },
      { id: "startTime", title: "Start Time" },
      { id: "endTime", title: "End Time" },
      { id: "createdAt", title: "Booked At" }
    ]
  });

  const rows = bookings.map((booking) => ({
    id: booking.id,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    slotDate: booking.slot.date.toISOString(),
    startTime: booking.slot.startTime,
    endTime: booking.slot.endTime,
    createdAt: booking.createdAt.toISOString()
  }));

  await csvWriter.writeRecords(rows);
  return filePath;
}

module.exports = { writeBookingsCsv };
