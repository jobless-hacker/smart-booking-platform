const express = require("express");
const { body, param } = require("express-validator");
const { addSlot, deleteSlot, exportBookings } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/slots",
  authMiddleware,
  [
    body("date").isISO8601().withMessage("Valid slot date is required"),
    body("startTime")
      .matches(/^\d{2}:\d{2}$/)
      .withMessage("startTime must be HH:mm"),
    body("endTime")
      .matches(/^\d{2}:\d{2}$/)
      .withMessage("endTime must be HH:mm")
  ],
  validateRequest,
  addSlot
);

router.delete(
  "/slots/:id",
  authMiddleware,
  [param("id").isInt({ min: 1 }).withMessage("Valid slot id is required")],
  validateRequest,
  deleteSlot
);

router.get("/export", authMiddleware, exportBookings);

module.exports = router;
