const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const memory = require("../controllers/memory.controller");

router.get("/:farmId", protect, memory.getMemory);

router.delete("/:farmId", protect, memory.clearMemory);

module.exports = router;