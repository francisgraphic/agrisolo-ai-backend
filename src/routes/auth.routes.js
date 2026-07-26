const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

console.log("✅ auth.routes.js loaded");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth router is working!"
  });
});

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;