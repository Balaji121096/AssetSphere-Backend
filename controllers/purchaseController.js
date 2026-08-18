const purchaseModel = require("../models/purchaseModel");


// =====================================================
// GET ALL PURCHASES
// =====================================================

const getPurchases = async (req, res) => {

    try {

        const purchases =
            await purchaseModel.getAllPurchases();

        res.json({
            success: true,
            count: purchases.length,
            data: purchases
        });

    } catch (error) {

        console.error(
            "Get Purchases Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// GET PURCHASE BY ID
// =====================================================

const getPurchaseById = async (req, res) => {

    try {

        const purchases =
            await purchaseModel.getPurchaseById(
                req.params.id
            );

        if (purchases.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });
        }

        res.json({
            success: true,
            data: purchases[0]
        });

    } catch (error) {

        console.error(
            "Get Purchase Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// ADD PURCHASE
// =====================================================

const addPurchase = async (req, res) => {

    try {

        const result =
            await purchaseModel.addPurchase(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Purchase added successfully",
            purchase_id: result.insertId
        });

    } catch (error) {

        console.error(
            "Add Purchase Error:",
            error
        );

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(400).json({
                success: false,
                message: "PO Number already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// UPDATE PURCHASE
// =====================================================

const updatePurchase = async (req, res) => {

    try {

        const result =
            await purchaseModel.updatePurchase(
                req.params.id,
                req.body
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });
        }

        res.json({
            success: true,
            message: "Purchase updated successfully"
        });

    } catch (error) {

        console.error(
            "Update Purchase Error:",
            error
        );

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(400).json({
                success: false,
                message: "PO Number already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// DELETE PURCHASE
// =====================================================

const deletePurchase = async (req, res) => {

    try {

        const result =
            await purchaseModel.deletePurchase(
                req.params.id
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });
        }

        res.json({
            success: true,
            message: "Purchase deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete Purchase Error:",
            error
        );

        if (error.code === "ER_ROW_IS_REFERENCED_2") {

            return res.status(400).json({
                success: false,
                message:
                    "Purchase cannot be deleted because it is referenced by another record"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// =====================================================
// PURCHASE SUMMARY
// =====================================================

const getPurchaseSummary = async (req, res) => {

    try {

        const summary =
            await purchaseModel.getPurchaseSummary();

        res.json({
            success: true,
            data: summary
        });

    } catch (error) {

        console.error(
            "Purchase Summary Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


module.exports = {
    getPurchases,
    getPurchaseById,
    addPurchase,
    updatePurchase,
    deletePurchase,
    getPurchaseSummary
};