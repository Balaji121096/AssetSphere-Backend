const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");

// GET All Assets
router.get("/", assetController.getAssets);

// ADD Asset
router.post("/", assetController.addAsset);

// ASSIGN
router.put("/assign/:id", assetController.assignAsset);

// RETURN
router.put("/return/:id", assetController.returnAsset);

// SCRAP
router.put("/scrap/:id", assetController.scrapAsset);

// UPDATE (LAST)
router.put("/:id", assetController.updateAsset);

module.exports = router;