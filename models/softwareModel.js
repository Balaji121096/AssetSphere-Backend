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

module.exports = {
    getAllSoftware,
    getSoftwareById,
    addSoftware,
    updateSoftware,
    deleteSoftware
};