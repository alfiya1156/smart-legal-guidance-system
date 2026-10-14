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

    const [result] = await db.execute(sql, values);

    return res.status(201).json({
      success: true,
      message: "Legal form draft generated and saved successfully.",
      formId: result.insertId,
      formTitle,
      draft,
    });
  } catch (error) {
    console.error("Form generation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate the form. Please try again.",
    });
  }
});

router.get("/submission/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid form ID.",
      });
    }

    const [rows] = await db.execute(
      `SELECT id, form_type, applicant_name, subject,
              generated_draft, status, created_at
       FROM legal_form_submissions
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }

    res.json({ success: true, form: rows[0] });
  } catch (error) {
    console.error("Fetch form error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve the form.",
    });
  }
});

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Forms route is working!",
  });
});

module.exports = router;
