// =====================================================
// ROLE AUTHORIZATION MIDDLEWARE
// =====================================================

const authorizeRole = (...roles) => {

    return (req, res, next) => {

        // =====================================================
        // CHECK LOGIN
        // =====================================================

        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not found."
            });

        }


        // =====================================================
        // GET LOGGED-IN USER ROLE
        // =====================================================

        const userRole = req.user.role;


        // =====================================================
        // CHECK ROLE EXISTS
        // =====================================================

        if (!userRole) {

            return res.status(403).json({
                success: false,
                message: "User role not found."
            });

        }


        // =====================================================
        // SUPER ADMIN
        // =====================================================
        // Super Admin-ku full system access
        // =====================================================

        if (userRole === "Super Admin") {

            return next();

        }


        // =====================================================
        // NORMAL ROLE CHECK
        // =====================================================
        // Example:
        // authorizeRole("Admin")
        //
        // Admin -> allow
        // Manager -> deny
        // Viewer -> deny
        // =====================================================

        if (!roles.includes(userRole)) {

            return res.status(403).json({
                success: false,
                message:
                    "Access Denied. You do not have permission."
            });

        }


        // =====================================================
        // ACCESS GRANTED
        // =====================================================

        next();

    };

};


module.exports = authorizeRole;