const express = require("express");
const router = express.Router();

const diseaseController = require("../controllers/disease.controller");
const { protect } = require("../middleware/auth.middleware");

router.get(
  "/:farmId/:crop",
  protect,
  diseaseController.getPrediction
);

module.exports = router;