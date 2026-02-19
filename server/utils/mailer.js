const nodemailer = require("nodemailer");

function createTransporter() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

async function sendBookingConfirmation({ to, name, slot }) {
  const transporter = createTransporter();
  if (!transporter) return;

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: "Appointment Confirmed",
    text: `Hi ${name}, your appointment is confirmed for ${slot.date} ${slot.startTime}-${slot.endTime}.`
  });
}

async function sendBookingCancellation({ to, name, slot }) {
  const transporter = createTransporter();
  if (!transporter) return;

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: "Appointment Cancelled",
    text: `Hi ${name}, your appointment for ${slot.date} ${slot.startTime}-${slot.endTime} was cancelled.`
  });
}

module.exports = {
  sendBookingConfirmation,
  sendBookingCancellation
};
