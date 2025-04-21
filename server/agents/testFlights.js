import dotenv from "dotenv";
dotenv.config();

import { FlightsAgent } from "./flightAgent.js";
import { CheapestStrategy } from "../strategies/selectionStrategy.js";

const agent = new FlightsAgent();

const test = async () => {
  const flights = await agent.findOptions({
    origin: "TLV",               // תל אביב
    destination: "LHR",          // לונדון
    startDate: "2025-05-10",     // תאריך עתידי
    numPeople: 1
  });

  if (!flights || flights.length === 0) {
    console.log("❌ No flights found or error from API");
    return;
  }

  console.log(`✈️ Found ${flights.length} flight options:\n`);

  // מדפיס את כל האפשרויות (כמו mainAgent)
  flights.forEach((flight, i) => {
    console.log(`✈️ Option ${i + 1}:`);
    console.log(`   🛫 ${flight.departure} → ${flight.arrival}`);
    console.log(`   🕒 ${new Date(flight.departureTime).toLocaleString()} → ${new Date(flight.arrivalTime).toLocaleString()}`);
    console.log(`   💵 $${flight.price} ${flight.currency}`);
    console.log(`   🏷️ Airline(s): ${flight.airline}`);
    console.log("––––––––––––––––––––––––––––––\n");
  });

  // בוחר את האפשרות הכי זולה
  const strategy = new CheapestStrategy();
  const bestFlight = strategy.chooseOption(flights);

  console.log("✅ Best flight selected by strategy:");
  console.dir(bestFlight, { depth: null });
};

test();
