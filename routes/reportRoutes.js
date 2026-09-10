const express = require("express");

const router = express.Router();

const reportController =
    require("../controllers/reportController");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRole =
    require("../middleware/roleMiddleware");


// =====================================================
// ASSET SUMMARY
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/assets/summary",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    reportController.getAssetReportSummary
);


// =====================================================
// ALL ASSETS
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/assets",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    reportController.getAllAssets
);


// =====================================================
// ASSIGNED ASSETS
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/assigned",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    reportController.getAssignedAssets
);


// =====================================================
// SCRAP ASSETS
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/scrap",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    reportController.getScrapAssets
);


// =====================================================
// REPAIR ASSETS
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/repair",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    reportController.getRepairAssets
);


// =====================================================
// LOST ASSETS
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/lost",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    reportController.getLostAssets
);


// =====================================================
// EMPLOYEE ASSETS
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/employee-assets",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    reportController.getEmployeeAssets
);


// =====================================================
// PURCHASE REPORT
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/purchases",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    reportController.getPurchaseReport
);


module.exports = router;