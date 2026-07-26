const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const recommendationController = require("../controllers/recommendation.controller");

// AI Crop Recommendation
router.get(
  "/:farmId",
  protect,
  recommendationController.getRecommendation
);

module.exports = router;