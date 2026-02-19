const express = require("express");
const { body } = require("express-validator");
const { adminLogin } = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const { loginLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validateRequest,
  adminLogin
);

module.exports = router;
