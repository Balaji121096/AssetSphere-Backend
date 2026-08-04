const express = require("express");

const router = express.Router();

const reportController = require("../controllers/reportController");

router.get("/assets", reportController.getAllAssets);

router.get("/assigned", reportController.getAssignedAssets);

router.get("/scrap", reportController.getScrapAssets);

router.get("/repair", reportController.getRepairAssets);

router.get("/employee-assets", reportController.getEmployeeAssets);

module.exports = router;