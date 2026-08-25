const authorizeRole = (...roles) => {

    return (req, res, next) => {

        // =====================================================
        // CHECK LOGIN USER
        // =====================================================

        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not found."
            });

        }


        // =====================================================
        // GET USER ROLE
        // =====================================================

        const userRole = req.user.role;


        // =====================================================
        // SUPER ADMIN
        // =====================================================
        // Super Admin has full access wherever Admin is allowed.
        // =====================================================

        if (
            userRole === "Super Admin" &&
            roles.includes("Admin")
        ) {

            return next();

        }


        // =====================================================
        // NORMAL ROLE CHECK
        // =====================================================

        if (!roles.includes(userRole)) {

            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });

        }


        // =====================================================
        // ACCESS GRANTED
        // =====================================================

        next();

    };

};


module.exports = authorizeRole;