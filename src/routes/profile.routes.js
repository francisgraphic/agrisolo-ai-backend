const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const profileController = require("../controllers/profile.controller");

router.get("/stats", protect, profileController.getProfileStats);

module.exports = router;