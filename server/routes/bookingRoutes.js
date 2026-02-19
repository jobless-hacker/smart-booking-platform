const express = require("express");
const { body } = require("express-validator");
const { createBooking } = require("../controllers/bookingController");
const validateRequest = require("../middleware/validateRequest");
const { bookingLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post(
  "/",
  bookingLimiter,
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone")
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Phone must be a valid 10-digit Indian mobile number"),
    body("slotId").isInt({ min: 1 }).withMessage("Valid slotId is required")
  ],
  validateRequest,
  createBooking
);

module.exports = router;
