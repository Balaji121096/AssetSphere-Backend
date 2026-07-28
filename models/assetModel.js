const db = require("../config/db");

// GET All Assets
const getAllAssets = async () => {

    const [rows] = await db.query(`
        SELECT
            h.asset_id,
            h.asset_code,
            h.asset_name,
            h.brand,
            h.model,
            h.serial_number,
            c.category_name,
            e.display_name,
            v.vendor_name,
            l.location_name,
            h.asset_status
        FROM hardware_assets h
        LEFT JOIN asset_categories c
            ON h.category_id = c.category_id
        LEFT JOIN employees e
            ON h.current_employee_id = e.employee_id
        LEFT JOIN vendors v
            ON h.vendor_id = v.vendor_id
        LEFT JOIN office_locations l
            ON h.location_id = l.location_id
        ORDER BY h.asset_code ASC
    `);

    return rows;
};

// POST Add Asset
const addAsset = async (asset) => {

    const [result] = await db.query(`
        INSERT INTO hardware_assets
        (
            asset_code,
            category_id,
            asset_name,
            brand,
            model,
            serial_number,
            vendor_id,
            location_id,
            asset_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        asset.asset_code,
        asset.category_id,
        asset.asset_name,
        asset.brand,
        asset.model,
        asset.serial_number,
        asset.vendor_id,
        asset.location_id,
        asset.asset_status
    ]);

    return result;
};

// PUT Update Asset
const updateAsset = async (id, asset) => {

    const [result] = await db.query(`
        UPDATE hardware_assets
        SET
            asset_code = ?,
            category_id = ?,
            asset_name = ?,
            brand = ?,
            model = ?,
            serial_number = ?,
            vendor_id = ?,
            location_id = ?,
            asset_status = ?
        WHERE asset_id = ?
    `, [
        asset.asset_code,
        asset.category_id,
        asset.asset_name,
        asset.brand,
        asset.model,
        asset.serial_number,
        asset.vendor_id,
        asset.location_id,
        asset.asset_status,
        id
    ]);

    return result;
};

module.exports = {
    getAllAssets,
    addAsset,
    updateAsset
};