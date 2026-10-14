
const express = require("express");
const router = express.Router();
const db = require("../db");

// AI Assistant - Search legal information from MySQL
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (
      typeof question !== "string" ||
      !question.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter your legal question.",
      });
    }

    // Convert the question into searchable words
    const stopWords = new Set([
      "what", "is", "are", "the", "a", "an",
      "of", "to", "in", "for", "and", "my",
      "me", "i", "do", "does", "can", "how",
      "tell", "about", "please", "article"
    ]);

    const keywords = [
      ...new Set(
        question
          .toLowerCase()
          .match(/[a-zA-Z0-9\u0B80-\u0BFF]+/g) || []
      )
    ].filter(
      (word) => word.length >= 2 && !stopWords.has(word)
    );

    if (keywords.length === 0) {
      return res.json({
        success: true,
        question,
        answer:
          "Please enter more details about your legal question."
      });
    }

    // Search relevant records in the chatbot knowledge table
    const columns = [
      "title",
      "act_name",
      "section_number",
      "keywords",
      "explanation",
      "tamil_explanation",
      "rights",
      "guidance"
    ];

    const conditions = [];
    const values = [];

    keywords.forEach((word) => {
      const wordConditions = columns.map(
        (column) => `${column} LIKE ?`
      );

      conditions.push(`(${wordConditions.join(" OR ")})`);

      columns.forEach(() => {
        values.push(`%${word}%`);
      });
    });

    const sql = `
      SELECT
        id,
        title,
        act_name,
        section_number,
        explanation,
        tamil_explanation,
        rights,
        guidance,
        source_url
      FROM ai_legal_knowledge
      WHERE ${conditions.join(" OR ")}
      LIMIT 5
    `;

    db.query(sql, values, (error, results) => {
      if (error) {
        console.error("AI legal database error:", error);

        return res.status(500).json({
          success: false,
          message: "Unable to retrieve legal information right now."
        });
      }

      if (results.length === 0) {
        return res.json({
          success: true,
          question,
          answer:
            "Sorry, I couldn't find relevant information in the current legal knowledge database. Please try another question or consult a qualified legal professional."
        });
      }

      // Prepare the answer using retrieved legal records
      const answer = results
        .map((law) => {
          return [
            `Topic: ${law.title}`,
            `Law: ${law.act_name || "Not specified"}`,
            `Article / Section: ${law.section_number || "Not specified"}`,
            `Explanation: ${law.explanation}`,
            law.tamil_explanation
              ? `Tamil Explanation: ${law.tamil_explanation}`
              : "",
            law.rights ? `Rights: ${law.rights}` : "",
            law.guidance ? `Guidance: ${law.guidance}` : "",
            law.source_url ? `Source: ${law.source_url}` : ""
          ]
            .filter(Boolean)
            .join("\n");
        })
        .join("\n\n--------------------\n\n");

      return res.json({
        success: true,
        question,
        answer
      });
    });
  } catch (error) {
    console.error("AI Assistant error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process your question right now."
    });
  }
});

module.exports = router;
