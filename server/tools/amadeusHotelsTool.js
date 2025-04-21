import { Tool } from "langchain/tools";
import axios from "axios";

export class AmadeusHotelsTool extends Tool {
  name = "amadeus-hotels";
  description = "Search hotels using Amadeus API by cityCode and hotelIds";

  constructor() {
    super();
    this.clientId = process.env.AMADEUS_CLIENT_ID;
    this.clientSecret = process.env.AMADEUS_CLIENT_SECRET;
    this.token = null;
    this.tokenExpiresAt = 0;
  }

  async _authenticate() {
    const now = Date.now();
    if (this.token && now < this.tokenExpiresAt) return this.token;

    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    this.token = response.data.access_token;
    this.tokenExpiresAt = now + response.data.expires_in * 1000;
    return this.token;
  }

  async _call(input) {
    console.log("📥 Hotel search input:", input);

    try {
      const { location, checkin, checkout, guests } = input;
      if (!location || !checkin || !checkout || !guests) {
        throw new Error("Missing required parameters (location, checkin, checkout, guests)");
      }

      const token = await this._authenticate();

      const hotelListRes = await axios.get(
        "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { cityCode: location },
        }
      );

      const hotelsData = hotelListRes.data?.data || [];
      const hotelIds = hotelsData.map(h => h.hotelId).slice(0, 1);
      if (hotelIds.length === 0) {
        console.log("❌ No hotel IDs found for this city.");
        return JSON.stringify([]);
      }

      console.log("🏨 Found hotelIds:", hotelIds);

      const offersRes = await axios.get("https://test.api.amadeus.com/v2/shopping/hotel-offers", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          hotelIds: hotelIds.join(","),
          checkInDate: checkin,
          checkOutDate: checkout,
          adults: guests,
          currency: "USD",
          bestRateOnly: true,
          view: "FULL",
          sort: "PRICE"
        },
      });

      return JSON.stringify(offersRes.data.data);

    } catch (err) {
      console.error("AmadeusHotelTool error:", err?.response?.data || err.message);
      return JSON.stringify([]);
    }
  }
}
