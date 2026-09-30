
const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const { uploadTicketAttachment } = require("../middleware/ticketUpload");

// Base access
router.use(verifyToken);

// Employee/User routes
router.post("/", authorizeRole("Employee", "Admin", "Manager", "IT"), uploadTicketAttachment.single('attachment'), ticketController.createTicket);
router.get("/my-tickets", ticketController.getMyTickets);
router.get("/my-assets", ticketController.getMyAssets);

// Admin / Manager routes
router.get("/", authorizeRole("Admin", "Manager", "IT", "Super Admin"), ticketController.getAllTickets);
router.get("/stats", authorizeRole("Admin", "Manager", "IT", "Super Admin"), ticketController.getStats);

// Shared specific ticket routes
router.get("/:id", ticketController.getTicketDetails);
router.post("/:id/comments", ticketController.addComment);

// Admin-only updates
router.put("/:id/status", authorizeRole("Admin", "Manager", "IT", "Super Admin"), ticketController.updateStatus);
router.put("/:id/priority", authorizeRole("Admin", "Manager", "IT", "Super Admin"), ticketController.updatePriority);
router.put("/:id/assign", authorizeRole("Admin", "Manager", "IT", "Super Admin"), ticketController.assignTicket);

module.exports = router;
