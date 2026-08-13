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


// EXPORT
module.exports = {
    getSoftware,
    getSoftwareById,
    addSoftware,
    updateSoftware,
    deleteSoftware,
    getExpiryAlerts
};