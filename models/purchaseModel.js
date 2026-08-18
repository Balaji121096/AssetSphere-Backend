const db = require("../config/db");


// =====================================================
// GET ALL PURCHASES
// =====================================================

const getAllPurchases = async () => {

    const [rows] = await db.query(`
        SELECT
            p.purchase_id,
            p.po_number,
            p.invoice_number,

            p.vendor_id,
            v.vendor_code,
            v.vendor_name,

            p.purchase_date,
            p.amount,
            p.payment_status,
            p.warranty_expiry,
            p.remarks,

            p.created_at,
            p.updated_at

        FROM purchase_orders p

        LEFT JOIN vendors v
            ON p.vendor_id = v.vendor_id

        ORDER BY
            p.purchase_id ASC
    `);

    return rows;
};


// =====================================================
// GET PURCHASE BY ID
// =====================================================

const getPurchaseById = async (purchaseId) => {

    const [rows] = await db.query(
        `
        SELECT
            p.purchase_id,
            p.po_number,
            p.invoice_number,

            p.vendor_id,
            v.vendor_code,
            v.vendor_name,

            p.purchase_date,
            p.amount,
            p.payment_status,
            p.warranty_expiry,
            p.remarks,

            p.created_at,
            p.updated_at

        FROM purchase_orders p

        LEFT JOIN vendors v
            ON p.vendor_id = v.vendor_id

        WHERE p.purchase_id = ?

        LIMIT 1
        `,
        [purchaseId]
    );

    return rows;
};


// =====================================================
// ADD PURCHASE
// =====================================================

const addPurchase = async (purchase) => {

    const [result] = await db.query(
        `
        INSERT INTO purchase_orders
        (
            po_number,
            invoice_number,
            vendor_id,
            purchase_date,
            amount,
            payment_status,
            warranty_expiry,
            remarks
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            purchase.po_number,
            purchase.invoice_number || null,
            purchase.vendor_id,
            purchase.purchase_date,
            purchase.amount || 0,
            purchase.payment_status || "Pending",
            purchase.warranty_expiry || null,
            purchase.remarks || null
        ]
    );

    return result;
};


// =====================================================
// UPDATE PURCHASE
// =====================================================

const updatePurchase = async (
    purchaseId,
    purchase
) => {

    const [result] = await db.query(
        `
        UPDATE purchase_orders
        SET
            po_number = ?,
            invoice_number = ?,
            vendor_id = ?,
            purchase_date = ?,
            amount = ?,
            payment_status = ?,
            warranty_expiry = ?,
            remarks = ?

        WHERE purchase_id = ?
        `,
        [
            purchase.po_number,
            purchase.invoice_number || null,
            purchase.vendor_id,
            purchase.purchase_date,
            purchase.amount || 0,
            purchase.payment_status || "Pending",
            purchase.warranty_expiry || null,
            purchase.remarks || null,
            purchaseId
        ]
    );

    return result;
};


// =====================================================
// DELETE PURCHASE
// =====================================================

const deletePurchase = async (purchaseId) => {

    const [result] = await db.query(
        `
        DELETE FROM purchase_orders
        WHERE purchase_id = ?
        `,
        [purchaseId]
    );

    return result;
};


// =====================================================
// PURCHASE SUMMARY
// =====================================================

const getPurchaseSummary = async () => {

    const [[summary]] = await db.query(`
        SELECT

            COUNT(*) AS total_purchases,

            COALESCE(
                SUM(amount),
                0
            ) AS total_purchase_amount,

            SUM(
                CASE
                    WHEN payment_status = 'Pending'
                    THEN 1
                    ELSE 0
                END
            ) AS pending_payments,

            SUM(
                CASE
                    WHEN payment_status = 'Paid'
                    THEN 1
                    ELSE 0
                END
            ) AS paid_purchases

        FROM purchase_orders
    `);

    return {
        total_purchases:
            Number(summary.total_purchases || 0),

        total_purchase_amount:
            Number(summary.total_purchase_amount || 0),

        pending_payments:
            Number(summary.pending_payments || 0),

        paid_purchases:
            Number(summary.paid_purchases || 0)
    };
};


module.exports = {
    getAllPurchases,
    getPurchaseById,
    addPurchase,
    updatePurchase,
    deletePurchase,
    getPurchaseSummary
};