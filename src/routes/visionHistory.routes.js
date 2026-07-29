const express = require("express");

const router = express.Router();

const {
  getHistory,
  getSingle,
  remove,
} = require("../controllers/visionHistory.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

router.use(protect);

router.get("/", getHistory);

router.get("/:id", getSingle);

router.delete("/:id", remove);

module.exports = router;