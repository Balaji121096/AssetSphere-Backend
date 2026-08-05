const authModel = require("../models/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {

    console.log(req.body);

    try {

        const { username, password } = req.body;
        if (!username || !password) {

            return res.status(400).json({
                success: false,
                message: "Username and Password are required"
            });

        }

        const user = await authModel.login(username);

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid Username"
            });

        }

        if (user.status !== "Active") {

            return res.status(403).json({
                success: false,
                message: "User is Inactive"
            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });

        }

        const token = jwt.sign(

            {
                user_id: user.user_id,
                employee_id: user.employee_id,
                username: user.username,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "8h"
            }

        );

        console.log("Generated Token:");
console.log(token);

        res.json({

            success: true,

            message: "Login Successful",

            token,

            user: {

                user_id: user.user_id,
                username: user.username,
                role: user.role

            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

module.exports = {
    login
};