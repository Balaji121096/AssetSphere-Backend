const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access Denied. Token Missing."
        });
    }

    let token;

    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
    } else {
        token = authHeader;
    }

    console.log("Token:", token);
    console.log("JWT Secret:", process.env.JWT_SECRET);

    try {

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Verified:", verified);

        req.user = verified;

        next();

    } catch (error) {

        console.log("JWT Error Name:", error.name);
        console.log("JWT Error Message:", error.message);

        return res.status(401).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = verifyToken;