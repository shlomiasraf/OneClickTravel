// server/tools/bookingTool.js
import { Tool } from "langchain/tools";
import axios from "axios";

export class BookingTool extends Tool {
  name = "booking";
  description = "Search hotels on Booking.com";

  async _call(query) {
    try {
      // אולי יש לך BOOKING_API_KEY
      const apiKey = process.env.BOOKING_API_KEY;
      // מחרוזת או אובייקט parse
      const response = await axios.get("https://api.booking.com/v1/search", {
        headers: {
          "X-Api-Key": apiKey
        },
        params: {
          // parse the ⁠ query ⁠ to find e.g. destination, checkin, checkout
        }
      });
      const data = response.data;
      return JSON.stringify(data);
    } catch (err) {
      console.error("BookingTool error:", err);
      return JSON.stringify({ error: "Booking API error" });
    }
  }
}