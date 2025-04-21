// server/app.js
import express from "express";
import cors from "cors";
import { runMainAgent } from "./agents/mainAgent.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/vacation", async (req, res) => {
  try {
    console.log("📡 /api/vacation called!");
    console.log("🧾 Request body:", req.body);
    const { destination, startDate, endDate, numPeople, budget, style } = req.body;
    // style יכול להיות "cheap" או "fancy"...
    const packageResult = await runMainAgent({ 
      destination, 
      startDate, 
      endDate, 
      numPeople, 
      budget,
      style
    });
    res.json({ package: packageResult });
  } catch (err) {
    console.error("Main Agent error:", err);
    res.status(500).json({ error: "Main agent execution failed." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});