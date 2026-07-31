const express = require("express");
const router = express.Router();

const planner = require("../controllers/planner.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, planner.createTask);

router.get("/:farmId", protect, planner.getTasks);

router.put("/:id", protect, planner.updateTask);

router.delete("/:id", protect, planner.deleteTask);

module.exports = router;