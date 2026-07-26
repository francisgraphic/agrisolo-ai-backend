const express = require("express");
const router = express.Router();
console.log("✅ weather.routes.js loaded");

const weatherController = require("../controllers/weather.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/:farmId", protect, weatherController.getWeather);

module.exports = router;