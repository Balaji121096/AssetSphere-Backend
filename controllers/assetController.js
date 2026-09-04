const assetModel = require("../models/assetModel");


// =====================================================
// GET ALL ASSETS
// =====================================================

const getAssets = async (req, res) => {

    try {

        const assets =
            await assetModel.getAllAssets();

        res.json({
            success: true,
            count: assets.length,
            data: assets
        });

    } catch (error) {

        console.error(
            "Get Assets Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// GET ASSET BY ID
// =====================================================

const getAssetById = async (req, res) => {

    try {

        const asset =
            await assetModel.getAssetById(
                req.params.id
            );

        if (!asset) {

            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });
        }

        res.json({
            success: true,
            data: asset
        });

    } catch (error) {

        console.error(
            "Get Asset Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// ADD ASSET
// =====================================================

const addAsset = async (req, res) => {

    try {

        const asset = {

            ...req.body,

            asset_code:
                req.body.asset_code?.trim(),

            asset_name:
                req.body.asset_name?.trim(),

            brand:
                req.body.brand?.trim(),

            model:
                req.body.model?.trim(),

            serial_number:
                req.body.serial_number?.trim(),

            asset_type:
                req.body.asset_type?.trim(),

            processor:
                req.body.processor?.trim(),

            ram:
                req.body.ram?.trim(),

            ram_capacity:
                req.body.ram_capacity?.trim(),

            storage:
                req.body.storage?.trim(),

            storage_spec:
                req.body.storage_spec?.trim(),

            operating_system:
                req.body.operating_system?.trim(),

            configuration_specs:
                req.body.configuration_specs?.trim(),

            department:
                req.body.department?.trim(),

            invoice_number:
                req.body.invoice_number?.trim(),

            remarks:
                req.body.remarks?.trim()
        };


        if (!asset.asset_code) {

            return res.status(400).json({
                success: false,
                message: "Asset Code is required"
            });
        }


        if (!asset.asset_name) {

            return res.status(400).json({
                success: false,
                message: "Asset Name is required"
            });
        }


        if (!asset.category_id) {

            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }


        if (!asset.location_id) {

            return res.status(400).json({
                success: false,
                message: "Location is required"
            });
        }


        const result =
            await assetModel.addAsset(
                asset
            );


        res.status(201).json({

            success: true,

            message:
                "Asset added successfully",

            asset_id:
                result.insertId
        });

    } catch (error) {

        console.error(
            "Add Asset Error:",
            error
        );


        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Asset Code or Serial Number already exists"
            });
        }


        res.status(500).json({

            success: false,

            message:
                "Failed to add asset"
        });
    }
};


// =====================================================
// UPDATE ASSET
// =====================================================

const updateAsset = async (req, res) => {

    try {

        const {
            asset_status,
            current_employee_id
        } = req.body;


        let employeeId =
            current_employee_id || null;


        if (
            asset_status === "Assigned" &&
            !employeeId
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Assigned asset must have an employee"
            });
        }


        if (
            asset_status === "In Stock" ||
            asset_status === "Repair" ||
            asset_status === "Scrap" ||
            asset_status === "Lost"
        ) {

            employeeId = null;
        }


        const updatedAsset = {

            ...req.body,

            current_employee_id:
                employeeId
        };


        const result =
            await assetModel.updateAsset(
                req.params.id,
                updatedAsset
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Asset not found"
            });
        }


        await assetModel.addAssetHistory(

            req.params.id,

            employeeId,

            "Updated",

            `Asset updated. Status: ${asset_status}`
        );


        res.json({

            success: true,

            message:
                "Asset updated successfully"
        });

    } catch (error) {

        console.error(
            "Update Asset Error:",
            error
        );


        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Asset Code or Serial Number already exists"
            });
        }


        res.status(500).json({

            success: false,

            message:
                "Failed to update asset"
        });
    }
};


// =====================================================
// WARRANTY DOCUMENT UPLOAD
// =====================================================

const uploadWarrantyDocument = async (
    req,
    res
) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Warranty document is required"
            });
        }


        const result =
            await assetModel.updateWarrantyDocument(

                req.params.id,

                req.file.originalname,

                req.file.path
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Asset not found"
            });
        }


        res.json({

            success: true,

            message:
                "Warranty document uploaded successfully",

            data: {

                original_file_name:
                    req.file.originalname,

                stored_file_name:
                    req.file.filename,

                file_path:
                    req.file.path,

                file_size:
                    req.file.size,

                mime_type:
                    req.file.mimetype
            }
        });

    } catch (error) {

        console.error(
            "Warranty Upload Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to upload warranty document"
        });
    }
};


// =====================================================
// DELETE ASSET
// =====================================================

const deleteAsset = async (req, res) => {

    try {

        const result =
            await assetModel.deleteAsset(
                req.params.id
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Asset not found"
            });
        }


        res.json({

            success: true,

            message:
                "Asset deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete Asset Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Asset cannot be deleted. It may be linked to asset history or other records."
        });
    }
};


// =====================================================
// CHANGE STATUS
// =====================================================

const updateAssetStatus = async (
    req,
    res
) => {

    try {

        const allowedStatuses = [

            "Assigned",
            "In Stock",
            "Repair",
            "Scrap",
            "Lost"
        ];


        const {
            status
        } = req.body;


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid asset status"
            });
        }


        const result =
            await assetModel.updateAssetStatus(

                req.params.id,

                status
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Asset not found"
            });
        }


        await assetModel.addAssetHistory(

            req.params.id,

            null,

            "Status Changed",

            `Asset status changed to ${status}`
        );


        res.json({

            success: true,

            message:
                "Asset status updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to update asset status"
        });
    }
};


// =====================================================
// SCRAP ASSET
// =====================================================

const scrapAsset = async (req, res) => {

    try {

        const result =
            await assetModel.scrapAsset(
                req.params.id
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Asset not found"
            });
        }


        await assetModel.addAssetHistory(

            req.params.id,

            null,

            "Scrapped",

            "Asset Scrapped"
        );


        res.json({

            success: true,

            message:
                "Asset moved to Scrap successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to scrap asset"
        });
    }
};


// =====================================================
// ASSIGN ASSET
// =====================================================

const assignAsset = async (
    req,
    res
) => {

    try {

        const result =
            await assetModel.assignAsset(

                req.params.id,

                req.body.employee_id
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Asset not found"
            });
        }


        await assetModel.addAssetHistory(

            req.params.id,

            req.body.employee_id,

            "Assigned",

            "Asset Assigned"
        );


        res.json({

            success: true,

            message:
                "Asset assigned successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to assign asset"
        });
    }
};


// =====================================================
// RETURN ASSET
// =====================================================

const returnAsset = async (
    req,
    res
) => {

    try {

        const result =
            await assetModel.returnAsset(
                req.params.id
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Asset not found"
            });
        }


        await assetModel.addAssetHistory(

            req.params.id,

            null,

            "Returned",

            "Asset Returned"
        );


        res.json({

            success: true,

            message:
                "Asset returned successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to return asset"
        });
    }
};


module.exports = {

    getAssets,
    getAssetById,

    addAsset,
    updateAsset,

    uploadWarrantyDocument,

    deleteAsset,

    updateAssetStatus,
    scrapAsset,

    assignAsset,
    returnAsset
};