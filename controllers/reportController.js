const reportModel = require("../models/reportModel");

// All Assets Report
const getAllAssets = async (req, res) => {

    try {

        const data = await reportModel.getAllAssetsReport();

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Assigned Report
const getAssignedAssets = async (req, res) => {

    try {

        const data = await reportModel.getAssignedAssets();

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Scrap Report
const getScrapAssets = async (req, res) => {

    try {

        const data = await reportModel.getScrapAssets();

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Repair Report
const getRepairAssets = async (req, res) => {

    try {

        const data = await reportModel.getRepairAssets();

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Employee Assets Report
const getEmployeeAssets = async (req, res) => {

    try {

        const data = await reportModel.getEmployeeAssets();

        res.json({
            success: true,
            count: data.length,
            data
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
    getAllAssets,
    getAssignedAssets,
    getScrapAssets,
    getRepairAssets,
    getEmployeeAssets
};