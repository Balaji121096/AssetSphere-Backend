const db = require("../config/db");


// =====================================================
// COMMON WHERE BUILDER
// =====================================================

const buildAssetFilters = (filters = {}) => {

    let where = `
        WHERE 1 = 1
    `;

    const params = [];


    // STATUS
    if (filters.status) {

        where += `
            AND a.asset_status = ?
        `;

        params.push(filters.status);
    }


    // CATEGORY
    if (filters.category_id) {

        where += `
            AND a.category_id = ?
        `;

        params.push(filters.category_id);
    }


    // EMPLOYEE
    if (filters.employee_id) {

        where += `
            AND a.current_employee_id = ?
        `;

        params.push(filters.employee_id);
    }


    // DEPARTMENT
    if (filters.department_id) {

        where += `
            AND e.department_id = ?
        `;

        params.push(filters.department_id);
    }


    // LOCATION
    if (filters.location_id) {

        where += `
            AND a.location_id = ?
        `;

        params.push(filters.location_id);
    }


    // VENDOR
    if (filters.vendor_id) {

        where += `
            AND a.vendor_id = ?
        `;

        params.push(filters.vendor_id);
    }


    // FROM DATE
    if (filters.from_date) {

        where += `
            AND DATE(a.purchase_date) >= ?
        `;

        params.push(filters.from_date);
    }


    // TO DATE
    if (filters.to_date) {

        where += `
            AND DATE(a.purchase_date) <= ?
        `;

        params.push(filters.to_date);
    }


    // SEARCH
    if (filters.search) {

        where += `
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

        const searchValue =
            `%${filters.search}%`;

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


    return {

        where,

        params

    };
};



// =====================================================
// ALL ASSET REPORT
// =====================================================

const getAssetReport = async (
    filters = {}
) => {

    const {

        where,

        params

    } = buildAssetFilters(filters);


    const query = `

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

            COALESCE(
                v.vendor_name,
                a.vendor_name
            ) AS vendor_name,

            a.current_employee_id,

            e.employee_code,

            e.display_name AS employee_name,

            e.official_email AS employee_email,

            e.mobile_number AS employee_mobile,

            e.department_id,

            d.department_name,

            e.designation_id,

            ds.designation_name,

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

            ON a.category_id =
               c.category_id


        LEFT JOIN employees e

            ON a.current_employee_id =
               e.employee_id


        LEFT JOIN departments d

            ON e.department_id =
               d.department_id


        LEFT JOIN designations ds

            ON e.designation_id =
               ds.designation_id


        LEFT JOIN vendors v

            ON a.vendor_id =
               v.vendor_id


        LEFT JOIN office_locations l

            ON a.location_id =
               l.location_id


        ${where}


        ORDER BY

            a.asset_id ASC

    `;


    const [rows] =
        await db.query(
            query,
            params
        );


    return rows;
};



// =====================================================
// ASSET SUMMARY
// =====================================================

const getAssetReportSummary = async (
    filters = {}
) => {

    const {

        where,

        params

    } = buildAssetFilters(filters);


    const query = `

        SELECT

            COUNT(*) AS total_assets,


            SUM(

                CASE

                    WHEN a.asset_status = 'Assigned'

                    THEN 1

                    ELSE 0

                END

            ) AS assigned_assets,


            SUM(

                CASE

                    WHEN a.asset_status = 'In Stock'

                    THEN 1

                    ELSE 0

                END

            ) AS in_stock_assets,


            SUM(

                CASE

                    WHEN a.asset_status = 'Repair'

                    THEN 1

                    ELSE 0

                END

            ) AS repair_assets,


            SUM(

                CASE

                    WHEN a.asset_status = 'Scrap'

                    THEN 1

                    ELSE 0

                END

            ) AS scrap_assets,


            SUM(

                CASE

                    WHEN a.asset_status = 'Lost'

                    THEN 1

                    ELSE 0

                END

            ) AS lost_assets,


            COALESCE(

                SUM(a.purchase_cost),

                0

            ) AS total_asset_value,


            COALESCE(

                AVG(a.purchase_cost),

                0

            ) AS average_asset_cost,


            COALESCE(

                MAX(a.purchase_cost),

                0

            ) AS highest_asset_cost,


            COALESCE(

                MIN(a.purchase_cost),

                0

            ) AS lowest_asset_cost


        FROM hardware_assets a


        LEFT JOIN asset_categories c

            ON a.category_id =
               c.category_id


        LEFT JOIN employees e

            ON a.current_employee_id =
               e.employee_id


        LEFT JOIN vendors v

            ON a.vendor_id =
               v.vendor_id


        LEFT JOIN office_locations l

            ON a.location_id =
               l.location_id


        ${where}

    `;


    const [[summary]] =
        await db.query(

            query,

            params

        );


    return {

        total_assets:
            Number(
                summary.total_assets || 0
            ),

        assigned_assets:
            Number(
                summary.assigned_assets || 0
            ),

        in_stock_assets:
            Number(
                summary.in_stock_assets || 0
            ),

        repair_assets:
            Number(
                summary.repair_assets || 0
            ),

        scrap_assets:
            Number(
                summary.scrap_assets || 0
            ),

        lost_assets:
            Number(
                summary.lost_assets || 0
            ),

        total_asset_value:
            Number(
                summary.total_asset_value || 0
            ),

        average_asset_cost:
            Number(
                summary.average_asset_cost || 0
            ),

        highest_asset_cost:
            Number(
                summary.highest_asset_cost || 0
            ),

        lowest_asset_cost:
            Number(
                summary.lowest_asset_cost || 0
            )

    };
};



// =====================================================
// EMPLOYEE ASSETS
// =====================================================

const getEmployeeAssets = async (
    filters = {}
) => {

    let query = `

        SELECT

            e.employee_id,

            e.employee_code,

            e.display_name AS employee_name,

            e.official_email AS employee_email,

            e.mobile_number AS employee_mobile,

            e.department_id,

            d.department_name,

            e.designation_id,

            ds.designation_name,

            a.asset_id,

            a.asset_code,

            a.asset_name,

            c.category_name,

            a.brand,

            a.model,

            a.serial_number,

            a.assigned_date,

            a.returned_date,

            a.asset_status,

            a.purchase_cost,

            l.location_name


        FROM employees e


        INNER JOIN hardware_assets a

            ON e.employee_id =
               a.current_employee_id


        LEFT JOIN asset_categories c

            ON a.category_id =
               c.category_id


        LEFT JOIN departments d

            ON e.department_id =
               d.department_id


        LEFT JOIN designations ds

            ON e.designation_id =
               ds.designation_id


        LEFT JOIN office_locations l

            ON a.location_id =
               l.location_id


        WHERE 1 = 1

    `;


    const params = [];


    if (filters.employee_id) {

        query += `

            AND e.employee_id = ?

        `;

        params.push(
            filters.employee_id
        );

    }


    if (filters.department_id) {

        query += `

            AND e.department_id = ?

        `;

        params.push(
            filters.department_id
        );

    }


    if (filters.category_id) {

        query += `

            AND a.category_id = ?

        `;

        params.push(
            filters.category_id
        );

    }


    if (filters.location_id) {

        query += `

            AND a.location_id = ?

        `;

        params.push(
            filters.location_id
        );

    }


    if (filters.status) {

        query += `

            AND a.asset_status = ?

        `;

        params.push(
            filters.status
        );

    }


    if (filters.from_date) {

        query += `

            AND DATE(a.assigned_date) >= ?

        `;

        params.push(
            filters.from_date
        );

    }


    if (filters.to_date) {

        query += `

            AND DATE(a.assigned_date) <= ?

        `;

        params.push(
            filters.to_date
        );

    }


    if (filters.search) {

        query += `

            AND (

                e.employee_code LIKE ?

                OR e.display_name LIKE ?

                OR a.asset_code LIKE ?

                OR a.asset_name LIKE ?

                OR c.category_name LIKE ?

                OR d.department_name LIKE ?

            )

        `;

        const value =
            `%${filters.search}%`;


        params.push(

            value,
            value,
            value,
            value,
            value,
            value

        );

    }


    query += `

        ORDER BY

            e.employee_id ASC,

            a.asset_id ASC

    `;


    const [rows] =
        await db.query(

            query,

            params

        );


    return rows;
};



// =====================================================
// PURCHASE REPORT
// =====================================================
//
// IMPORTANT:
// Purchase Report uses purchase_orders.
// It must NOT use hardware_assets.
//
// =====================================================

const getPurchaseReport = async (
    filters = {}
) => {

    let query = `

        SELECT

            p.purchase_id,

            p.po_number,

            p.invoice_number,

            p.vendor_id,

            v.vendor_code,

            v.vendor_name,

            p.product_category,

            p.product_name,

            p.product_description,

            p.purchase_date,

            p.amount,

            p.payment_status,

            p.warranty_expiry,

            p.remarks,

            p.po_document,

            p.invoice_document,

            p.created_at,

            p.updated_at

        FROM purchase_orders p


        LEFT JOIN vendors v

            ON p.vendor_id =
               v.vendor_id


        WHERE 1 = 1

    `;


    const params = [];


    // =================================================
    // FROM DATE
    // =================================================

    if (filters.from_date) {

        query += `

            AND DATE(p.purchase_date) >= ?

        `;

        params.push(
            filters.from_date
        );

    }


    // =================================================
    // TO DATE
    // =================================================

    if (filters.to_date) {

        query += `

            AND DATE(p.purchase_date) <= ?

        `;

        params.push(
            filters.to_date
        );

    }


    // =================================================
    // PAYMENT STATUS
    // =================================================

    if (filters.payment_status) {

        query += `

            AND p.payment_status = ?

        `;

        params.push(
            filters.payment_status
        );

    }


    // =================================================
    // PRODUCT CATEGORY
    // =================================================

    if (filters.product_category) {

        query += `

            AND p.product_category = ?

        `;

        params.push(
            filters.product_category
        );

    }


    // =================================================
    // VENDOR
    // =================================================

    if (filters.vendor_id) {

        query += `

            AND p.vendor_id = ?

        `;

        params.push(
            filters.vendor_id
        );

    }


    // =================================================
    // SEARCH
    // =================================================

    if (filters.search) {

        query += `

            AND (

                p.po_number LIKE ?

                OR p.invoice_number LIKE ?

                OR p.product_name LIKE ?

                OR p.product_description LIKE ?

                OR p.remarks LIKE ?

                OR v.vendor_code LIKE ?

                OR v.vendor_name LIKE ?

            )

        `;


        const value =
            `%${filters.search}%`;


        params.push(

            value,
            value,
            value,
            value,
            value,
            value,
            value

        );

    }


    // =================================================
    // ORDER
    // =================================================

    query += `

        ORDER BY

            p.purchase_date DESC,

            p.purchase_id DESC

    `;


    const [rows] =
        await db.query(

            query,

            params

        );


    return rows;
};



// =====================================================
// PURCHASE REPORT SUMMARY
// =====================================================
//
// This summary uses the SAME filters and SAME
// purchase_orders table as getPurchaseReport().
//
// =====================================================

const getPurchaseReportSummary = async (
    filters = {}
) => {

    let query = `

        SELECT

            COUNT(*) AS total_purchases,

            COALESCE(
                SUM(p.amount),
                0
            ) AS total_purchase_amount,

            COALESCE(
                AVG(p.amount),
                0
            ) AS average_purchase_amount,

            COALESCE(
                MAX(p.amount),
                0
            ) AS highest_purchase_amount,

            COALESCE(
                MIN(p.amount),
                0
            ) AS lowest_purchase_amount,

            SUM(
                CASE
                    WHEN p.payment_status = 'Pending'
                    THEN 1
                    ELSE 0
                END
            ) AS pending_purchases,

            SUM(
                CASE
                    WHEN p.payment_status = 'Paid'
                    THEN 1
                    ELSE 0
                END
            ) AS paid_purchases,

            SUM(
                CASE
                    WHEN p.payment_status = 'Partially Paid'
                    THEN 1
                    ELSE 0
                END
            ) AS partially_paid_purchases,

            SUM(
                CASE
                    WHEN p.payment_status = 'Cancelled'
                    THEN 1
                    ELSE 0
                END
            ) AS cancelled_purchases

        FROM purchase_orders p


        LEFT JOIN vendors v

            ON p.vendor_id =
               v.vendor_id


        WHERE 1 = 1

    `;


    const params = [];


    // =================================================
    // FROM DATE
    // =================================================

    if (filters.from_date) {

        query += `

            AND DATE(p.purchase_date) >= ?

        `;

        params.push(
            filters.from_date
        );

    }


    // =================================================
    // TO DATE
    // =================================================

    if (filters.to_date) {

        query += `

            AND DATE(p.purchase_date) <= ?

        `;

        params.push(
            filters.to_date
        );

    }


    // =================================================
    // PAYMENT STATUS
    // =================================================

    if (filters.payment_status) {

        query += `

            AND p.payment_status = ?

        `;

        params.push(
            filters.payment_status
        );

    }


    // =================================================
    // PRODUCT CATEGORY
    // =================================================

    if (filters.product_category) {

        query += `

            AND p.product_category = ?

        `;

        params.push(
            filters.product_category
        );

    }


    // =================================================
    // VENDOR
    // =================================================

    if (filters.vendor_id) {

        query += `

            AND p.vendor_id = ?

        `;

        params.push(
            filters.vendor_id
        );

    }


    // =================================================
    // SEARCH
    // =================================================

    if (filters.search) {

        query += `

            AND (

                p.po_number LIKE ?

                OR p.invoice_number LIKE ?

                OR p.product_name LIKE ?

                OR p.product_description LIKE ?

                OR p.remarks LIKE ?

                OR v.vendor_code LIKE ?

                OR v.vendor_name LIKE ?

            )

        `;


        const value =
            `%${filters.search}%`;


        params.push(

            value,
            value,
            value,
            value,
            value,
            value,
            value

        );

    }


    const [[summary]] =
        await db.query(

            query,

            params

        );


    return {

        total_purchases:
            Number(
                summary.total_purchases || 0
            ),

        total_purchase_amount:
            Number(
                summary.total_purchase_amount || 0
            ),

        average_purchase_amount:
            Number(
                summary.average_purchase_amount || 0
            ),

        highest_purchase_amount:
            Number(
                summary.highest_purchase_amount || 0
            ),

        lowest_purchase_amount:
            Number(
                summary.lowest_purchase_amount || 0
            ),

        pending_purchases:
            Number(
                summary.pending_purchases || 0
            ),

        paid_purchases:
            Number(
                summary.paid_purchases || 0
            ),

        partially_paid_purchases:
            Number(
                summary.partially_paid_purchases || 0
            ),

        cancelled_purchases:
            Number(
                summary.cancelled_purchases || 0
            )

    };
};



// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getAssetReport,

    getAssetReportSummary,

    getEmployeeAssets,

    getPurchaseReport,

    getPurchaseReportSummary

};