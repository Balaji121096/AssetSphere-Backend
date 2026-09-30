const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'E:/New folder/Projects/AssetSphere-Backend/.env' });

async function syncAssets() {
    const db = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const csvContent = fs.readFileSync('E:/New folder/Projects/MASTER SHEET(Master sheet Jan 2026) (5).csv', 'utf8');
    const parseCSVRow = (text) => {
        const re = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
        return text.split(re).map(x => x.replace(/^"|"$/g, '').trim());
    };

    const rows = csvContent.split('\n').filter(r => r.trim());
    const headers = parseCSVRow(rows[0]);
    
    const data = rows.slice(1).map(row => {
        const values = parseCSVRow(row);
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = values[i] || '';
        });
        return obj;
    });

    const [existingAssets] = await db.query('SELECT asset_code FROM hardware_assets');
    const existingSet = new Set(existingAssets.map(a => a.asset_code));

    const [employees] = await db.query('SELECT employee_id, employee_code FROM employees');
    const empMap = {};
    employees.forEach(e => empMap[e.employee_code] = e.employee_id);

    const [vendors] = await db.query('SELECT vendor_id, vendor_name FROM vendors');
    const vendorMap = {};
    vendors.forEach(v => vendorMap[v.vendor_name.toLowerCase()] = v.vendor_id);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of data) {
        if (!row['Asset ID'] || existingSet.has(row['Asset ID'])) {
            skipped++;
            continue;
        }

        const assetCode = row['Asset ID'];
        existingSet.add(assetCode); // Prevent duplicates within CSV

        const assetType = row['Asset type'];
        let categoryId = null;
        if (assetType.toLowerCase() === 'laptop') categoryId = 1;
        else if (assetType.toLowerCase() === 'desktop') categoryId = 2;
        else if (assetType.toLowerCase() === 'monitor') categoryId = 3;
        else categoryId = 4;

        const brand = row['Make/Brand'] || null;
        const model = row['Model'] || null;
        const serialNumber = row['SerialNumber'] || null;
        const processor = row['Configuration'] || null;
        const ram = row['Memory'] || null;
        const storage = row['Drive storage'] || null;
        const os = row['OS'] || null;
        
        let vendorId = null;
        const vName = (row['Vendor'] || '').toLowerCase();
        if (vName) {
            const matched = Object.keys(vendorMap).find(k => k.includes(vName) || vName.includes(k));
            if (matched) vendorId = vendorMap[matched];
        }
        
        const empCode = row['Employee ID'];
        const currentEmployeeId = empMap[empCode] || null;
        
        const floor = row['Floor'] || null;
        const locationId = 1; // Chennai
        const remarks = row['Remarks'] || null;
        const designation = row['Designation'] || null;

        let assetStatus = 'In Stock';
        if (currentEmployeeId) assetStatus = 'Assigned';
        if (row['Status'] && row['Status'].toLowerCase() === 'scrap') assetStatus = 'Scrap';

        let warrantyExpiry = null;
        if (row['Warranty end date']) {
            const d = new Date(row['Warranty end date']);
            if (!isNaN(d.getTime())) {
                warrantyExpiry = d.toISOString().split('T')[0];
            }
        }
        
        let assignedDate = currentEmployeeId ? new Date().toISOString().split('T')[0] : null;

        const query = `INSERT INTO hardware_assets
            (asset_code, asset_type, category_id, asset_name, brand, model, serial_number, processor, ram, storage, operating_system, vendor_id, vendor_name, warranty_expiry, department, designation, current_employee_id, assigned_date, location_id, floor, asset_status, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
        try {
            await db.query(query, [
                assetCode, assetType, categoryId, `${brand || ''} ${model || ''}`.trim(), brand, model, serialNumber, processor, ram, storage, os, vendorId, row['Vendor'] || null, warrantyExpiry, row['LEGENDS'] || null, designation, currentEmployeeId, assignedDate, locationId, floor, assetStatus, remarks
            ]);
            inserted++;
        } catch (err) {
            console.error("Error inserting", assetCode, err.message);
            errors++;
        }
    }
    
    console.log(`Inserted ${inserted} assets. Skipped ${skipped} duplicates. Errors ${errors}.`);
    await db.end();
}

syncAssets().catch(console.error);
