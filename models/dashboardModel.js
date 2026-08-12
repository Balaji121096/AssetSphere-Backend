const db = require("../config/db");

// Dashboard Summary
const getDashboardSummary = async () => {

    // =========================
    // HARDWARE ASSET COUNTS
    // =========================

    const [[total]] = await db.query(`
        SELECT COUNT(*) AS total_assets
        FROM hardware_assets
    `);

    const [[assigned]] = await db.query(`
        SELECT COUNT(*) AS assigned_assets
        FROM hardware_assets
        WHERE asset_status = 'Assigned'
    `);

    const [[stock]] = await db.query(`
        SELECT COUNT(*) AS in_stock
        FROM hardware_assets
        WHERE asset_status = 'In Stock'
    `);

    const [[repair]] = await db.query(`
        SELECT COUNT(*) AS repair_assets
        FROM hardware_assets
        WHERE asset_status = 'Repair'
    `);

    const [[scrap]] = await db.query(`
        SELECT COUNT(*) AS scrap_assets
        FROM hardware_assets
        WHERE asset_status = 'Scrap'
    `);

    const [[lost]] = await db.query(`
        SELECT COUNT(*) AS lost_assets
        FROM hardware_assets
        WHERE asset_status = 'Lost'
    `);


    // =========================
    // SOFTWARE EXPIRY COUNTS
    // =========================

    const [[expired]] = await db.query(`
        SELECT COUNT(*) AS expired_software
        FROM software_products
        WHERE expiry_date IS NOT NULL
        AND expiry_date < CURDATE()
    `);


    const [[critical]] = await db.query(`
        SELECT COUNT(*) AS critical_software
        FROM software_products
        WHERE expiry_date IS NOT NULL
        AND DATEDIFF(DATE(expiry_date), CURDATE()) BETWEEN 0 AND 10
    `);


    const [[tenToTwenty]] = await db.query(`
        SELECT COUNT(*) AS ten_to_twenty_software
        FROM software_products
        WHERE expiry_date IS NOT NULL
        AND DATEDIFF(DATE(expiry_date), CURDATE()) BETWEEN 11 AND 20
    `);


    const [[twentyToThirty]] = await db.query(`
        SELECT COUNT(*) AS twenty_to_thirty_software
        FROM software_products
        WHERE expiry_date IS NOT NULL
        AND DATEDIFF(DATE(expiry_date), CURDATE()) BETWEEN 21 AND 30
    `);


    return {

        // Hardware
        total_assets: total.total_assets,
        assigned_assets: assigned.assigned_assets,
        in_stock: stock.in_stock,
        repair_assets: repair.repair_assets,
        scrap_assets: scrap.scrap_assets,
        lost_assets: lost.lost_assets,

        // Software Expiry
        expired_software: expired.expired_software,
        critical_software: critical.critical_software,
        ten_to_twenty_software:
            tenToTwenty.ten_to_twenty_software,
        twenty_to_thirty_software:
            twentyToThirty.twenty_to_thirty_software
    };
};


// Recent Asset History
const getRecentHistory = async () => {

    const [rows] = await db.query(`
        SELECT
            h.history_id,
            a.asset_code,
            a.asset_name,
            e.display_name AS employee_name,
            h.action_type,
            h.action_date,
            h.remarks

        FROM asset_history h

        LEFT JOIN hardware_assets a
            ON h.asset_id = a.asset_id

        LEFT JOIN employees e
            ON h.employee_id = e.employee_id

        ORDER BY h.action_date DESC

        LIMIT 10
    `);

    return rows;
};


module.exports = {
    getDashboardSummary,
    getRecentHistory
};