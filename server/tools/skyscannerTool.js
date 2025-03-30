// server/tools/skyscannerTool.js
import { Tool } from "langchain/tools";
import axios from "axios";

export class SkyscannerTool extends Tool {
  // שם שיזהה את הכלי (לא חובה אם עושים StructuredTool)
  name = "skyscanner";
  description = "Search flights on Skyscanner";

  // המתודה שה-LangChain Agent יקרא לה
  async _call(query) {
    // לדוגמה, נפרש מתוך ⁠ query ⁠ את המידע.
    // בדוגמה למעלה, העברנו prompt שלם, אבל אפשר פה לנתח string JSON
    // או לקבל אובייקט מהסוכן. תלוי איך הגדרת את הסוכן שלך.

    // כאן עושים את הקריאה האמיתית ל-API של Skyscanner
    // בדוגמה: GET/POST לכתובת Skyscanner עם axios
    // כמובן צריך מפתח API וכתובת מתאימים.
    try {
      const apiKey = process.env.SKYSCANNER_API_KEY; // לדוגמה
      const response = await axios.get("https://partners.api.skyscanner.net/...", {
        params: {
          // את הפרמטרים הרלוונטיים לטיסה
          // origin: ...
          // destination: ...
          // וכו’.
        },
        headers: {
          "apikey": apiKey,
        },
      });

      // מעבדים את התשובה לפורמט JSON מתאים
      const data = response.data; // מה שסקייסקאנר מחזיר
      return JSON.stringify(data);

    } catch (err) {
      console.error("SkyscannerTool error:", err);
      return JSON.stringify({ error: "Skyscanner API error" });
    }
  }
}