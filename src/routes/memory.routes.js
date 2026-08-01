const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth.middleware");

const memory = require("../controllers/memory.controller");

router.get("/:farmId", auth, memory.getMemory);

router.delete("/:farmId", auth, memory.clearMemory);

module.exports = router;