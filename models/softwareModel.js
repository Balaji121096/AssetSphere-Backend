const db = require("../config/db");

// GET all software
const getAllSoftware = async () => {
    const [rows] = await db.query(`
        SELECT
            sp.software_id,
            sp.software_code,
            sp.software_name,
            sp.publisher,
            sp.version,
            sp.license_type,
            sp.total_licenses,
            sp.purchase_date,
            sp.expiry_date,

            DATEDIFF(
                DATE(sp.expiry_date),
                CURDATE()
            ) AS days_remaining,

            sp.cost,
            sp.vendor_id,
            v.vendor_name,
            sp.status,
            sp.description,
            sp.created_at,
            sp.updated_at

        FROM software_products sp

        LEFT JOIN vendors v
            ON sp.vendor_id = v.vendor_id

        ORDER BY sp.software_id ASC
    `);

    return rows;
};

// GET software by ID
const getSoftwareById = async (softwareId) => {
    const [rows] = await db.query(
        `
        SELECT
            sp.software_id,
            sp.software_code,
            sp.software_name,
            sp.publisher,
            sp.version,
            sp.license_type,
            sp.total_licenses,
            sp.purchase_date,
            sp.expiry_date,
            sp.cost,
            sp.vendor_id,
            v.vendor_name,
            sp.status,
            sp.description,
            sp.created_at,
            sp.updated_at
        FROM software_products sp
        LEFT JOIN vendors v
            ON sp.vendor_id = v.vendor_id
        WHERE sp.software_id = ?
        `,
        [softwareId]
    );

    return rows;
};

// ADD software
const addSoftware = async (software) => {
    const [result] = await db.query(
        `
        INSERT INTO software_products
        (
            software_code,
            software_name,
            publisher,
            version,
            license_type,
            total_licenses,
            purchase_date,
            expiry_date,
            cost,
            vendor_id,
            status,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            software.software_code,
            software.software_name,
            software.publisher || null,
            software.version || null,
            software.license_type || null,
            software.total_licenses || 0,
            software.purchase_date || null,
            software.expiry_date || null,
            software.cost || 0,
            software.vendor_id || null,
            software.status || "Active",
            software.description || null
        ]
    );

    return result;
};

// UPDATE software
const updateSoftware = async (softwareId, software) => {
    const [result] = await db.query(
        `
        UPDATE software_products
        SET
            software_code = ?,
            software_name = ?,
            publisher = ?,
            version = ?,
            license_type = ?,
            total_licenses = ?,
            purchase_date = ?,
            expiry_date = ?,
            cost = ?,
            vendor_id = ?,
            status = ?,
            description = ?
        WHERE software_id = ?
        `,
        [
            software.software_code,
            software.software_name,
            software.publisher || null,
            software.version || null,
            software.license_type || null,
            software.total_licenses || 0,
            software.purchase_date || null,
            software.expiry_date || null,
            software.cost || 0,
            software.vendor_id || null,
            software.status || "Active",
            software.description || null,
            softwareId
        ]
    );

    return result;
};

// DELETE software
const deleteSoftware = async (softwareId) => {
    const [result] = await db.query(
        `
        DELETE FROM software_products
        WHERE software_id = ?
        `,
        [softwareId]
    );

    return result;
};

// GET software expiry alerts
const getExpiryAlerts = async () => {

    const [rows] = await db.query(`
        SELECT
            sp.software_id,
            sp.software_code,
            sp.software_name,
            sp.publisher,
            sp.version,
            sp.license_type,
            sp.total_licenses,
            sp.expiry_date,
            sp.cost,
            sp.status,
            sp.vendor_id,
            v.vendor_name,

            DATEDIFF(
                DATE(sp.expiry_date),
                CURDATE()
            ) AS days_remaining,

            CASE

                WHEN sp.expiry_date < CURDATE()
                    THEN 'Expired'

                WHEN DATEDIFF(
                    DATE(sp.expiry_date),
                    CURDATE()
                ) BETWEEN 0 AND 10
                    THEN 'Critical'

                WHEN DATEDIFF(
                    DATE(sp.expiry_date),
                    CURDATE()
                ) BETWEEN 11 AND 20
                    THEN '10-20 Days'

                WHEN DATEDIFF(
                    DATE(sp.expiry_date),
                    CURDATE()
                ) BETWEEN 21 AND 30
                    THEN '20-30 Days'

                ELSE 'Active'

            END AS expiry_status

        FROM software_products sp

        LEFT JOIN vendors v
            ON sp.vendor_id = v.vendor_id

        WHERE
            sp.expiry_date IS NOT NULL
            AND (
                sp.expiry_date < CURDATE()
                OR DATEDIFF(
                    DATE(sp.expiry_date),
                    CURDATE()
                ) BETWEEN 0 AND 30
            )

        ORDER BY
            days_remaining ASC,
            sp.software_id ASC
    `);

    return rows;
};

module.exports = {
    getAllSoftware,
    getSoftwareById,
    addSoftware,
    updateSoftware,
    deleteSoftware,
    getExpiryAlerts
};