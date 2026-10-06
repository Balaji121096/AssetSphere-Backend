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
        "IT"
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
        "IT"
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
        "IT"
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
        "IT"
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
        "IT"
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
        "IT"
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
        "IT"
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
        "IT"
    ),

    reportController.getPurchaseReport
);


module.exports = router;
