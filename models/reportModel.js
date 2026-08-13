const db = require("../config/db");


// =====================================================
// ALL ASSET REPORT
// =====================================================

const getAssetReport = async (filters = {}) => {

    let query = `
        SELECT
            a.asset_id,
            a.asset_code,
            a.asset_name,

            c.category_id,
            c.category_code,
            c.category_name,

            a.brand,
            a.model,
            a.serial_number,
            a.hostname,
            a.ip_address,
            a.mac_address,
            a.service_tag,

            a.processor,
            a.ram,
            a.storage,
            a.operating_system,

            a.purchase_date,
            a.purchase_cost,

            a.warranty_expiry,
            a.warranty_status,

            a.vendor_id,
            COALESCE(v.vendor_name, a.vendor_name) AS vendor_name,

            a.current_employee_id,
            e.employee_code,
            e.display_name AS employee_name,
            e.official_email AS employee_email,
            e.mobile_number AS employee_mobile,

            a.location_id,
            l.location_code,
            l.location_name,
            l.city,
            l.state,
            l.country,

            a.floor,

            a.asset_status,
            a.assigned_date,
            a.returned_date,
            a.remarks,

            a.created_at,
            a.updated_at

        FROM hardware_assets a

        LEFT JOIN asset_categories c
            ON a.category_id = c.category_id

        LEFT JOIN employees e
            ON a.current_employee_id = e.employee_id

        LEFT JOIN vendors v
            ON a.vendor_id = v.vendor_id

        LEFT JOIN office_locations l
            ON a.location_id = l.location_id

        WHERE 1 = 1
    `;

    const params = [];


    // STATUS FILTER
    if (filters.status) {

        query += `
            AND a.asset_status = ?
        `;

        params.push(filters.status);
    }


    // CATEGORY FILTER
    if (filters.category_id) {

        query += `
            AND a.category_id = ?
        `;

        params.push(filters.category_id);
    }


    // EMPLOYEE FILTER
    if (filters.employee_id) {

        query += `
            AND a.current_employee_id = ?
        `;

        params.push(filters.employee_id);
    }


    // SEARCH FILTER
    if (filters.search) {

        query += `
            AND (
                a.asset_code LIKE ?
                OR a.asset_name LIKE ?
                OR a.brand LIKE ?
                OR a.model LIKE ?
                OR a.serial_number LIKE ?
                OR a.hostname LIKE ?
                OR e.display_name LIKE ?
                OR e.employee_code LIKE ?
                OR v.vendor_name LIKE ?
                OR c.category_name LIKE ?
                OR l.location_name LIKE ?
            )
        `;

        const searchValue = `%${filters.search}%`;

        params.push(
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue
        );
    }


    query += `
        ORDER BY a.asset_id ASC
    `;


    const [rows] = await db.query(query, params);

    return rows;
};


// =====================================================
// ASSET REPORT SUMMARY
// =====================================================

const getAssetReportSummary = async () => {

    const [[summary]] = await db.query(`
        SELECT
            COUNT(*) AS total_assets,

            SUM(
                CASE
                    WHEN asset_status = 'Assigned'
                    THEN 1
                    ELSE 0
                END
            ) AS assigned_assets,

            SUM(
                CASE
                    WHEN asset_status = 'In Stock'
                    THEN 1
                    ELSE 0
                END
            ) AS in_stock_assets,

            SUM(
                CASE
                    WHEN asset_status = 'Repair'
                    THEN 1
                    ELSE 0
                END
            ) AS repair_assets,

            SUM(
                CASE
                    WHEN asset_status = 'Scrap'
                    THEN 1
                    ELSE 0
                END
            ) AS scrap_assets,

            SUM(
                CASE
                    WHEN asset_status = 'Lost'
                    THEN 1
                    ELSE 0
                END
            ) AS lost_assets

        FROM hardware_assets
    `);


    return {
        total_assets: Number(summary.total_assets || 0),
        assigned_assets: Number(summary.assigned_assets || 0),
        in_stock_assets: Number(summary.in_stock_assets || 0),
        repair_assets: Number(summary.repair_assets || 0),
        scrap_assets: Number(summary.scrap_assets || 0),
        lost_assets: Number(summary.lost_assets || 0)
    };
};


