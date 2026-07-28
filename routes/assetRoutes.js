const express = require("express");

const router = express.Router();

const assetController = require("../controllers/assetController");

// GET All Assets
router.get("/", assetController.getAssets);

// POST Add Asset
router.post("/", assetController.addAsset);

// PUT Update Asset
router.put("/:id", assetController.updateAsset);

module.exports = router;