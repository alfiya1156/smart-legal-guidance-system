
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all legal awareness records
router.get("/", (req, res) => {
  const sql = `
    SELECT
      id,
      title,
      category,
      description,
      law_explanation,
      applicable_section,
      applies_to,
      exceptions,
      practical_example,
      help_information,
      created_at
    FROM legal_awareness
    ORDER BY id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Legal Awareness Error:", err);

      return res.status(500).json({
        message: "Failed to fetch legal awareness data",
      });
    }

    res.json(results);
  });
});

// GET one legal awareness record by ID
router.get("/:id", (req, res) => {
  const sql = `
    SELECT
      id,
      title,
      category,
      description,
      law_explanation,
      applicable_section,
      applies_to,
      exceptions,
      practical_example,
      help_information,
      created_at
    FROM legal_awareness
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("Legal Awareness Error:", err);

      return res.status(500).json({
        message: "Failed to fetch legal awareness details",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Legal awareness entry not found",
      });
    }

    res.json(results[0]);
  });
});

module.exports = router;
