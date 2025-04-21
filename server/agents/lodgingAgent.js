import { AmadeusHotelsTool } from "../tools/amadeusHotelsTool.js";

export class LodgingAgent {
  constructor() {
    this.tool = new AmadeusHotelsTool();
  }

  async findOptions({ destination, startDate, endDate, numPeople }) {
    const query = {
      location: destination,
      checkin: startDate,
      checkout: endDate,
      guests: numPeople,
    };

    console.log("📤 LodgingAgent query:", query); // חובה לבדוק מה נשלח
    try {
      const response = await this.tool._call(query);
      const hotels = JSON.parse(response);
      return hotels;
    } catch (err) {
      console.warn(`⚠️ LodgingAgent error:`, err.message);
      return [];
    }
  }
}

