
require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./db");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter admin name: ", (name) => {
  rl.question("Enter admin email: ", (email) => {
    rl.question("Enter admin password: ", async (password) => {
      name = name.trim();
      email = email.trim();

      if (!name || !email || !password || password.length < 12) {
        console.log(
          "Enter all details. Password must be at least 12 characters."
        );
        rl.close();
        db.end();
        return;
      }

      try {
        const passwordHash = await bcrypt.hash(password, 12);

        const sql = `
          INSERT INTO admins (name, email, password_hash, role)
          VALUES (?, ?, ?, 'admin')
        `;

        db.query(
          sql,
          [name, email, passwordHash],
          (err, result) => {
            if (err) {
              if (err.code === "ER_DUP_ENTRY") {
                console.log("This admin email already exists.");
              } else {
                console.error("Admin creation failed:", err.message);
              }
            } else {
              console.log("Admin account created successfully!");
              console.log("Admin ID:", result.insertId);
              console.log("Email:", email);
            }

            rl.close();
            db.end();
          }
        );
      } catch (error) {
        console.error("Error:", error.message);
        rl.close();
        db.end();
      }
    });
  });
});
