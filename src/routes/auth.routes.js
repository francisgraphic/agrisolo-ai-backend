const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

console.log("✅ auth.routes.js loaded");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth router is working!",
  });
});

// Authentication
router.post("/register", authController.register);
router.post("/login", authController.login);

// Logged-in User Profile
router.get("/profile", protect, authController.profile);

module.exports = router;