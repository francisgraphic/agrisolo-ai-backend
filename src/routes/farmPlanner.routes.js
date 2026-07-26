console.log("========== PLANNER ROUTES ==========");
console.log(__filename);
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const farmPlannerController = require("../controllers/farmPlanner.controller");

router.post("/:farmId", protect, farmPlannerController.generatePlan);

module.exports = router;