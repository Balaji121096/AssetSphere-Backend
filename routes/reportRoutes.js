const express = require("express");

const router = express.Router();

const reportController = require("../controllers/reportController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");


// =====================================================
// ASSET REPORT SUMMARY
// =====================================================

router.get(
    "/assets/summary",
    verifyToken,
    authorizeRole("Admin", "IT"),
    reportController.getAssetReportSummary
);


// =====================================================
// ALL ASSETS
// =====================================================

router.get(
    "/assets",
    verifyToken,
    authorizeRole("Admin", "IT"),
    reportController.getAllAssets
);


// =====================================================
// ASSIGNED ASSETS
// =====================================================

router.get(
    "/assigned",
    verifyToken,
    authorizeRole("Admin", "IT"),
    reportController.getAssignedAssets
);


// =====================================================
// SCRAP ASSETS
// =====================================================

router.get(
    "/scrap",
    verifyToken,
    authorizeRole("Admin", "IT"),
    reportController.getScrapAssets
);


// =====================================================
// REPAIR ASSETS
// =====================================================

router.get(
    "/repair",
    verifyToken,
    authorizeRole("Admin", "IT"),
    reportController.getRepairAssets
);


// =====================================================
// EMPLOYEE ASSETS
// =====================================================

router.get(
    "/employee-assets",
    verifyToken,
    authorizeRole("Admin", "IT"),
    reportController.getEmployeeAssets
);


module.exports = router;