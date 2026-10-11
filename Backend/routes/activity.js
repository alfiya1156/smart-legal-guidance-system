const express = require("express");
const router = express.Router();
const db = require("../db");

console.log("ACTIVITY ROUTES LOADED");

router.get("/:userId", (req, res) => {
    console.log("Activity GET route hit:", req.params.userId);
  const { userId } = req.params;

  if (!Number.isInteger(Number(userId)) || Number(userId) <= 0) {
    return res.status(400).json({
      message: "Valid user ID is required",
    });
  }

  const sql = `
    SELECT id, activity, activity_type, created_at
    FROM recent_activity
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 10
  `;

  db.query(sql, [Number(userId)], (err, results) => {
    if (err) {
      console.error("Fetch activity error:", err.message);
      return res.status(500).json({
        message: "Failed to fetch recent activities",
      });
    }

    res.json(results);
  });
});

// POST: Save a recent activity
router.post("/", (req, res) => {
  const { user_id, activity, activity_type } = req.body;

  if (
    !Number.isInteger(Number(user_id)) ||
    Number(user_id) <= 0 ||
    typeof activity !== "string" ||
    !activity.trim() ||
    activity.trim().length > 255
  ) {
    return res.status(400).json({
      message: "Valid user ID and activity are required",
    });
  }

  const sql = `
    INSERT INTO recent_activity
      (user_id, activity, activity_type)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [
      Number(user_id),
      activity.trim(),
      typeof activity_type === "string"
        ? activity_type.trim().slice(0, 100)
        : "General",
    ],
    (err, result) => {
      if (err) {
        console.error("Save activity error:", err.message);
        return res.status(500).json({
          message: "Failed to save activity",
        });
      }

      res.status(201).json({
        message: "Activity saved successfully",
        id: result.insertId,
      });
    }
  );
});

module.exports = router;
