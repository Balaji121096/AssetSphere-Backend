const db = require("../config/db");

// All Assets Report
const getAllAssetsReport = async () => {

    const [rows] = await db.query(`
        SELECT
            h.asset_code,
            h.asset_name,
            h.brand,
            h.model,
            c.category_name,
            e.display_name AS employee_name,
            l.location_name,
            h.asset_status
        FROM hardware_assets h
        LEFT JOIN asset_categories c
            ON h.category_id = c.category_id
        LEFT JOIN employees e
            ON h.current_employee_id = e.employee_id
        LEFT JOIN office_locations l
            ON h.location_id = l.location_id
        ORDER BY h.asset_code ASC
    `);

    return rows;

};

// Assigned Assets
const getAssignedAssets = async () => {

    const [rows] = await db.query(`
        SELECT
            h.asset_code,
            h.asset_name,
            e.display_name AS employee_name,
            h.assigned_date
        FROM hardware_assets h
        LEFT JOIN employees e
            ON h.current_employee_id = e.employee_id
        WHERE h.asset_status='Assigned'
        ORDER BY h.asset_code
    `);

    return rows;

};

// Scrap Assets
const getScrapAssets = async () => {

    const [rows] = await db.query(`
        SELECT
            asset_code,
            asset_name,
            brand,
            model,
            updated_at
        FROM hardware_assets
        WHERE asset_status='Scrap'
        ORDER BY updated_at DESC
    `);

    return rows;

};

// Repair Assets
const getRepairAssets = async () => {

    const [rows] = await db.query(`
        SELECT
            asset_code,
            asset_name,
            brand,
            model,
            remarks
        FROM hardware_assets
        WHERE asset_status='Repair'
        ORDER BY asset_code
    `);

    return rows;

};

// Employee Wise Assets
const getEmployeeAssets = async () => {

    const [rows] = await db.query(`
        SELECT
            e.display_name,
            h.asset_code,
            h.asset_name,
            h.asset_status
        FROM hardware_assets h
        INNER JOIN employees e
            ON h.current_employee_id = e.employee_id
        ORDER BY e.display_name
    `);

    return rows;

};

module.exports = {
    getAllAssetsReport,
    getAssignedAssets,
    getScrapAssets,
    getRepairAssets,
    getEmployeeAssets
};