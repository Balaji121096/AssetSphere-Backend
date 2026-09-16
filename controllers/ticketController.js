const ticketModel =
    require("../models/ticketModel");


// =====================================================
// GET ALL TICKETS
// =====================================================

const getAllTickets = async (req, res) => {

    try {

        const tickets =
            await ticketModel.getAllTickets();

        res.status(200).json({

            success: true,

            count: tickets.length,

            data: tickets

        });

    } catch (error) {

        console.error(
            "Get All Tickets Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }
};


// =====================================================
// GET MY TICKETS
// =====================================================

const getMyTickets = async (req, res) => {

    try {

        const employeeId =
            req.user.employee_id;

        if (!employeeId) {

            return res.status(400).json({

                success: false,

                message:
                    "User is not linked to an employee"

            });
        }


        const tickets =
            await ticketModel.getTicketsByEmployee(
                employeeId
            );


        res.status(200).json({

            success: true,

            count: tickets.length,

            data: tickets

        });

    } catch (error) {

        console.error(
            "Get My Tickets Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }
};


// =====================================================
// GET TICKET BY ID
// =====================================================

const getTicketById = async (req, res) => {

    try {

        const ticket =
            await ticketModel.getTicketById(
                req.params.id
            );


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        const comments =
            await ticketModel.getComments(
                req.params.id
            );


        const history =
            await ticketModel.getStatusHistory(
                req.params.id
            );


        res.status(200).json({

            success: true,

            data: {

                ...ticket,

                comments,

                status_history: history

            }

        });

    } catch (error) {

        console.error(
            "Get Ticket Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }
};


// =====================================================
// CREATE TICKET
// =====================================================

const createTicket = async (req, res) => {

    try {

        const {
            category,
            subject,
            description,
            priority
        } = req.body;


        if (!subject || !description) {

            return res.status(400).json({

                success: false,

                message:
                    "Subject and Description are required"

            });

        }


        const employeeId =
            req.user.employee_id;


        if (!employeeId) {

            return res.status(400).json({

                success: false,

                message:
                    "User is not linked to an employee"

            });

        }


        const result =
            await ticketModel.createTicket(

                employeeId,

                {
                    category,
                    subject,
                    description,
                    priority
                }

            );


        res.status(201).json({

            success: true,

            message:
                "Ticket created successfully",

            ticket_id:
                result.insertId,

            ticket_number:
                result.ticketNumber

        });

    } catch (error) {

        console.error(
            "Create Ticket Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to create ticket"

        });

    }
};


// =====================================================
// UPDATE TICKET
// =====================================================

const updateTicket = async (req, res) => {

    try {

        const result =
            await ticketModel.updateTicket(

                req.params.id,

                req.body

            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Ticket updated successfully"

        });

    } catch (error) {

        console.error(
            "Update Ticket Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to update ticket"

        });

    }
};


// =====================================================
// ASSIGN TICKET
// =====================================================

const assignTicket = async (req, res) => {

    try {

        const {
            assigned_to
        } = req.body;


        if (!assigned_to) {

            return res.status(400).json({

                success: false,

                message:
                    "assigned_to is required"

            });

        }


        const result =
            await ticketModel.assignTicket(

                req.params.id,

                assigned_to

            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Ticket assigned successfully"

        });

    } catch (error) {

        console.error(
            "Assign Ticket Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to assign ticket"

        });

    }
};
const updateStatus = async (req, res) => {

    try {

        const {
            status
        } = req.body;


        const allowedStatuses = [
            "Open",
            "In Progress",
            "Pending",
            "Resolved",
            "Closed"
        ];


        if (
            !status ||
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid ticket status"

            });

        }


        // =================================================
        // GET TICKET
        // =================================================

        const ticket =
            await ticketModel.getTicketById(
                req.params.id
            );


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        // =================================================
        // CHECK ROLE
        // =================================================

        const userRole =
            req.user.role;


        const managementRoles = [
            "Admin",
            "Manager",
            "HR"
        ];


        const isManagement =
            managementRoles.includes(
                userRole
            );


        // =================================================
        // ASSIGNED USER CHECK
        // =================================================

        const isAssignedUser =
            Number(ticket.assigned_to) ===
            Number(req.user.user_id);


        if (
            !isManagement &&
            !isAssignedUser
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not assigned to this ticket"

            });

        }


        // =================================================
        // UPDATE STATUS
        // =================================================

        const result =
            await ticketModel.updateTicketStatus(

                req.params.id,

                status,

                req.user.user_id

            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Ticket status updated successfully",

            old_status:
                result.oldStatus,

            new_status:
                result.newStatus

        });

    } catch (error) {

        console.error(
            "Update Ticket Status Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to update ticket status"

        });

    }
};


// =====================================================
// DELETE TICKET
// =====================================================

const deleteTicket = async (req, res) => {

    try {

        const result =
            await ticketModel.deleteTicket(
                req.params.id
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Ticket deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete Ticket Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Ticket cannot be deleted"

        });

    }
};


// =====================================================
// ADD COMMENT
// =====================================================

const addComment = async (req, res) => {

    try {

        const {
            comment
        } = req.body;


        if (!comment) {

            return res.status(400).json({

                success: false,

                message:
                    "Comment is required"

            });

        }


        const ticket =
            await ticketModel.getTicketById(
                req.params.id
            );


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        const result =
            await ticketModel.addComment(

                req.params.id,

                req.user.user_id,

                comment

            );


        res.status(201).json({

            success: true,

            message:
                "Comment added successfully",

            comment_id:
                result.insertId

        });

    } catch (error) {

        console.error(
            "Add Comment Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to add comment"

        });

    }
};


// =====================================================
// GET COMMENTS
// =====================================================

const getComments = async (req, res) => {

    try {

        const ticket =
            await ticketModel.getTicketById(
                req.params.id
            );


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        const comments =
            await ticketModel.getComments(
                req.params.id
            );


        res.status(200).json({

            success: true,

            count: comments.length,

            data: comments

        });

    } catch (error) {

        console.error(
            "Get Comments Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to get comments"

        });

    }
};


// =====================================================
// GET STATUS HISTORY
// =====================================================

const getStatusHistory = async (
    req,
    res
) => {

    try {

        const ticket =
            await ticketModel.getTicketById(
                req.params.id
            );


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    "Ticket not found"

            });

        }


        const history =
            await ticketModel.getStatusHistory(
                req.params.id
            );


        res.status(200).json({

            success: true,

            count: history.length,

            data: history

        });

    } catch (error) {

        console.error(
            "Get Status History Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to get status history"

        });

    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getAllTickets,
    getMyTickets,
    getTicketById,

    createTicket,
    updateTicket,

    assignTicket,
    updateStatus,

    deleteTicket,

    addComment,
    getComments,

    getStatusHistory

};