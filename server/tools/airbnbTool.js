import { Tool } from "langchain/tools";
import axios from "axios";

export class AirbnbTool extends Tool {
  name = "airbnb";
  description = "Search listings on Airbnb";

  /**
   * query אמור להיות אובייקט כמו:
   * {
   *   location: "Paris",
   *   guests: 2,
   *   checkin: "2025-06-01",
   *   checkout: "2025-06-05"
   * }
   */
  async _call(query) {
    try {
      let parsed = typeof query === "string" ? JSON.parse(query) : query;

      const {
        location = "Tel Aviv",
        guests = 1,
        checkin = "2025-01-01",
        checkout = "2025-01-05",
      } = parsed;

      const apiKey = process.env.RAPIDAPI_KEY;
      if (!apiKey) {
        throw new Error("Missing RAPIDAPI_KEY in environment variables.");
      }

      const response = await axios.get("https://airbnb13.p.rapidapi.com/search-location", {
        params: {
          location,
          checkin,
          checkout,
          adults: guests,
          currency: "USD",
        },
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "airbnb13.p.rapidapi.com"
        }
      });

      return JSON.stringify(response.data.results.slice(0, 5)); // מחזיר רק 5 תוצאות לדוגמה

    } catch (err) {
      console.error("AirbnbTool error:", err);
      return JSON.stringify({ error: "Airbnb API error", details: err.message });
    }
  }
}
