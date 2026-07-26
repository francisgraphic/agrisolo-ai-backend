console.log("========== FARM ROUTES ==========");
console.log(__filename);
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const farmController = require("../controllers/farm.controller");
console.log(farmController);

// Create Farm
router.post("/", protect, farmController.createFarm);

// Get all farms
router.get("/", protect, farmController.getMyFarms);

// Get one farm
router.get("/:id", protect, farmController.getFarm);

// Update farm
router.put("/:id", protect, farmController.updateFarm);

// Delete farm
router.delete("/:id", protect, farmController.deleteFarm);

module.exports = router;