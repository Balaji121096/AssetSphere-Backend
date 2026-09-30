const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'E:/New folder/Projects/AssetSphere-Backend/.env' });

async function fixAssets() {
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

    const [employees] = await db.query('SELECT employee_id, employee_code FROM employees');
    const empMap = {};
    employees.forEach(e => empMap[e.employee_code] = e.employee_id);

    let updated = 0;

    for (const row of data) {
        const assetCode = row['Asset ID'];
        if (!assetCode) continue;

        const csvStatus = (row['Status'] || '').toLowerCase();
        let assetStatus = 'In Stock';
        let currentEmployeeId = null;

        if (csvStatus === 'active') {
            assetStatus = 'Assigned';
            const empCode = row['Employee ID'];
            currentEmployeeId = empMap[empCode] || null;
        } else if (csvStatus === 'scarp' || csvStatus === 'scrap') {
            assetStatus = 'Scrap';
        } else if (csvStatus === 'repair') {
            assetStatus = 'Repair';
        }

        const designation = row['Designation'] || null;

        let warrantyExpiry = null;
        if (row['Warranty end date']) {
            const d = new Date(row['Warranty end date']);
            if (!isNaN(d.getTime())) {
                warrantyExpiry = d.toISOString().split('T')[0];
            }
        }

        let assignedDate = null;
        if (currentEmployeeId) {
            assignedDate = new Date().toISOString().split('T')[0];
        }

        const query = `UPDATE hardware_assets 
            SET current_employee_id = ?, 
                asset_status = ?, 
                designation = ?, 
                warranty_expiry = ?,
                assigned_date = CASE WHEN current_employee_id = ? THEN assigned_date ELSE ? END
            WHERE asset_code = ?`;
            
        try {
            const [result] = await db.query(query, [
                currentEmployeeId, assetStatus, designation, warrantyExpiry, 
                currentEmployeeId, assignedDate, assetCode
            ]);
            if (result.affectedRows > 0) updated++;
        } catch (err) {
            console.error("Error updating", assetCode, err.message);
        }
    }
    
    console.log(`Successfully updated ${updated} assets from CSV.`);
    await db.end();
}

fixAssets().catch(console.error);
