const express = require("express");

const router = express.Router();

const ticketController =
    require("../controllers/ticketController");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRole =
    require("../middleware/roleMiddleware");


// =====================================================
// GET ALL TICKETS
// ADMIN + MANAGER + HR
// =====================================================

router.get(
    "/",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR"
    ),

    ticketController.getAllTickets
);


// =====================================================
// GET MY TICKETS
// ALL LOGGED-IN USERS
// =====================================================

router.get(
    "/my",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR",
        "Viewer"
    ),

    ticketController.getMyTickets
);


// =====================================================
// CREATE TICKET
// ALL LOGGED-IN USERS
// =====================================================

router.post(
    "/",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR",
        "Viewer"
    ),

    ticketController.createTicket
);


// =====================================================
// GET SINGLE TICKET
// ALL LOGGED-IN USERS
// =====================================================

router.get(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR",
        "Viewer"
    ),

    ticketController.getTicketById
);


// =====================================================
// UPDATE TICKET
// ADMIN + MANAGER + HR
// =====================================================

router.put(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR"
    ),

    ticketController.updateTicket
);


// =====================================================
// ASSIGN TICKET
// ADMIN + MANAGER + HR
// =====================================================

router.put(
    "/:id/assign",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR"
    ),

    ticketController.assignTicket
);


// =====================================================
// UPDATE STATUS
// ADMIN + MANAGER + HR
// =====================================================

router.put(
    "/:id/status",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR"
    ),

    ticketController.updateStatus
);


// =====================================================
// DELETE TICKET
// ADMIN + MANAGER + HR
// =====================================================

router.delete(
    "/:id",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR"
    ),

    ticketController.deleteTicket
);


// =====================================================
// GET COMMENTS
// ALL LOGGED-IN USERS
// =====================================================

router.get(
    "/:id/comments",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR",
        "Viewer"
    ),

    ticketController.getComments
);


// =====================================================
// ADD COMMENT
// ALL LOGGED-IN USERS
// =====================================================

router.post(
    "/:id/comments",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR",
        "Viewer"
    ),

    ticketController.addComment
);


// =====================================================
// GET STATUS HISTORY
// ALL LOGGED-IN USERS
// =====================================================

router.get(
    "/:id/history",

    verifyToken,

    authorizeRole(
        "Admin",
        "Manager",
        "HR",
        "Viewer"
    ),

    ticketController.getStatusHistory
);


module.exports = router;