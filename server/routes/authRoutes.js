const express = require("express");
const { body } = require("express-validator");
const { adminLogin } = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const { loginLimiter } = require("../middleware/rateLimiters");
const adminAccessMiddleware = require("../middleware/adminAccessMiddleware");

const router = express.Router();

router.get("/access-check", adminAccessMiddleware, (_req, res) => {
  res.json({ ok: true });
});

router.post(
  "/login",
  loginLimiter,
  adminAccessMiddleware,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validateRequest,
  adminLogin
);

module.exports = router;
