const db = require("../config/db");

const getAllDesignations = async () => {
    const [rows] = await db.query(`
        SELECT
            designation_id,
            designation_name,
            designation_code,
            status
        FROM designations
        ORDER BY designation_name ASC
    `);

    return rows;
};

module.exports = {
    getAllDesignations
};