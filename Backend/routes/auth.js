const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// =========================
// SIGNUP API
// =========================
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (name, email, password)
                     VALUES (?, ?, ?)`;

        db.query(
            sql,
            [name.trim(), email.trim().toLowerCase(), hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "Email already registered"
                        });
                    }

                    console.error(err);

                    return res.status(500).json({
                        message: "Signup failed"
                    });
                }

                res.status(201).json({
                    message: "Signup successful",
                    userId: result.insertId
                });
            }
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =========================
// LOGIN API
// =========================
router.post("/login", (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = `SELECT id, name, email, password
                 FROM users
                 WHERE email = ?`;

    db.query(
        sql,
        [email.trim().toLowerCase()],
        async (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Login failed"
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const user = results[0];

            try {
                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatch) {
                    return res.status(401).json({
                        message: "Invalid email or password"
                    });
                }

                res.status(200).json({
                    message: "Login successful",
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });

            } catch (error) {
                console.error(error);

                res.status(500).json({
                    message: "Server error"
                });
            }
        }
    );
});


module.exports = router;