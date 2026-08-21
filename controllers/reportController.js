const reportModel = require("../models/reportModel");


// =====================================================
// BUILD FILTERS
// =====================================================

const getFilters = (req) => {

    return {
        from_date:
            req.query.from_date || null,

        to_date:
            req.query.to_date || null,

        status:
            req.query.status || null,

        category_id:
            req.query.category_id || null,

        employee_id:
            req.query.employee_id || null,

        department_id:
            req.query.department_id || null,

        location_id:
            req.query.location_id || null,

        vendor_id:
            req.query.vendor_id || null,

        search:
            req.query.search || null
    };
};


// =====================================================
// ALL ASSETS
// =====================================================

const getAllAssets = async (req, res) => {

    try {

        const filters = getFilters(req);

        const data =
            await reportModel.getAssetReport(filters);

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "Get All Assets Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// SUMMARY
// =====================================================

const getAssetReportSummary = async (req, res) => {

    try {

        const filters = getFilters(req);

        const summary =
            await reportModel.getAssetReportSummary(
                filters
            );

        res.json({
            success: true,
            data: summary
        });

    } catch (error) {

        console.error(
            "Get Asset Report Summary Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// ASSIGNED
// =====================================================

const getAssignedAssets = async (req, res) => {

    try {

        const filters = getFilters(req);

        filters.status = "Assigned";

        const data =
            await reportModel.getAssetReport(filters);

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "Get Assigned Assets Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// SCRAP
// =====================================================

const getScrapAssets = async (req, res) => {

    try {

        const filters = getFilters(req);

        filters.status = "Scrap";

        const data =
            await reportModel.getAssetReport(filters);

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "Get Scrap Assets Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// REPAIR
// =====================================================

const getRepairAssets = async (req, res) => {

    try {

        const filters = getFilters(req);

        filters.status = "Repair";

        const data =
            await reportModel.getAssetReport(filters);

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "Get Repair Assets Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// LOST
// =====================================================

const getLostAssets = async (req, res) => {

    try {

        const filters = getFilters(req);

        filters.status = "Lost";

        const data =
            await reportModel.getAssetReport(filters);

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "Get Lost Assets Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// EMPLOYEE ASSETS
// =====================================================

const getEmployeeAssets = async (req, res) => {

    try {

        const filters = getFilters(req);

        const data =
            await reportModel.getEmployeeAssets(
                filters
            );

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "Get Employee Assets Report Error:",
            error
        );

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

    getLostAssets,

    getEmployeeAssets

};