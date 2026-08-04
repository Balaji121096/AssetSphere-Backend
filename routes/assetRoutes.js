const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");
const verifyToken = require("../middleware/authMiddleware");

// GET All Assets
router.get("/", verifyToken, assetController.getAssets);

// ADD Asset
router.post("/", verifyToken, assetController.addAsset);

// ASSIGN
router.put("/assign/:id", verifyToken, assetController.assignAsset);

// RETURN
router.put("/return/:id", verifyToken, assetController.returnAsset);

// SCRAP
router.put("/scrap/:id", verifyToken, assetController.scrapAsset);

// UPDATE (LAST)
router.put("/:id", verifyToken, assetController.updateAsset);

module.exports = router;