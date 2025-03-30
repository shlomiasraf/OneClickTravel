import { AirbnbTool } from "../tools/airbnbTool.js";
import { BookingTool } from "../tools/bookingTool.js";

export class LodgingAgent {
  constructor() {
    this.tools = [new AirbnbTool(), new BookingTool()];
  }

  async findOptions({ destination, startDate, endDate, numPeople }) {
    const query = {
      location: destination,
      guests: numPeople,
      checkin: startDate,
      checkout: endDate,
    };

    const allResults = [];

    for (const tool of this.tools) {
      try {
        const response = await tool._call(query);
        const hotels = JSON.parse(response);
        allResults.push(...hotels);
      } catch (err) {
        console.warn(`⚠️ LodgingAgent warning from ${tool.name}:`, err.message);
      }
    }

    return allResults;
  }
}
