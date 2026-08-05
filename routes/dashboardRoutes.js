const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

// Dashboard Summary
router.get(
    "/",
    verifyToken,
    authorizeRole("Admin","IT"),
    dashboardController.getDashboard
);

// Recent Asset History
router.get(
    "/recent-history",
    verifyToken,
    authorizeRole("Admin","IT"),
    dashboardController.getRecentHistory
);

module.exports = router;