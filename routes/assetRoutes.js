const express = require("express");

const router = express.Router();

const assetController =
    require("../controllers/assetController");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRole =
    require("../middleware/roleMiddleware");


// =====================================================
// GET ALL ASSETS
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    assetController.getAssets
);


// =====================================================
// ADD ASSET
// MANAGER + ADMIN + IT
// =====================================================

router.post(
    "/",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),

    assetController.addAsset
);


// =====================================================
// GET ONE ASSET
// VIEWER + MANAGER + ADMIN + IT
// =====================================================

router.get(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT",
        "Viewer"
    ),

    assetController.getAssetById
);


// =====================================================
// ASSIGN ASSET
// MANAGER + ADMIN + IT
// =====================================================

router.put(
    "/assign/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),

    assetController.assignAsset
);


// =====================================================
// RETURN ASSET
// MANAGER + ADMIN + IT
// =====================================================

router.put(
    "/return/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),

    assetController.returnAsset
);


// =====================================================
// SCRAP ASSET
// MANAGER + ADMIN
// =====================================================

router.put(
    "/scrap/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager"
    ),

    assetController.scrapAsset
);


// =====================================================
// STATUS CHANGE
// MANAGER + ADMIN + IT
// =====================================================

router.put(
    "/status/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),

    assetController.updateAssetStatus
);


// =====================================================
// UPDATE ASSET
// MANAGER + ADMIN + IT
// =====================================================

router.put(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),

    assetController.updateAsset
);


// =====================================================
// DELETE ASSET
// MANAGER + ADMIN + IT
// =====================================================

router.delete(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "IT"
    ),

    assetController.deleteAsset
);


module.exports = router;