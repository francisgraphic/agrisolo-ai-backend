const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const taskController = require("../controllers/task.controller");

console.log("========== TASK CONTROLLER ==========");
console.log(taskController);
console.log("=====================================");

// Create task for a farm
router.post("/:farmId", protect, taskController.createTask);

// Get all tasks for a farm
router.get("/farm/:farmId", protect, taskController.getTasks);

// Get one task
router.get("/:id", protect, taskController.getTask);

// Mark task as completed
router.patch("/:id/complete", protect, taskController.completeTask);

// Update task
router.put("/:id", protect, taskController.updateTask);

// Delete task
router.delete("/:id", protect, taskController.deleteTask);

module.exports = router;