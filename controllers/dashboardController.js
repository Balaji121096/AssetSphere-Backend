const dashboardModel = require("../models/dashboardModel");

// Dashboard Summary
const getDashboard = async (req, res) => {

    try {

        const dashboard = await dashboardModel.getDashboardSummary();

        res.json({
            success: true,
            data: dashboard
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Recent Asset History
const getRecentHistory = async (req, res) => {

    try {

        const history = await dashboardModel.getRecentHistory();

        res.json({
            success: true,
            count: history.length,
            data: history
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
    getDashboard,
    getRecentHistory
};