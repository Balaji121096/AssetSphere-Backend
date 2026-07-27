const db = require("../config/db");

const getAllVendors = async () => {

    const [rows] = await db.query(`
        SELECT
            vendor_id,
            vendor_code,
            vendor_name,
            contact_person,
            email,
            mobile,
            city,
            state,
            country,
            gst_number,
            status
        FROM vendors
        ORDER BY vendor_name ASC
    `);

    return rows;
};

module.exports = {
    getAllVendors
};