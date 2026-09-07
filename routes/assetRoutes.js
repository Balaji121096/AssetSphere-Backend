const express = require("express");

const router = express.Router();

const assetController =
    require("../controllers/assetController");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRole =
    require("../middleware/roleMiddleware");


// =====================================================
// GET ALL
// =====================================================

router.get(
    "/",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.getAssets
);


// =====================================================
// ADD
// =====================================================

router.post(
    "/",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.addAsset
);


// =====================================================
// GET ONE
// =====================================================

router.get(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.getAssetById
);


// =====================================================
// ASSIGN
// =====================================================

router.put(
    "/assign/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.assignAsset
);


// =====================================================
// RETURN
// =====================================================

router.put(
    "/return/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.returnAsset
);


// =====================================================
// SCRAP
// =====================================================

router.put(
    "/scrap/:id",
    verifyToken,
    authorizeRole("Admin"),
    assetController.scrapAsset
);


// =====================================================
// STATUS CHANGE
// =====================================================

router.put(
    "/status/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.updateAssetStatus
);


// =====================================================
// UPDATE
// =====================================================

router.put(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.updateAsset
);


// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.deleteAsset
);


module.exports = router;