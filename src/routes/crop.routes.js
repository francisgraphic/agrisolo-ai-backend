const express = require("express");
const router = express.Router();

const cropController = require("../controllers/crop.controller");
const { protect } = require("../middleware/auth.middleware");

router.get(
  "/recommend/:farmId",
  protect,
  cropController.getRecommendations
);

module.exports = router;