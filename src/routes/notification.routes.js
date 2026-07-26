const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const notificationController = require("../controllers/notification.controller");

// Get all notifications
router.get("/", protect, notificationController.getNotifications);

// Mark notification as read
router.patch("/:id/read", protect, notificationController.markAsRead);

// Delete notification
router.delete("/:id", protect, notificationController.deleteNotification);

module.exports = router;