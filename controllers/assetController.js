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

        const result =
            await assetModel.addAsset(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Asset added successfully",
            asset_id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add asset"
        });

    }

};


// =====================================================
// UPDATE ASSET
// =====================================================

const updateAsset = async (req, res) => {

    try {

        const result =
            await assetModel.updateAsset(
                req.params.id,
                req.body
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });

        }

        res.json({
            success: true,
            message: "Asset updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update asset"
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

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });

        }

        res.json({
            success: true,
            message: "Asset deleted successfully"
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

const updateAssetStatus = async (req, res) => {

    try {

        const allowedStatuses = [
            "Assigned",
            "In Stock",
            "Repair",
            "Scrap",
            "Lost"
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid asset status"
            });

        }

        const result =
            await assetModel.updateAssetStatus(
                req.params.id,
                status
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Asset not found"
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
            message: "Asset status updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update asset status"
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

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Asset not found"
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
            message: "Asset moved to Scrap successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to scrap asset"
        });

    }

};


// =====================================================
// ASSIGN ASSET
// =====================================================

const assignAsset = async (req, res) => {

    try {

        const result =
            await assetModel.assignAsset(
                req.params.id,
                req.body.employee_id
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Asset not found"
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
            message: "Asset assigned successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to assign asset"
        });

    }

};


// =====================================================
// RETURN ASSET
// =====================================================

const returnAsset = async (req, res) => {

    try {

        const result =
            await assetModel.returnAsset(
                req.params.id
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Asset not found"
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
            message: "Asset returned successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to return asset"
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