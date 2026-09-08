const authModel = require("../models/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        if (!username || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Username and Password are required"

            });

        }


        const user =
            await authModel.login(username);


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid Username"

            });

        }


        if (user.status !== "Active") {

            return res.status(403).json({

                success: false,

                message:
                    "User is Inactive"

            });

        }


        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid Password"

            });

        }


        const token =
            jwt.sign(

                {
                    user_id:
                        user.user_id,

                    employee_id:
                        user.employee_id,

                    username:
                        user.username,

                    role:
                        user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "8h"
                }

            );


        return res.json({

            success: true,

            message:
                "Login Successful",

            token,

            must_change_password:
                Number(
                    user.must_change_password || 0
                ) === 1,

            user: {

                user_id:
                    user.user_id,

                employee_id:
                    user.employee_id,

                username:
                    user.username,

                role:
                    user.role,

                must_change_password:
                    Number(
                        user.must_change_password || 0
                    ) === 1

            }

        });

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


module.exports = {
    login
};