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

// POST Add Asset
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

// PUT Update Asset
const updateAsset = async (req, res) => {

    console.log(req.body);
    console.log(req.params.id);

    try {

        const result = await assetModel.updateAsset(
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
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    getAssets,
    addAsset,
    updateAsset
};