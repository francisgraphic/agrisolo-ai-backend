const express = require("express");
const router = express.Router();

const fertilizerController = require("../controllers/fertilizer.controller");
const { protect } = require("../middleware/auth.middleware");

router.get(
  "/:farmId/:crop",
  protect,
  fertilizerController.getRecommendation
);

module.exports = router;