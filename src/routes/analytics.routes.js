const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const analyticsController = require("../controllers/analytics.controller");

router.get("/", protect, analyticsController.getAnalytics);

module.exports = router;