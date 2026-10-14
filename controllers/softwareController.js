const softwareModel = require("../models/softwareModel");

// GET All Software
const getSoftware = async (req, res) => {
    try {

        const software =
            await softwareModel.getAllSoftware();

        res.json({
            success: true,
            count: software.length,
            data: software
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// GET Software By ID
const getSoftwareById = async (req, res) => {
    try {

        const software =
            await softwareModel.getSoftwareById(
                req.params.id
            );

        if (software.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Software not found"
            });

        }

        res.json({
            success: true,
            data: software[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// ADD Software
const addSoftware = async (req, res) => {
    try {

        const result =
            await softwareModel.addSoftware(req.body);

        res.status(201).json({
            success: true,
            message: "Software added successfully",
            software_id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// UPDATE Software
const updateSoftware = async (req, res) => {
    try {

        const result =
            await softwareModel.updateSoftware(
                req.params.id,
                req.body
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Software not found"
            });

        }

        res.json({
            success: true,
            message: "Software updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// DELETE Software
const deleteSoftware = async (req, res) => {
    try {

        const result =
            await softwareModel.deleteSoftware(
                req.params.id
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Software not found"
            });

        }

        res.json({
            success: true,
            message: "Software deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// GET Software Expiry Alerts
const getExpiryAlerts = async (req, res) => {
    try {

        const alerts =
            await softwareModel.getExpiryAlerts();

        res.json({
            success: true,
            count: alerts.length,
            data: alerts
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// GET Software Summary (total qty, total cost, avg cost)
const getSoftwareSummary = async (req, res) => {
    try {

        const month = req.query.month
            ? parseInt(req.query.month, 10)
            : null;

        const year = req.query.year
            ? parseInt(req.query.year, 10)
            : null;

        // Validate month range
        if (
            month !== null &&
            (Number.isNaN(month) || month < 1 || month > 12)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid month. Must be 1–12."
            });
        }

        // Validate year range
        if (
            year !== null &&
            (Number.isNaN(year) || year < 2000 || year > 2100)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid year."
            });
        }

        const summary = await softwareModel.getSoftwareSummary(
            month,
            year
        );

        res.json({
            success: true,
            data: {
                total_qty: Number(summary.total_qty) || 0,
                total_cost: Number(summary.total_cost) || 0,
                avg_cost: Number(summary.avg_cost) || 0
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


// EXPORT
module.exports = {
    getSoftware,
    getSoftwareById,
    addSoftware,
    updateSoftware,
    deleteSoftware,
    getExpiryAlerts,
    getSoftwareSummary
};