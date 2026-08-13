const reportModel = require("../models/reportModel");


// =====================================================
// ALL ASSETS REPORT
// =====================================================

const getAllAssets = async (req, res) => {

    try {

        const filters = {
            status: req.query.status || null,
            category_id: req.query.category_id || null,
            employee_id: req.query.employee_id || null,
            search: req.query.search || null
        };

        const data = await reportModel.getAssetReport(filters);

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error("Get All Assets Report Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// ASSET REPORT SUMMARY
// =====================================================

const getAssetReportSummary = async (req, res) => {

    try {

        const summary =
            await reportModel.getAssetReportSummary();

        res.json({
            success: true,
            data: summary
        });

    } catch (error) {

        console.error("Get Asset Report Summary Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// ASSIGNED ASSETS REPORT
// =====================================================

const getAssignedAssets = async (req, res) => {

    try {

        const data =
            await reportModel.getAssignedAssets();

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error("Get Assigned Assets Report Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// SCRAP ASSETS REPORT
// =====================================================

const getScrapAssets = async (req, res) => {

    try {

        const data =
            await reportModel.getScrapAssets();

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error("Get Scrap Assets Report Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// REPAIR ASSETS REPORT
// =====================================================

const getRepairAssets = async (req, res) => {

    try {

        const data =
            await reportModel.getRepairAssets();

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error("Get Repair Assets Report Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// EMPLOYEE ASSETS REPORT
// =====================================================

const getEmployeeAssets = async (req, res) => {

    try {

        const data =
            await reportModel.getEmployeeAssets();

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error("Get Employee Assets Report Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getAllAssets,
    getAssetReportSummary,
    getAssignedAssets,
    getScrapAssets,
    getRepairAssets,
    getEmployeeAssets

};