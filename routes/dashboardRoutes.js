const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const verifyToken = require("../middleware/authMiddleware");

// Dashboard Summary
router.get("/", verifyToken, dashboardController.getDashboard);

// Recent Asset History
router.get("/recent-history", verifyToken, dashboardController.getRecentHistory);

module.exports = router;