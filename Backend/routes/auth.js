const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

          const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: "user" },
            process.env.JWT_SECRET || "smart-legal-guidance-system-secret-key-2026",
            { expiresIn: "7d" }
          );

          // Login response 
          return res.status(200).json({
            message: "Login successful",
            token,
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

// ================================
// GET USER PROFILE & LIVE STATS
// ================================
router.get("/profile/:id", (req, res) => {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const userSql = "SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1";

  db.query(userSql, [userId], (err, users) => {
    if (err) {
      console.error("Fetch profile error:", err.message);
      return res.status(500).json({ message: "Database error fetching profile" });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = users[0];

    // Compute real statistics from actual MySQL tables
    const statsSql = `
      SELECT
        (SELECT COUNT(*) FROM legal_form_submissions WHERE user_id = ?) AS formsCount,
        (SELECT COUNT(*) FROM recent_activity WHERE user_id = ?) AS totalActivities,
        (SELECT COUNT(*) FROM recent_activity WHERE user_id = ? AND activity_type = 'AI Assistant') AS aiQuestionsCount,
        (SELECT COUNT(*) FROM recent_activity WHERE user_id = ? AND activity_type = 'Forms Generator') AS formsGeneratedCount
    `;

    db.query(statsSql, [userId, userId, userId, userId], (statsErr, statsRows) => {
      const stats = (statsRows && statsRows[0]) || {
        formsCount: 0,
        totalActivities: 0,
        aiQuestionsCount: 0,
        formsGeneratedCount: 0,
      };

      res.json({
        user: userData,
        stats: {
          rightsViewed: Math.max(1, stats.totalActivities),
          formsGenerated: stats.formsCount || stats.formsGeneratedCount || 0,
          aiConsultations: stats.aiQuestionsCount || 0,
          recentActivitiesCount: stats.totalActivities || 0,
        },
      });
    });
  });
});

// ================================
// UPDATE USER PROFILE
// ================================
router.put("/profile/:id", async (req, res) => {
  const userId = Number(req.params.id);
  const { name, email, password } = req.body;

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    // Check if new email is taken by another user
    const emailCheckSql = "SELECT id FROM users WHERE email = ? AND id != ?";
    db.query(emailCheckSql, [email.trim(), userId], async (emailErr, duplicate) => {
      if (emailErr) {
        console.error("Email check error:", emailErr.message);
        return res.status(500).json({ message: "Database check error" });
      }

      if (duplicate && duplicate.length > 0) {
        return res.status(409).json({ message: "Email is already taken by another account" });
      }

      if (password && password.trim().length >= 6) {
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        const updateSql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
        db.query(updateSql, [name.trim(), email.trim(), hashedPassword, userId], (err) => {
          if (err) {
            console.error("Update profile error:", err.message);
            return res.status(500).json({ message: "Failed to update profile" });
          }
          return res.json({
            message: "Profile updated successfully",
            user: { id: userId, name: name.trim(), email: email.trim() },
          });
        });
      } else {
        const updateSql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
        db.query(updateSql, [name.trim(), email.trim(), userId], (err) => {
          if (err) {
            console.error("Update profile error:", err.message);
            return res.status(500).json({ message: "Failed to update profile" });
          }
          return res.json({
            message: "Profile updated successfully",
            user: { id: userId, name: name.trim(), email: email.trim() },
          });
        });
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
});

console.log("AUTH ROUTES LOADED");

module.exports = router;