// =====================================================
// ASSIGNED ASSETS REPORT
// =====================================================

const getAssignedAssets = async () => {

    const [rows] = await db.query(`
        SELECT
            a.asset_id,
            a.asset_code,
            a.asset_name,
            c.category_name,
            a.brand,
            a.model,
            a.serial_number,

            e.employee_id,
            e.employee_code,
            e.display_name AS employee_name,
            e.official_email AS employee_email,
            e.mobile_number AS employee_mobile,

            a.assigned_date,
            a.asset_status

        FROM hardware_assets a

        LEFT JOIN asset_categories c
            ON a.category_id = c.category_id

        LEFT JOIN employees e
            ON a.current_employee_id = e.employee_id

        WHERE a.asset_status = 'Assigned'

        ORDER BY a.asset_id ASC
    `);

    return rows;
};


// =====================================================
// SCRAP ASSETS REPORT
// =====================================================

const getScrapAssets = async () => {

    const [rows] = await db.query(`
        SELECT
            a.asset_id,
            a.asset_code,
            a.asset_name,
            c.category_name,
            a.brand,
            a.model,
            a.serial_number,

            a.purchase_date,
            a.purchase_cost,

            a.asset_status,
            a.remarks,

            v.vendor_name,

            l.location_name,
            l.city,
            l.state

        FROM hardware_assets a

        LEFT JOIN asset_categories c
            ON a.category_id = c.category_id

        LEFT JOIN vendors v
            ON a.vendor_id = v.vendor_id

        LEFT JOIN office_locations l
            ON a.location_id = l.location_id

        WHERE a.asset_status = 'Scrap'

        ORDER BY a.asset_id ASC
    `);

    return rows;
};


// =====================================================
// REPAIR ASSETS REPORT
// =====================================================

const getRepairAssets = async () => {

    const [rows] = await db.query(`
        SELECT
            a.asset_id,
            a.asset_code,
            a.asset_name,
            c.category_name,
            a.brand,
            a.model,
            a.serial_number,

            a.purchase_date,
            a.purchase_cost,

            a.asset_status,
            a.remarks,

            v.vendor_name,

            l.location_name,
            l.city,
            l.state

        FROM hardware_assets a

        LEFT JOIN asset_categories c
            ON a.category_id = c.category_id

        LEFT JOIN vendors v
            ON a.vendor_id = v.vendor_id

        LEFT JOIN office_locations l
            ON a.location_id = l.location_id

        WHERE a.asset_status = 'Repair'

        ORDER BY a.asset_id ASC
    `);

    return rows;
};


// =====================================================
// EMPLOYEE ASSETS REPORT
// =====================================================

const getEmployeeAssets = async () => {

    const [rows] = await db.query(`
        SELECT
            e.employee_id,
            e.employee_code,
            e.display_name AS employee_name,
            e.official_email AS employee_email,
            e.mobile_number AS employee_mobile,

            a.asset_id,
            a.asset_code,
            a.asset_name,

            c.category_name,

            a.brand,
            a.model,
            a.serial_number,

            a.assigned_date,
            a.asset_status

        FROM employees e

        INNER JOIN hardware_assets a
            ON e.employee_id = a.current_employee_id

        LEFT JOIN asset_categories c
            ON a.category_id = c.category_id

        ORDER BY
            e.employee_id ASC,
            a.asset_id ASC
    `);

    return rows;
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getAssetReport,
    getAssetReportSummary,
    getAssignedAssets,
    getScrapAssets,
    getRepairAssets,
    getEmployeeAssets

};