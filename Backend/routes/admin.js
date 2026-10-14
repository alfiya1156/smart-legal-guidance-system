
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: "Please enter admin email and password.",
    });
  }

  const sql = `
    SELECT id, name, email, password_hash, role, is_active
    FROM admins
    WHERE email = ?
    LIMIT 1
  `;

  db.query(sql, [email.trim()], async (err, results) => {
    if (err) {
      console.error("Admin login database error:", err.message);

      return res.status(500).json({
        message: "Unable to process admin login.",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid admin email or password.",
      });
    }

    const admin = results[0];

    if (!admin.is_active || admin.role !== "admin") {
      return res.status(403).json({
        message: "Admin access is disabled.",
      });
    }

    try {
      const passwordMatches = await bcrypt.compare(
        password,
        admin.password_hash
      );

      if (!passwordMatches) {
        return res.status(401).json({
          message: "Invalid admin email or password.",
        });
      }

      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing from .env");

        return res.status(500).json({
          message: "Server authentication is not configured.",
        });
      }

      const token = jwt.sign(
        {
          id: admin.id,
          role: "admin",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
          issuer: "smart-legal-system",
          audience: "smart-legal-admin",
        }
      );

      return res.status(200).json({
        message: "Admin login successful!",
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("Admin authentication error:", error.message);

      return res.status(500).json({
        message: "Unable to complete admin authentication.",
      });
    }
  });
});

module.exports = router;
