const vendorModel = require("../models/vendorModel");


// =====================================================
// GET ALL VENDORS
// =====================================================

const getVendors = async (req, res) => {

    try {

        const vendors =
            await vendorModel.getAllVendors();

        res.json({

            success: true,

            count:
                vendors.length,

            data:
                vendors

        });

    } catch (error) {

        console.error(
            "Get Vendors Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// =====================================================
// GET VENDOR BY ID
// =====================================================

const getVendorById = async (req, res) => {

    try {

        const vendorId =
            req.params.id;


        const vendor =
            await vendorModel.getVendorById(
                vendorId
            );


        if (!vendor) {

            return res.status(404).json({

                success: false,

                message:
                    "Vendor not found"

            });

        }


        res.json({

            success: true,

            data:
                vendor

        });

    } catch (error) {

        console.error(
            "Get Vendor By ID Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// =====================================================
// ADD VENDOR
// =====================================================

const addVendor = async (req, res) => {

    try {

        const {

            vendor_code,
            vendor_name,
            contact_person,
            email,
            mobile,
            address,
            city,
            state,
            country,
            gst_number,
            status

        } = req.body;


        // -------------------------------------------------
        // REQUIRED VALIDATION
        // -------------------------------------------------

        if (!vendor_code || !vendor_code.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Vendor code is required"

            });

        }


        if (!vendor_name || !vendor_name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Vendor name is required"

            });

        }


        // -------------------------------------------------
        // ADD VENDOR
        // -------------------------------------------------

        const result =
            await vendorModel.addVendor({

                vendor_code:
                    vendor_code.trim(),

                vendor_name:
                    vendor_name.trim(),

                contact_person:
                    contact_person || null,

                email:
                    email || null,

                mobile:
                    mobile || null,

                address:
                    address || null,

                city:
                    city || null,

                state:
                    state || null,

                country:
                    country || "India",

                gst_number:
                    gst_number || null,

                status:
                    status || "Active"

            });


        res.status(201).json({

            success: true,

            message:
                "Vendor added successfully",

            vendor_id:
                result.insertId

        });

    } catch (error) {

        console.error(
            "Add Vendor Error:",
            error
        );


        // Duplicate vendor code

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({

                success: false,

                message:
                    "Vendor code already exists"

            });

        }


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// =====================================================
// UPDATE VENDOR
// =====================================================

const updateVendor = async (req, res) => {

    try {

        const vendorId =
            req.params.id;


        const {

            vendor_code,
            vendor_name,
            contact_person,
            email,
            mobile,
            address,
            city,
            state,
            country,
            gst_number,
            status

        } = req.body;


        // -------------------------------------------------
        // REQUIRED VALIDATION
        // -------------------------------------------------

        if (!vendor_code || !vendor_code.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Vendor code is required"

            });

        }


        if (!vendor_name || !vendor_name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Vendor name is required"

            });

        }


        // -------------------------------------------------
        // UPDATE
        // -------------------------------------------------

        const result =
            await vendorModel.updateVendor(

                vendorId,

                {

                    vendor_code:
                        vendor_code.trim(),

                    vendor_name:
                        vendor_name.trim(),

                    contact_person:
                        contact_person || null,

                    email:
                        email || null,

                    mobile:
                        mobile || null,

                    address:
                        address || null,

                    city:
                        city || null,

                    state:
                        state || null,

                    country:
                        country || "India",

                    gst_number:
                        gst_number || null,

                    status:
                        status || "Active"

                }

            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Vendor not found"

            });

        }


        res.json({

            success: true,

            message:
                "Vendor updated successfully"

        });

    } catch (error) {

        console.error(
            "Update Vendor Error:",
            error
        );


        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({

                success: false,

                message:
                    "Vendor code already exists"

            });

        }


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// =====================================================
// DELETE VENDOR
// =====================================================

const deleteVendor = async (req, res) => {

    try {

        const vendorId =
            req.params.id;


        const result =
            await vendorModel.deleteVendor(
                vendorId
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Vendor not found"

            });

        }


        res.json({

            success: true,

            message:
                "Vendor deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete Vendor Error:",
            error
        );


        // Foreign key restriction

        if (
            error.code ===
            "ER_ROW_IS_REFERENCED_2" ||
            error.code ===
            "ER_ROW_IS_REFERENCED"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Vendor cannot be deleted because it is being used by other records"

            });

        }


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getVendors,

    getVendorById,

    addVendor,

    updateVendor,

    deleteVendor

};