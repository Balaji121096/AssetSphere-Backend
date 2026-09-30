// =====================================================
// models/assetModel.js
// =====================================================

const db = require("../config/db");


// =====================================================
// GET ALL ASSETS
// =====================================================

const getAllAssets = async (assetType = null) => {

    let query = `
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

            h.warranty_started,
            h.warranty_expiry,
            h.warranty_status,

            h.department,
            h.designation,

            h.current_employee_id,
            e.display_name,
            e.employee_id,

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
    `;

    const params = [];

    if (
        assetType &&
        assetType !== "All" &&
        assetType !== "all" &&
        assetType !== "ALL"
    ) {
        query += ` WHERE h.asset_type = ? `;
        params.push(assetType);
    }

    query += ` ORDER BY h.asset_code ASC `;

    const [rows] = await db.query(
        query,
        params
    );

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

            h.warranty_started,
            h.warranty_expiry,
            h.warranty_status,

            h.department,
            h.designation,

            h.current_employee_id,
            e.display_name,
            e.employee_id,

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
    let assignedDate = null;
    let returnedDate = null;
    
    if (asset.current_employee_id) {
        assignedDate = new Date().toISOString().split('T')[0];
    }
    
    if (asset.asset_status === 'In Stock' || asset.asset_status === 'Repair' || asset.asset_status === 'Scrap' || asset.asset_status === 'Lost') {
        asset.current_employee_id = null;
        assignedDate = null;
    }

    const [result] = await db.query(`
        INSERT INTO hardware_assets
        (
            asset_code, asset_type, category_id, asset_name,
            brand, model, serial_number,
            processor, ram, storage, storage_spec, operating_system,
            
            warranty_started, warranty_expiry,
            
            department, designation, location_id, floor,
            current_employee_id, assigned_date, returned_date,
            
            asset_status, remarks,
            
            warranty_document_name, warranty_document_path
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        asset.asset_code, asset.asset_type || null, asset.category_id, asset.asset_name || (asset.brand + " " + asset.model),
        asset.brand || null, asset.model || null, asset.serial_number || null,
        asset.processor || null, asset.ram || null, asset.storage || null, asset.storage_spec || null, asset.operating_system || null,
        
        asset.warranty_started || null, asset.warranty_expiry || null,
        
        asset.department || null, asset.designation || null, asset.location_id, asset.floor || null,
        asset.current_employee_id || null, assignedDate, returnedDate,
        
        asset.asset_status || "In Stock", asset.remarks || null,
        
        asset.warranty_document_name || null, asset.warranty_document_path || null
    ]);

    if (asset.current_employee_id) {
        await addAssetHistory(result.insertId, asset.current_employee_id, 'Assigned', 'Assigned during asset creation');
    }

    return result;
};


// =====================================================
// UPDATE ASSET
// =====================================================

const updateAsset = async (id, asset) => {
    
    const [currentAsset] = await db.query('SELECT current_employee_id, assigned_date FROM hardware_assets WHERE asset_id = ?', [id]);
    
    let assignedDate = currentAsset[0].assigned_date;
    let returnedDate = null;

    if (asset.current_employee_id && asset.current_employee_id !== currentAsset[0].current_employee_id) {
        assignedDate = new Date().toISOString().split('T')[0];
    } else if (!asset.current_employee_id) {
        assignedDate = null;
    }
    
    if (asset.asset_status === 'In Stock' || asset.asset_status === 'Repair' || asset.asset_status === 'Scrap' || asset.asset_status === 'Lost') {
        if (currentAsset[0].current_employee_id) {
            returnedDate = new Date().toISOString().split('T')[0];
        }
        asset.current_employee_id = null;
        assignedDate = null;
    }

    const [result] = await db.query(`
        UPDATE hardware_assets
        SET
            asset_code = ?, asset_type = ?, category_id = ?, asset_name = ?,
            brand = ?, model = ?, serial_number = ?,
            processor = ?, ram = ?, storage = ?, storage_spec = ?, operating_system = ?,
            
            warranty_started = ?, warranty_expiry = ?,
            
            department = ?, designation = ?, location_id = ?, floor = ?,
            current_employee_id = ?, assigned_date = ?, returned_date = ?,
            
            asset_status = ?, remarks = ?
        WHERE asset_id = ?
    `, [
        asset.asset_code, asset.asset_type || null, asset.category_id, asset.asset_name || (asset.brand + " " + asset.model),
        asset.brand || null, asset.model || null, asset.serial_number || null,
        asset.processor || null, asset.ram || null, asset.storage || null, asset.storage_spec || null, asset.operating_system || null,
        
        asset.warranty_started || null, asset.warranty_expiry || null,
        
        asset.department || null, asset.designation || null, asset.location_id, asset.floor || null,
        asset.current_employee_id || null, assignedDate, returnedDate,
        
        asset.asset_status || "In Stock", asset.remarks || null,
        id
    ]);

    if (asset.current_employee_id && asset.current_employee_id !== currentAsset[0].current_employee_id) {
        await addAssetHistory(id, asset.current_employee_id, 'Assigned', 'Assigned during asset update');
    } else if (!asset.current_employee_id && currentAsset[0].current_employee_id) {
        await addAssetHistory(id, currentAsset[0].current_employee_id, 'Returned', 'Returned during asset update');
    }

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

    let query = `
        UPDATE hardware_assets
        SET
            asset_status = ?
    `;

    const params = [status];

    if (
        status === "In Stock" ||
        status === "Repair" ||
        status === "Scrap" ||
        status === "Lost"
    ) {
        query += `,
            current_employee_id = NULL,
            returned_date = CURDATE()
        `;
    }

    query += `
        WHERE asset_id = ?
    `;

    params.push(id);

    const [result] = await db.query(
        query,
        params
    );

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
            current_employee_id = NULL,
            returned_date = CURDATE()

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


// =====================================================
// EXPORT DATA
// =====================================================

const getAssetsForExport = async (assetType = null) => {

    let query = `
        SELECT

            h.asset_code,
            h.asset_type,
            h.model,

            h.configuration_specs,

            h.ram,
            h.ram_capacity,

            h.storage,
            h.storage_spec,

            e.display_name AS employee_name,
            e.employee_id AS employee_id,

            h.asset_status,

            h.purchase_date,
            h.warranty_started,
            h.warranty_expiry,

            h.purchase_cost,

            h.department

        FROM hardware_assets h

        LEFT JOIN employees e
            ON h.current_employee_id = e.employee_id
    `;

    const params = [];

    if (
        assetType &&
        assetType !== "All" &&
        assetType !== "all" &&
        assetType !== "ALL"
    ) {

        query += `
            WHERE h.asset_type = ?
        `;

        params.push(assetType);
    }

    query += `
        ORDER BY h.asset_code ASC
    `;

    const [rows] = await db.query(
        query,
        params
    );

    return rows;
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

    addAssetHistory,

    getAssetsForExport
};
