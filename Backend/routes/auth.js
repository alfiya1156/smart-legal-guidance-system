const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const db = require("../db");

// ================================
// SIGNUP API
// ================================
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Check empty fields
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  try {
    // Check whether email already exists
    const checkEmailSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkEmailSql, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      // Email already registered
      if (results.length > 0) {
        return res.status(409).json({
          message: "Email already registered",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const insertSql =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

      db.query(
        insertSql,
        [name, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("Signup error:", err);

            return res.status(500).json({
              message: "Signup failed",
            });
          }

          return res.status(201).json({
            message: "Signup successful",
            userId: result.insertId,
          });
        }
      );
    });
  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

// ================================
// LOGIN API
// ================================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check empty fields
  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter email and password",
    });
  }

  // Find user by email
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Login database error:", err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    // User not found
    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = results[0];

    try {
      // Compare entered password with hashed password
      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Login successful
        const activitySql = `
        INSERT INTO recent_activity
          (user_id, activity, activity_type)
        VALUES (?, ?, ?)
      `;

      console.log("Login successful for user ID:", user.id);
      console.log("Attempting to save login activity...");

      db.query(
        activitySql,
        [user.id, "Logged in successfully", "Login"],
        (activityErr, activityResult) => {
          if (activityErr) {
            console.error("Activity save error:", activityErr);
          } else {
            console.log(
              "Activity saved successfully. Insert ID:",
              activityResult.insertId
            );
          }

          // Login response 
          return res.status(200).json({
            message: "Login successful",
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        }
      );
      
    } catch (error) {
      console.error("Password comparison error:", error);

      return res.status(500).json({
        message: "Server error",
      });
    }
  });
});

console.log("AUTH ROUTES LOADED");

module.exports = router;