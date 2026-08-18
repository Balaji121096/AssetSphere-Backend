const express = require("express");

const router =
    express.Router();

const vendorController =
    require("../controllers/vendorController");


// =====================================================
// GET ALL VENDORS
// =====================================================

router.get(

    "/",

    vendorController.getVendors

);


// =====================================================
// GET VENDOR BY ID
// =====================================================

router.get(

    "/:id",

    vendorController.getVendorById

);


// =====================================================
// ADD VENDOR
// =====================================================

router.post(

    "/",

    vendorController.addVendor

);


// =====================================================
// UPDATE VENDOR
// =====================================================

router.put(

    "/:id",

    vendorController.updateVendor

);


// =====================================================
// DELETE VENDOR
// =====================================================

router.delete(

    "/:id",

    vendorController.deleteVendor

);


module.exports = router;