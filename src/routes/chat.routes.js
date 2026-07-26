const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const chatController = require("../controllers/chat.controller");

// ============================
// DEBUG CHAT CONTROLLER
// ============================

console.log("========== CHAT CONTROLLER ==========");
console.log(chatController);
console.log("=====================================");

// Send message to AI
router.post("/", protect, chatController.sendMessage);

// Get all chats
router.get("/", protect, chatController.getChats);

// Get a single chat
router.get("/:id", protect, chatController.getChat);

// Delete a chat
router.delete("/:id", protect, chatController.deleteChat);

module.exports = router;