const assetModel = require("../models/assetModel");

// GET All Assets
const getAssets = async (req, res) => {

    try {

        const assets = await assetModel.getAllAssets();

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

// ADD Asset
const addAsset = async (req, res) => {

    try {

        const result = await assetModel.addAsset(req.body);

        res.status(201).json({
            success: true,
            message: "Asset added successfully",
            asset_id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// UPDATE Asset
const updateAsset = async (req, res) => {

    try {

        const result = await assetModel.updateAsset(req.params.id, req.body);

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
            message: "Internal Server Error"
        });

    }

};

// SCRAP Asset
const scrapAsset = async (req, res) => {

    try {

        const result = await assetModel.scrapAsset(req.params.id);

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
            message: "Internal Server Error"
        });

    }

};

// ASSIGN Asset
const assignAsset = async (req, res) => {

    try {

        const result = await assetModel.assignAsset(
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
            message: "Internal Server Error"
        });

    }

};

// RETURN Asset
const returnAsset = async (req, res) => {

    try {

        const result = await assetModel.returnAsset(req.params.id);

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
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    getAssets,
    addAsset,
    updateAsset,
    scrapAsset,
    assignAsset,
    returnAsset
};