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

        console.error(error);

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

        console.error(error);

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

        const data = {
            ...req.body
        };

        const employeeId =
            data.current_employee_id || null;


        /*
         * Employee selected:
         * Asset automatically becomes Assigned.
         *
         * No employee selected:
         * Asset remains In Stock.
         */

        if (employeeId) {

            data.asset_status = "Assigned";
            data.assigned_date =
                data.assigned_date || new Date();

            data.returned_date = null;

        } else {

            data.current_employee_id = null;
            data.asset_status = "In Stock";
            data.assigned_date = null;

        }


        const result =
            await assetModel.addAsset(data);


        if (!result) {

            return res.status(400).json({
                success: false,
                message: "Failed to add asset"
            });

        }


        await assetModel.addAssetHistory({

            asset_id: result,

            employee_id: employeeId,

            action_type:
                employeeId
                    ? "Assigned"
                    : "Created",

            old_status: null,

            new_status:
                employeeId
                    ? "Assigned"
                    : "In Stock",

            remarks:
                employeeId
                    ? "Asset created and assigned"
                    : "Asset created"

        });


        res.status(201).json({

            success: true,

            message:
                employeeId
                    ? "Asset added and assigned successfully"
                    : "Asset added successfully",

            asset_id: result

        });

    } catch (error) {

        console.error(
            "Add Asset Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
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
            asset_status === "Lost" ||
            asset_status === "Spare"
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


        await assetModel.addAssetHistory({

            asset_id:
                req.params.id,

            employee_id:
                employeeId,

            action_type:
                "Updated",

            old_status: null,

            new_status:
                asset_status,

            remarks:
                `Asset updated. Status: ${asset_status}`

        });


        res.json({

            success: true,

            message:
                "Asset updated successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to update asset"

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

        console.error(error);

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
            "Spare",
            "Scrap",
            "Lost"

        ];


        const { status } =
            req.body;


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


        await assetModel.addAssetHistory({

            asset_id:
                req.params.id,

            employee_id: null,

            action_type:
                "Status Changed",

            old_status: null,

            new_status:
                status,

            remarks:
                `Asset status changed to ${status}`

        });


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


        await assetModel.addAssetHistory({

            asset_id:
                req.params.id,

            employee_id: null,

            action_type:
                "Scrapped",

            old_status: null,

            new_status:
                "Scrap",

            remarks:
                "Asset Scrapped"

        });


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

        const employeeId =
            req.body.employee_id;


        if (!employeeId) {

            return res.status(400).json({

                success: false,

                message:
                    "Employee is required"

            });

        }


        const result =
            await assetModel.assignAsset(

                req.params.id,

                employeeId

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


        await assetModel.addAssetHistory({

            asset_id:
                req.params.id,

            employee_id:
                employeeId,

            action_type:
                "Assigned",

            old_status: null,

            new_status:
                "Assigned",

            remarks:
                "Asset Assigned"

        });


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


        await assetModel.addAssetHistory({

            asset_id:
                req.params.id,

            employee_id: null,

            action_type:
                "Returned",

            old_status:
                "Assigned",

            new_status:
                "In Stock",

            remarks:
                "Asset Returned"

        });


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

    deleteAsset,

    updateAssetStatus,

    scrapAsset,

    assignAsset,

    returnAsset

};