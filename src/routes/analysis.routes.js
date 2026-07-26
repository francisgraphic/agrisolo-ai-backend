const express = require("express");
const router = express.Router();

const analysisController = require("../controllers/analysis.controller");
const { protect } = require("../middleware/auth.middleware");

router.get(
  "/:farmId",
  protect,
  analysisController.getAnalysis
);

module.exports = router;