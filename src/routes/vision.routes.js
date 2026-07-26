const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const { protect } = require("../middleware/auth.middleware");
const visionController = require("../controllers/vision.controller");

// Analyze crop image
router.post(
  "/analyze",
  protect,
  upload.single("image"),
  visionController.analyzeImage
);

// Get analysis history
router.get(
  "/history",
  protect,
  visionController.getHistory
);

// Get a single analysis
router.get(
  "/:id",
  protect,
  visionController.getAnalysis
);

// Delete an analysis
router.delete(
  "/:id",
  protect,
  visionController.deleteAnalysis
);

module.exports = router;