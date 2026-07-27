const db = require("../config/db");

const getAllCategories = async () => {

    const [rows] = await db.query(`
        SELECT
            category_id,
            category_code,
            category_name,
            description,
            status
        FROM asset_categories
        ORDER BY category_name ASC
    `);

    return rows;
};

module.exports = {
    getAllCategories
};