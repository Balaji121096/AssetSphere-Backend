const authorizeRole = (...roles) => {

    return (req, res, next) => {

        // Login user check
        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not found."
            });

        }

        // Logged-in user's role
        const userRole = req.user.role;


        // Super Admin-ku full access
        if (userRole === "Super Admin") {

            return next();

        }


        // Requested role permission check
        if (!roles.includes(userRole)) {

            return res.status(403).json({
                success: false,
                message:
                    "Access Denied. You do not have permission."
            });

        }


        // Access allowed
        next();

    };

};


module.exports = authorizeRole;