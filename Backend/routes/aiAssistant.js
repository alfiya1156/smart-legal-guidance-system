
const express = require("express");
const router = express.Router();
const db = require("../db");

// AI Assistant - Search legal information from MySQL
router.post("/ask", async (req, res) => {
  try {
    const { question, language } = req.body;
    const isTamil = typeof language === "string" && language.toLowerCase().includes("tamil");

    if (
      typeof question !== "string" ||
      !question.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: isTamil
          ? "உங்கள் சட்ட கேள்வியை உள்ளிடவும்."
          : "Please enter your legal question.",
      });
    }

    // Convert the question into searchable words
    const stopWords = new Set([
      "what", "is", "are", "the", "a", "an",
      "of", "to", "in", "for", "and", "my",
      "me", "i", "do", "does", "can", "how",
      "tell", "about", "please", "article", "section", "law"
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
        answer: isTamil
          ? "தயவுசெய்து உங்கள் சட்ட கேள்வி பற்றிய கூடுதல் விவரங்களை உள்ளிடவும்."
          : "Please enter more details about your legal question."
      });
    }

    // Search relevant records in the chatbot knowledge table first
    const columns = [
      "title", "act_name", "section_number", "keywords",
      "explanation", "tamil_explanation", "rights", "guidance"
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
        id, title, act_name, section_number,
        explanation, tamil_explanation, rights, guidance, source_url
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

      if (results && results.length > 0) {
        const answer = results
          .map((law) => {
            if (isTamil && law.tamil_explanation) {
              return [
                `தலைப்பு: ${law.title}`,
                `சட்டம்: ${law.act_name || "இந்திய சட்டம்"}`,
                `பிரிவு / விதி: ${law.section_number || "குறிப்பிடப்படவில்லை"}`,
                `விளக்கம்: ${law.tamil_explanation}`,
                law.rights ? `உரிமைகள்: ${law.rights}` : "",
                law.guidance ? `வழிகாட்டுதல்: ${law.guidance}` : "",
                law.source_url ? `மூலம்: ${law.source_url}` : ""
              ].filter(Boolean).join("\n");
            }

            return [
              `Topic: ${law.title}`,
              `Law: ${law.act_name || "Constitution / Indian Law"}`,
              `Article / Section: ${law.section_number || "Not specified"}`,
              `Explanation: ${law.explanation}`,
              law.tamil_explanation && !isTamil ? `Tamil Summary: ${law.tamil_explanation}` : "",
              law.rights ? `Key Rights: ${law.rights}` : "",
              law.guidance ? `Guidance: ${law.guidance}` : "",
              law.source_url ? `Reference: ${law.source_url}` : ""
            ].filter(Boolean).join("\n");
          })
          .join("\n\n--------------------\n\n");

        return res.json({ success: true, question, answer });
      }

      // FALLBACK: Search legal_awareness and legal_rights tables
      const fallbackAwarenessSql = `
        SELECT title, category, description, law_explanation, applicable_section, practical_example, help_information
        FROM legal_awareness
        WHERE ${keywords.map(() => "(title LIKE ? OR category LIKE ? OR description LIKE ? OR applicable_section LIKE ?)").join(" OR ")}
        LIMIT 3
      `;
      const fallbackValues = [];
      keywords.forEach((w) => {
        fallbackValues.push(`%${w}%`, `%${w}%`, `%${w}%`, `%${w}%`);
      });

      db.query(fallbackAwarenessSql, fallbackValues, (err2, fallbackRows) => {
        if (!err2 && fallbackRows && fallbackRows.length > 0) {
          const fallbackAnswer = fallbackRows.map((row) => [
            `Topic: ${row.title}`,
            `Category: ${row.category}`,
            row.applicable_section ? `Section / Article: ${row.applicable_section}` : "",
            `Explanation: ${row.law_explanation || row.description}`,
            row.practical_example ? `Practical Example: ${row.practical_example}` : "",
            row.help_information ? `Where to get help: ${row.help_information}` : ""
          ].filter(Boolean).join("\n")).join("\n\n--------------------\n\n");

          return res.json({ success: true, question, answer: fallbackAnswer });
        }

        // Secondary Fallback: search legal_rights
        const fallbackRightsSql = `
          SELECT title, category, article, description, law_explanation, practical_example, help_information
          FROM legal_rights
          WHERE ${keywords.map(() => "(title LIKE ? OR category LIKE ? OR article LIKE ? OR description LIKE ?)").join(" OR ")}
          LIMIT 3
        `;
        db.query(fallbackRightsSql, fallbackValues, (err3, rightRows) => {
          if (!err3 && rightRows && rightRows.length > 0) {
            const rightsAnswer = rightRows.map((row) => [
              `Topic: ${row.title}`,
              `Category: ${row.category}`,
              `Relevant Article / Section: ${row.article || "Applicable Law"}`,
              `Explanation: ${row.law_explanation || row.description}`,
              row.practical_example ? `Example: ${row.practical_example}` : "",
              row.help_information ? `Guidance: ${row.help_information}` : ""
            ].filter(Boolean).join("\n")).join("\n\n--------------------\n\n");

            return res.json({ success: true, question, answer: rightsAnswer });
          }

          // Not found
          const noMatchMsg = isTamil
            ? "மன்னிக்கவும், தற்போதைய சட்ட அறிவுத் தரவுத்தளத்தில் நேரடி தகவல் கிடைக்கவில்லை. இலவச சட்ட உதவிக்கு தேசிய சட்ட சேவைகள் ஆணையத்தின் (NALSA) உதவி எண் 15100 ஐ தொடர்பு கொள்ளலாம்."
            : "I couldn't find specific legal citations matching your query in the current knowledge base. For verified assistance, contact the National Legal Services Authority helpline at 15100 or your local District Legal Services Authority (DLSA).";

          return res.json({
            success: true,
            question,
            answer: noMatchMsg
          });
        });
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
