
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
        process.env.JWT_SECRET || "smart-legal-guidance-system-secret-key-2026",
        {
          expiresIn: "24h",
          issuer: "smart-legal-system",
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

// ============================================
// ADMIN AUTH MIDDLEWARE
// ============================================
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token required." });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "smart-legal-guidance-system-secret-key-2026"
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access forbidden. Admin role required." });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error("Admin token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired admin session token." });
  }
}

// ============================================
// ADMIN DASHBOARD STATS
// ============================================
router.get("/stats", verifyAdmin, (req, res) => {
  const statsSql = `
    SELECT
      (SELECT COUNT(*) FROM users) AS usersCount,
      (SELECT COUNT(*) FROM legal_awareness) AS awarenessCount,
      (SELECT COUNT(*) FROM ai_legal_knowledge) AS knowledgeCount,
      (SELECT COUNT(*) FROM legal_form_submissions) AS submissionsCount,
      (SELECT COUNT(*) FROM recent_activity) AS activitiesCount
  `;

  db.query(statsSql, (err, rows) => {
    if (err) {
      console.error("Admin stats error:", err.message);
      return res.status(500).json({ message: "Unable to load dashboard statistics." });
    }

    res.json({
      success: true,
      stats: rows[0] || {
        usersCount: 0,
        awarenessCount: 0,
        knowledgeCount: 0,
        submissionsCount: 0,
        activitiesCount: 0,
      },
    });
  });
});

// ============================================
// USER MANAGEMENT ENDPOINTS
// ============================================
router.get("/users", verifyAdmin, (req, res) => {
  const sql = "SELECT id, name, email, created_at FROM users ORDER BY id DESC";

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Admin fetch users error:", err.message);
      return res.status(500).json({ message: "Failed to load registered users." });
    }

    res.json(rows || []);
  });
});

router.delete("/users/:id", verifyAdmin, (req, res) => {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  // Delete associated user activities and forms first
  db.query("DELETE FROM recent_activity WHERE user_id = ?", [userId], () => {
    db.query("DELETE FROM legal_form_submissions WHERE user_id = ?", [userId], () => {
      db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
        if (err) {
          console.error("Admin delete user error:", err.message);
          return res.status(500).json({ message: "Failed to delete user." });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found." });
        }

        res.json({ success: true, message: "User and related records deleted successfully." });
      });
    });
  });
});

// ============================================
// LEGAL AWARENESS CRUD
// ============================================
router.get("/legal-awareness", verifyAdmin, (req, res) => {
  const sql = "SELECT * FROM legal_awareness ORDER BY id DESC";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "Failed to load awareness records." });
    res.json(rows || []);
  });
});

router.post("/legal-awareness", verifyAdmin, (req, res) => {
  const {
    title, category, description, law_explanation,
    applicable_section, applies_to, exceptions, practical_example, help_information
  } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ message: "Title, category, and description are required." });
  }

  const sql = `
    INSERT INTO legal_awareness
    (title, category, description, law_explanation, applicable_section, applies_to, exceptions, practical_example, help_information)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    title.trim(), category.trim(), description.trim(),
    law_explanation || null, applicable_section || null,
    applies_to || null, exceptions || null, practical_example || null,
    help_information || null
  ], (err, result) => {
    if (err) {
      console.error("Create awareness error:", err.message);
      return res.status(500).json({ message: "Failed to create legal awareness record." });
    }
    res.status(201).json({ success: true, message: "Record added successfully", id: result.insertId });
  });
});

router.put("/legal-awareness/:id", verifyAdmin, (req, res) => {
  const id = Number(req.params.id);
  const {
    title, category, description, law_explanation,
    applicable_section, applies_to, exceptions, practical_example, help_information
  } = req.body;

  if (!Number.isInteger(id) || id <= 0 || !title || !category || !description) {
    return res.status(400).json({ message: "Valid ID, title, category, and description required." });
  }

  const sql = `
    UPDATE legal_awareness
    SET title = ?, category = ?, description = ?, law_explanation = ?,
        applicable_section = ?, applies_to = ?, exceptions = ?, practical_example = ?, help_information = ?
    WHERE id = ?
  `;

  db.query(sql, [
    title.trim(), category.trim(), description.trim(),
    law_explanation || null, applicable_section || null,
    applies_to || null, exceptions || null, practical_example || null,
    help_information || null, id
  ], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to update record." });
    res.json({ success: true, message: "Record updated successfully." });
  });
});

router.delete("/legal-awareness/:id", verifyAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.query("DELETE FROM legal_awareness WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete record." });
    res.json({ success: true, message: "Record deleted successfully." });
  });
});

// ============================================
// AI LEGAL KNOWLEDGE CRUD
// ============================================
router.get("/ai-legal-knowledge", verifyAdmin, (req, res) => {
  const sql = "SELECT * FROM ai_legal_knowledge ORDER BY id DESC";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "Failed to load legal knowledge." });
    res.json(rows || []);
  });
});

router.post("/ai-legal-knowledge", verifyAdmin, (req, res) => {
  const {
    title, act_name, section_number, keywords,
    explanation, tamil_explanation, rights, guidance, source_url
  } = req.body;

  if (!title || !explanation) {
    return res.status(400).json({ message: "Title and explanation are required." });
  }

  const sql = `
    INSERT INTO ai_legal_knowledge
    (title, act_name, section_number, keywords, explanation, tamil_explanation, rights, guidance, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    title.trim(), act_name || null, section_number || null, keywords || null,
    explanation.trim(), tamil_explanation || null, rights || null, guidance || null, source_url || null
  ], (err, result) => {
    if (err) {
      console.error("Create AI knowledge error:", err.message);
      return res.status(500).json({ message: "Failed to add AI knowledge record." });
    }
    res.status(201).json({ success: true, message: "Knowledge added successfully", id: result.insertId });
  });
});

router.put("/ai-legal-knowledge/:id", verifyAdmin, (req, res) => {
  const id = Number(req.params.id);
  const {
    title, act_name, section_number, keywords,
    explanation, tamil_explanation, rights, guidance, source_url
  } = req.body;

  if (!Number.isInteger(id) || id <= 0 || !title || !explanation) {
    return res.status(400).json({ message: "Valid ID, title, and explanation are required." });
  }

  const sql = `
    UPDATE ai_legal_knowledge
    SET title = ?, act_name = ?, section_number = ?, keywords = ?,
        explanation = ?, tamil_explanation = ?, rights = ?, guidance = ?, source_url = ?
    WHERE id = ?
  `;

  db.query(sql, [
    title.trim(), act_name || null, section_number || null, keywords || null,
    explanation.trim(), tamil_explanation || null, rights || null, guidance || null, source_url || null, id
  ], (err) => {
    if (err) return res.status(500).json({ message: "Failed to update AI knowledge record." });
    res.json({ success: true, message: "AI knowledge record updated." });
  });
});

router.delete("/ai-legal-knowledge/:id", verifyAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.query("DELETE FROM ai_legal_knowledge WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Failed to delete knowledge record." });
    res.json({ success: true, message: "Knowledge record deleted." });
  });
});

// ============================================
// ALL SYSTEM RECENT ACTIVITIES
// ============================================
router.get("/recent-activity", verifyAdmin, (req, res) => {
  const sql = `
    SELECT r.id, r.user_id, u.name AS user_name, u.email AS user_email,
           r.activity, r.activity_type, r.created_at
    FROM recent_activity r
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
    LIMIT 60
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Admin activity error:", err.message);
      return res.status(500).json({ message: "Failed to load system activity logs." });
    }
    res.json(rows || []);
  });
});

module.exports = router;
