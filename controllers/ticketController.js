
const ticketModel = require("../models/ticketModel");
const path = require("path");

const createTicket = async (req, res) => {
    try {
        const employee_id = req.user.employee_id;
        if (!employee_id) return res.status(400).json({ success: false, message: "User is not linked to an employee" });

        const ticketData = { ...req.body, employee_id, user_id: req.user.user_id };
        
        if (req.file) {
            ticketData.attachment_path = "/uploads/ticket-attachments/" + req.file.filename;
        }

        const result = await ticketModel.createTicket(ticketData);
        res.status(201).json({ success: true, message: "Ticket created", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create ticket" });
    }
};

const getMyTickets = async (req, res) => {
    try {
        const employee_id = req.user.employee_id;
        if (!employee_id) return res.json({ success: true, data: [] });

        const tickets = await ticketModel.getTicketsByEmployee(employee_id);
        res.json({ success: true, data: tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch tickets" });
    }
};

const getMyAssets = async (req, res) => {
    try {
        const employee_id = req.user.employee_id;
        if (!employee_id) return res.json({ success: true, data: [] });

        const assets = await ticketModel.getAssetsByEmployee(employee_id);
        res.json({ success: true, data: assets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch assets" });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketModel.getAllTickets();
        res.json({ success: true, data: tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch tickets" });
    }
};

const getTicketDetails = async (req, res) => {
    try {
        const ticket = await ticketModel.getTicketById(req.params.id);
        if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

        // Security check: If employee, must be their ticket
        if (req.user.role === 'Employee' && ticket.employee_id !== req.user.employee_id) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        const timeline = await ticketModel.getTicketTimeline(req.params.id);
        res.json({ success: true, data: { ticket, timeline } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch ticket" });
    }
};

const updateStatus = async (req, res) => {
    try {
        await ticketModel.updateTicketStatus(req.params.id, req.body.status, req.user.user_id);
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};


const updatePriority = async (req, res) => {
    try {
        const { priority } = req.body;
        if (!priority) return res.status(400).json({ success: false, message: "Priority is required" });
        await ticketModel.updateTicketPriority(req.params.id, priority, req.user.user_id);
        res.json({ success: true, message: "Priority updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update priority" });
    }
};

const assignTicket = async (req, res) => {
    try {
        await ticketModel.assignTicket(req.params.id, req.body.assigned_to, req.user.user_id);
        res.json({ success: true, message: "Ticket assigned" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to assign ticket" });
    }
};

const addComment = async (req, res) => {
    try {
        await ticketModel.addComment(req.params.id, req.user.user_id, req.body.comment);
        res.json({ success: true, message: "Comment added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to add comment" });
    }
};

const getStats = async (req, res) => {
    try {
        const stats = await ticketModel.getTicketStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
};

module.exports = {
    createTicket,
    getMyTickets,
    getMyAssets,
    getAllTickets,
    getTicketDetails,
    updateStatus,
    updatePriority,
    assignTicket,
    addComment,
    getStats
};
