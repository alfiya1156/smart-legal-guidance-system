const express = require("express");
const router = express.Router();
const db = require("../db");

const allowedForms = {
  police: "Police Complaint",
  "cyber-crime": "Cyber Crime Complaint",
  rti: "RTI Application",
  consumer: "Consumer Complaint",
  grievance: "Government Grievance",
};

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

router.post("/generate", async (req, res) => {
  try {
    const {
      userId,
      formType,
      applicantName,
      email,
      phone,
      subject,
      incidentDate,
      description,
    } = req.body;

    if (!allowedForms[formType]) {
      return res.status(400).json({
        success: false,
        message: "Invalid form type.",
      });
    }

    const name = clean(applicantName);
    const title = clean(subject);
    const details = clean(description);
    const userEmail = clean(email);
    const userPhone = clean(phone);

    if (!name || !title || !details) {
      return res.status(400).json({
        success: false,
        message: "Name, subject and description are required.",
      });
    }

    if (
      name.length > 150 ||
      title.length > 255 ||
      details.length > 10000 ||
      userEmail.length > 150 ||
      userPhone.length > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length.",
      });
    }

    let date = null;

    if (incidentDate) {
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(incidentDate) ||
        Number.isNaN(Date.parse(incidentDate))
      ) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid incident date.",
        });
      }

      date = incidentDate;
    }

    const formTitle = allowedForms[formType];

    const draft = [
      formTitle.toUpperCase(),
      "",
      "To: The Concerned Authority",
      "",
      "Subject: " + title,
      "",
      "Respected Sir/Madam,",
      "",
      "I, " + name + ", wish to submit this representation regarding the following matter:",
      "",
      details,
      "",
      date ? "Date of incident: " + date : "",
      "",
      "I request the concerned authority to examine the matter and take appropriate action according to applicable law and procedure.",
      "",
      "Applicant Name: " + name,
      userEmail ? "Email: " + userEmail : "",
      userPhone ? "Phone: " + userPhone : "",
      "",
      "Date of submission: __________________",
      "Signature: __________________",
      "",
      "Note: This is a general draft. Verify the facts, applicable rules, required documents and submission procedure with the appropriate authority before submitting.",
    ]
      .filter((line) => line !== "")
      .join("\n");

    const sql = `
      INSERT INTO legal_form_submissions
      (
        user_id, form_type, applicant_name, email, phone,
        subject, incident_date, description, generated_draft
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      Number.isInteger(userId) && userId > 0 ? userId : null,
      formType,
      name,
      userEmail || null,
      userPhone || null,
      title,
      date,
      details,
      draft,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Form generation database error:", err.message);
        return res.status(500).json({
          success: false,
          message: "Unable to save the form draft to database.",
        });
      }

      // Also log this in recent_activity if userId is provided
      if (values[0]) {
        const actSql = `INSERT INTO recent_activity (user_id, activity, activity_type) VALUES (?, ?, 'Forms Generator')`;
        db.query(actSql, [values[0], `Generated ${formTitle} draft`], (actErr) => {
          if (actErr) console.warn("Activity log failed for form:", actErr.message);
        });
      }

      return res.status(201).json({
        success: true,
        message: "Legal form draft generated and saved successfully.",
        formId: result.insertId,
        formTitle,
        draft,
      });
    });
  } catch (error) {
    console.error("Form generation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate the form. Please try again.",
    });
  }
});

router.get("/submission/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid form ID.",
    });
  }

  const sql = `
    SELECT id, form_type, applicant_name, email, phone, subject,
           incident_date, description, generated_draft, status, created_at
    FROM legal_form_submissions
    WHERE id = ?
    LIMIT 1
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("Fetch form error:", err.message);
      return res.status(500).json({
        success: false,
        message: "Unable to retrieve the form.",
      });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }

    res.json({ success: true, form: rows[0] });
  });
});

router.get("/user/:userId", (req, res) => {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID.",
    });
  }

  const sql = `
    SELECT id, form_type, applicant_name, subject, status, created_at
    FROM legal_form_submissions
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 20
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("Fetch user forms error:", err.message);
      return res.status(500).json({
        success: false,
        message: "Unable to retrieve user forms.",
      });
    }

    res.json({ success: true, forms: rows || [] });
  });
});

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Forms route is working!",
  });
});

module.exports = router;
