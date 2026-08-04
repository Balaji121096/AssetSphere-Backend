const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

// Dashboard Summary
router.get("/", dashboardController.getDashboard);

// Recent Asset History
router.get("/recent-history", dashboardController.getRecentHistory);

module.exports = router;