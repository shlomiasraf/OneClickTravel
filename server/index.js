import express from "express";
import cors from "cors";

// נייבא את הסוכן הראשי שלנו
import { runMainAgent } from "./agents/mainAgent.js";

const app = express();
app.use(cors());
app.use(express.json());

// מסלול בו הלקוח שולח את הפרטים של החופשה
// למשל POST /api/vacation עם body שמכיל יעד, תאריכים, תקציב וכו’.
app.post("/api/vacation", async (req, res) => {
  try {
    const { destination, startDate, endDate, numPeople, budget } = req.body;

    // מפעילים את הסוכן הראשי עם הפרמטרים
    const packageResult = await runMainAgent({ 
      destination, 
      startDate, 
      endDate, 
      numPeople, 
      budget 
    });

    res.json({ package: packageResult });
  } catch (err) {
    console.error("Main Agent error:", err);
    res.status(500).json({ error: "Main agent execution failed." });
  }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
