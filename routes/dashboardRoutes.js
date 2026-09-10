const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

const verifyToken = require("../middleware/authMiddleware");

const authorizeRole = require("../middleware/roleMiddleware");


// =========================================================
// DASHBOARD SUMMARY
// =========================================================

router.get(
    "/",
    verifyToken,
    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),
    dashboardController.getDashboard
);


// =========================================================
// RECENT ASSET HISTORY
// =========================================================

router.get(
    "/recent-history",
    verifyToken,
    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),
    dashboardController.getRecentHistory
);


module.exports = router;