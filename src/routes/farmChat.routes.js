const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const farmChatController = require("../controllers/farmChat.controller");

// POST /api/v1/farm-chat/:farmId
router.post("/:farmId", protect, farmChatController.chatWithFarm);

module.exports = router;