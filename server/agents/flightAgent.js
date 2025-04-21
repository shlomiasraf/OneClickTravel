import { AmadeusFlightsTool } from "../tools/amadeusFlightsTool.js";

export class FlightsAgent {
  constructor() {
    this.tool = new AmadeusFlightsTool(); 
  }

  async findOptions({ origin = "TLV", destination, startDate, endDate, numPeople }) {
    try {
      console.log("📦 findOptions called with:", { origin, destination, startDate, endDate, numPeople });

      const outboundQuery = {
        origin,
        destination,
        departureDate: startDate,
        adults: numPeople,
      };
      console.log("✈️ Outbound query:", outboundQuery);

      const returnQuery = {
        origin: destination,
        destination: origin,
        departureDate: endDate,
        adults: numPeople,
      };
      console.log("🔁 Return query:", returnQuery);

      const outboundRes = await this.tool._call(JSON.stringify(outboundQuery));

      const returnRes = await this.tool._call(JSON.stringify(returnQuery));
      console.log("📥 Return response:", returnRes);

      const outboundFlights = JSON.parse(outboundRes) || [];
      const returnFlights = JSON.parse(returnRes) || [];

      console.log("🛫 Parsed outbound flights:", outboundFlights);
      console.log("🔙 Parsed return flights:", returnFlights);

      const combinedTrips = [];
      let id = 1;

      for (const outbound of outboundFlights) {
        console.log("➡️ Outbound flight:", outbound);
        for (const inbound of returnFlights) {
          console.log("⬅️ Inbound flight:", inbound);

          const totalPrice = 
            (Number.isFinite(outbound.price) ? outbound.price : 0) + 
            (Number.isFinite(inbound.price) ? inbound.price : 0);
          console.log("💰 Total price:", totalPrice);

          const trip = {
            id: String(id++),
            departure: outbound.departure,
            arrival: outbound.arrival,
            departureTime: outbound.departureTime,
            arrivalTime: outbound.arrivalTime,
            returnTime: inbound.arrivalTime,
            price: totalPrice,
            currency: outbound.currency || "USD",
            airline: `${outbound.airline}, ${inbound.airline}`,
            segments: [...outbound.segments, ...inbound.segments],
          };

          console.log("🧳 Combined trip:", trip);
          combinedTrips.push(trip);
        }
      }

      console.log("✅ All combined trips:", combinedTrips);
      return combinedTrips;
    } catch (err) {
      console.error("✈️ FlightsAgent error:", err?.response?.data || err.message);
      return [];
    }
  }
}
