import { Tool } from "langchain/tools";
import axios from "axios";

export class AmadeusFlightsTool extends Tool {
  name = "amadeus-flights";
  description = "Search flights using Amadeus API";

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
    try {
      const { origin, destination, departureDate, adults } = JSON.parse(input);

      // 🔍 לוג חשוב לבדוק את הערכים שנשלחים
      console.log("📤 AmadeusFlightsTool._call parameters:", {
        origin,
        destination,
        departureDate,
        adults
      });

      if (!origin || !destination || !departureDate || !adults) {
        console.warn("🚨 Missing required parameters in flight search");
        return JSON.stringify([]);
      }

      const token = await this._authenticate();

      const response = await axios.get("https://test.api.amadeus.com/v2/shopping/flight-offers", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate,
          adults,
          currencyCode: "USD",
          max: 5,
        },
      });

      const offers = response.data.data;

      const results = offers.map((offer, index) => {
        const itinerary = offer.itineraries[0];
        const segments = itinerary.segments;
        const departureSegment = segments[0];
        const arrivalSegment = segments[segments.length - 1];

        return {
          id: offer.id || index.toString(),
          departure: departureSegment.departure.iataCode,
          arrival: arrivalSegment.arrival.iataCode,
          departureTime: departureSegment.departure.at,
          arrivalTime: arrivalSegment.arrival.at,
          duration: itinerary.duration,
          price: parseFloat(offer.price.total),
          currency: offer.price.currency,
          airline: segments.map(seg => seg.carrierCode).join(", "),
          segments: segments.map(seg => ({
            from: seg.departure.iataCode,
            to: seg.arrival.iataCode,
            time: `${seg.departure.at} → ${seg.arrival.at}`,
            duration: seg.duration,
            carrier: seg.carrierCode,
            flightNumber: seg.number
          }))
        };
      });

      return JSON.stringify(results);

    } catch (err) {
      console.error("❌ AmadeusFlightsTool error:", err?.response?.data || err.message);
      return JSON.stringify([]);
    }
  }
}
