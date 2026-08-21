const db = require("../config/db");

// =====================================================
// GET ALL ASSETS
// =====================================================

const getAllAssets = async () => {

    const [rows] = await db.query(`
        SELECT
            h.asset_id,
            h.asset_code,
            h.asset_name,
            h.brand,
            h.model,
            h.serial_number,

            h.category_id,
            h.vendor_id,
            h.location_id,
            h.current_employee_id,

            c.category_name,
            e.display_name,
            v.vendor_name,
            l.location_name,

            h.asset_status,
            h.assigned_date,
            h.returned_date

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


// =====================================================
// GET ASSET BY ID
// =====================================================

const getAssetById = async (id) => {

    const [rows] = await db.query(`
        SELECT
            h.asset_id,
            h.asset_code,
            h.asset_name,
            h.brand,
            h.model,
            h.serial_number,

            h.category_id,
            h.vendor_id,
            h.location_id,
            h.current_employee_id,

            c.category_name,
            e.display_name,
            v.vendor_name,
            l.location_name,

            h.asset_status,
            h.assigned_date,
            h.returned_date

        FROM hardware_assets h

        LEFT JOIN asset_categories c
            ON h.category_id = c.category_id

        LEFT JOIN employees e
            ON h.current_employee_id = e.employee_id

        LEFT JOIN vendors v
            ON h.vendor_id = v.vendor_id

        LEFT JOIN office_locations l
            ON h.location_id = l.location_id

        WHERE h.asset_id = ?
    `, [id]);

    return rows[0];
};


// =====================================================
// ADD ASSET
// =====================================================

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
        asset.asset_status || "In Stock"
    ]);

    return result;
};


// =====================================================
// UPDATE ASSET
// =====================================================

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
        asset.category_id || null,
        asset.asset_name,
        asset.brand || null,
        asset.model || null,
        asset.serial_number || null,
        asset.vendor_id || null,
        asset.location_id || null,
        asset.asset_status || "In Stock",
        id
    ]);

    return result;
};


// =====================================================
// DELETE ASSET
// =====================================================

const deleteAsset = async (id) => {

    const [result] = await db.query(`
        DELETE FROM hardware_assets
        WHERE asset_id = ?
    `, [id]);

    return result;
};


// =====================================================
// CHANGE STATUS
// =====================================================

const updateAssetStatus = async (id, status) => {

    const [result] = await db.query(`
        UPDATE hardware_assets
        SET asset_status = ?
        WHERE asset_id = ?
    `, [
        status,
        id
    ]);

    return result;
};


// =====================================================
// SCRAP ASSET
// =====================================================

const scrapAsset = async (id) => {

    const [result] = await db.query(`
        UPDATE hardware_assets
        SET
            asset_status = 'Scrap',
            current_employee_id = NULL
        WHERE asset_id = ?
    `, [id]);

    return result;
};


// =====================================================
// ASSIGN ASSET
// =====================================================

const assignAsset = async (assetId, employeeId) => {

    const [result] = await db.query(`
        UPDATE hardware_assets
        SET
            current_employee_id = ?,
            assigned_date = CURDATE(),
            returned_date = NULL,
            asset_status = 'Assigned'
        WHERE asset_id = ?
    `, [
        employeeId,
        assetId
    ]);

    return result;
};


// =====================================================
// RETURN ASSET
// =====================================================

const returnAsset = async (assetId) => {

    const [result] = await db.query(`
        UPDATE hardware_assets
        SET
            current_employee_id = NULL,
            returned_date = CURDATE(),
            asset_status = 'In Stock'
        WHERE asset_id = ?
    `, [assetId]);

    return result;
};


// =====================================================
// ASSET HISTORY
// =====================================================

const addAssetHistory = async (
    assetId,
    employeeId,
    actionType,
    remarks = null
) => {

    await db.query(`
        INSERT INTO asset_history
        (
            asset_id,
            employee_id,
            action_type,
            action_date,
            remarks
        )
        VALUES (?, ?, ?, NOW(), ?)
    `, [
        assetId,
        employeeId,
        actionType,
        remarks
    ]);
};


module.exports = {
    getAllAssets,
    getAssetById,
    addAsset,
    updateAsset,
    deleteAsset,
    updateAssetStatus,
    scrapAsset,
    assignAsset,
    returnAsset,
    addAssetHistory
};