const express = require("express");
const router = express.Router();

const assetController = require("../controllers/assetController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

// GET All Assets
router.get(
    "/",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.getAssets
);

// ADD Asset
router.post(
    "/",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.addAsset
);

// ASSIGN
router.put(
    "/assign/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.assignAsset
);

// RETURN
router.put(
    "/return/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.returnAsset
);

// SCRAP
router.put(
    "/scrap/:id",
    verifyToken,
    authorizeRole("Admin"),
    assetController.scrapAsset
);

// UPDATE (LAST)
router.put(
    "/:id",
    verifyToken,
    authorizeRole("Admin", "IT"),
    assetController.updateAsset
);

module.exports = router;