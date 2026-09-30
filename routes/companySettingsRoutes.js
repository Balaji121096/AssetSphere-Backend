const express = require("express");

const router = express.Router();

const companySettingsController =
    require("../controllers/companySettingsController");


// =====================================================
// GET COMPANY SETTINGS
// =====================================================

router.get(
    "/",
    companySettingsController.getCompanySettings
);


// =====================================================
// UPDATE COMPANY SETTINGS
// =====================================================

router.put(
    "/",
    companySettingsController.updateCompanySettings
);


module.exports = router;