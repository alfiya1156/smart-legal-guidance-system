const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activity");
const legalAwarenessRoutes = require("./routes/legalAwareness");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test-activity", (req, res) => {
  res.send("Activity test route is working!");
});

app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/legal-awareness", legalAwarenessRoutes);

app.get("/test-legal", (req, res) => {
  res.send("Legal route is working!");
});

app.get("/", (req, res) => {
  res.send("Smart Legal Guidance System Backend is Running!");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});