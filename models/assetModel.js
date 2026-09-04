const db = require("../config/db");


// =====================================================
// GET ALL ASSETS
// =====================================================

const getAllAssets = async () => {

    const [rows] = await db.query(`
        SELECT
            h.asset_id,
            h.asset_code,

            h.asset_type,
            h.asset_name,

            h.category_id,
            c.category_name,

            h.brand,
            h.model,
            h.serial_number,

            h.hostname,
            h.ip_address,
            h.mac_address,
            h.service_tag,

            h.processor,
            h.ram,
            h.ram_capacity,
            h.storage,
            h.storage_spec,
            h.operating_system,

            h.configuration_specs,

            h.vendor_id,
            v.vendor_name,

            h.vendor_name AS stored_vendor_name,

            h.purchase_date,
            h.purchase_cost,
            h.invoice_number,

            h.warranty_expiry,
            h.warranty_status,

            h.department,

            h.current_employee_id,
            e.display_name,

            h.assigned_date,
            h.returned_date,

            h.location_id,
            l.location_name,
            h.floor,

            h.asset_status,
            h.remarks,

            h.warranty_document_name,
            h.warranty_document_path,

            h.created_at,
            h.updated_at

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

            h.asset_type,
            h.asset_name,

            h.category_id,
            c.category_name,

            h.brand,
            h.model,
            h.serial_number,

            h.hostname,
            h.ip_address,
            h.mac_address,
            h.service_tag,

            h.processor,
            h.ram,
            h.ram_capacity,
            h.storage,
            h.storage_spec,
            h.operating_system,

            h.configuration_specs,

            h.vendor_id,
            v.vendor_name,

            h.vendor_name AS stored_vendor_name,

            h.purchase_date,
            h.purchase_cost,
            h.invoice_number,

            h.warranty_expiry,
            h.warranty_status,

            h.department,

            h.current_employee_id,
            e.display_name,

            h.assigned_date,
            h.returned_date,

            h.location_id,
            l.location_name,
            h.floor,

            h.asset_status,
            h.remarks,

            h.warranty_document_name,
            h.warranty_document_path,

            h.created_at,
            h.updated_at

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

        LIMIT 1
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
            asset_type,
            category_id,
            asset_name,

            brand,
            model,
            serial_number,

            processor,
            ram,
            ram_capacity,
            storage,
            storage_spec,
            operating_system,

            configuration_specs,

            vendor_id,
            vendor_name,

            purchase_date,
            purchase_cost,
            invoice_number,

            warranty_expiry,
            warranty_status,

            department,

            location_id,
            floor,

            asset_status,
            remarks,

            warranty_document_name,
            warranty_document_path
        )

        VALUES
        (
            ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?,
            ?, ?,
            ?, ?, ?,
            ?, ?,
            ?,
            ?, ?,
            ?, ?,
            ?, ?
        )
    `, [

        asset.asset_code,
        asset.asset_type || null,
        asset.category_id,
        asset.asset_name,

        asset.brand || null,
        asset.model || null,
        asset.serial_number || null,

        asset.processor || null,
        asset.ram || null,
        asset.ram_capacity || null,
        asset.storage || null,
        asset.storage_spec || null,
        asset.operating_system || null,

        asset.configuration_specs || null,

        asset.vendor_id || null,
        asset.vendor_name || null,

        asset.purchase_date || null,
        asset.purchase_cost || null,
        asset.invoice_number || null,

        asset.warranty_expiry || null,
        asset.warranty_status || "Unknown",

        asset.department || null,

        asset.location_id,
        asset.floor || null,

        asset.asset_status || "In Stock",
        asset.remarks || null,

        asset.warranty_document_name || null,
        asset.warranty_document_path || null
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
            asset_type = ?,
            category_id = ?,
            asset_name = ?,

            brand = ?,
            model = ?,
            serial_number = ?,

            processor = ?,
            ram = ?,
            ram_capacity = ?,
            storage = ?,
            storage_spec = ?,
            operating_system = ?,

            configuration_specs = ?,

            vendor_id = ?,
            vendor_name = ?,

            purchase_date = ?,
            purchase_cost = ?,
            invoice_number = ?,

            warranty_expiry = ?,
            warranty_status = ?,

            department = ?,

            location_id = ?,
            floor = ?,

            current_employee_id = ?,
            asset_status = ?,

            remarks = ?

        WHERE asset_id = ?
    `, [

        asset.asset_code,
        asset.asset_type || null,
        asset.category_id,
        asset.asset_name,

        asset.brand || null,
        asset.model || null,
        asset.serial_number || null,

        asset.processor || null,
        asset.ram || null,
        asset.ram_capacity || null,
        asset.storage || null,
        asset.storage_spec || null,
        asset.operating_system || null,

        asset.configuration_specs || null,

        asset.vendor_id || null,
        asset.vendor_name || null,

        asset.purchase_date || null,
        asset.purchase_cost || null,
        asset.invoice_number || null,

        asset.warranty_expiry || null,
        asset.warranty_status || "Unknown",

        asset.department || null,

        asset.location_id,
        asset.floor || null,

        asset.current_employee_id || null,
        asset.asset_status || "In Stock",

        asset.remarks || null,

        id
    ]);

    return result;
};


// =====================================================
// UPDATE WARRANTY DOCUMENT
// =====================================================

const updateWarrantyDocument = async (
    id,
    documentName,
    documentPath
) => {

    const [result] = await db.query(`
        UPDATE hardware_assets

        SET
            warranty_document_name = ?,
            warranty_document_path = ?

        WHERE asset_id = ?
    `, [
        documentName,
        documentPath,
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

const assignAsset = async (
    assetId,
    employeeId
) => {

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

        VALUES
        (?, ?, ?, NOW(), ?)
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

    updateWarrantyDocument,

    deleteAsset,

    updateAssetStatus,
    scrapAsset,

    assignAsset,
    returnAsset,

    addAssetHistory
};