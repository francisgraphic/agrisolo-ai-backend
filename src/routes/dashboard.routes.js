const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

// Dashboard for a specific farm
router.get(
  "/:farmId",
  protect,
  dashboardController.getDashboard
);

module.exports = router;