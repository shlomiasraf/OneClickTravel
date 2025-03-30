import { SkyscannerTool } from "../tools/skyscannerTool.js";

export class FlightsAgent {
  constructor() {
    this.tool = new SkyscannerTool(); // ← כלי יחיד
  }

  async findOptions({ destination, startDate, endDate, numPeople }) {
    const query = {
      location: destination,
      guests: numPeople,
      checkin: startDate,
      checkout: endDate,
    };

    try {
      const response = await this.tool._call(query); // ← הפעלה ישירה
      const flights = JSON.parse(response);
      return flights;
    } catch (err) {
      console.error("✈️ FlightsAgent error:", err);
      return [];
    }
  }
}
