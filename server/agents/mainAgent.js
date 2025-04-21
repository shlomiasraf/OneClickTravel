import { createAgent } from "./agentFactory.js";
import { CheapestStrategy, FancyStrategy } from "../strategies/selectionStrategy.js";
import { resolveCityToIATA } from "../utils/iataResolver.js"; // ✅ חדש

/**
 * הסוכן המנהל:
 * 1. בונה / לוקח את סוכני הטיסות והלינה
 * 2. ממיר את העיר לקוד IATA
 * 3. מפעיל את הסוכנים
 * 4. בוחר את האופציה הטובה ביותר בהתאם לסגנון (Strategy)
 * 5. מחזיר למשתמש חבילה
 */
export async function runMainAgent({ destination, startDate, endDate, numPeople, budget, style }) {
  console.log("🤖 Running main agent with:", { destination, startDate, endDate, numPeople, budget, style });

  const originCode = "TLV"; // מוצא קבוע מתל אביב
  const destinationCode = resolveCityToIATA(destination); // 🗺 המרה לקוד תקני

  // ניצור סוכנים
  const flightAgent = createAgent("flights");
  const lodgingAgent = createAgent("lodging");

  // שליפת תוצאות
  const flightResults = await flightAgent.findOptions({
    origin: originCode,
    destination: destinationCode,
    startDate,
    endDate,
    numPeople
  });
  
  console.log(`🛫 Fetched ${flightResults.length} flight options:`);
  console.dir(flightResults, { depth: null });

  const lodgingResults = await lodgingAgent.findOptions({
    destination: destinationCode, // גם כאן משתמשים בקוד
    startDate,
    endDate,
    numPeople
  });
  console.log(`🏨 Fetched ${lodgingResults.length} lodging options:`);
  console.dir(lodgingResults, { depth: null });

  // אסטרטגיה
  const strategy = style === "fancy" ? new FancyStrategy() : new CheapestStrategy();

  // בחירה
  const bestFlight = strategy.chooseOption(flightResults);
  if (bestFlight) 
  {
    const airlines = [...new Set(
      bestFlight.segments?.map(seg => seg.carrier?.trim()).filter(Boolean)
    )];
  
    bestFlight.title = `טיסת ${airlines.join(", ").replace(/\s+/g, " ")}`.trim();
  
    bestFlight.description = bestFlight.segments?.map(seg => {
      const dep = new Date(seg.departureTime || seg.time?.split(" → ")[0] || seg.time?.split("→")[0]);
      const arr = new Date(seg.arrivalTime || seg.time?.split(" → ")[1] || seg.time?.split("→")[1]);
      return (
        `מ-${seg.from} ל-${seg.to}\n` +
        `יציאה: ${dep.toLocaleString("he-IL")}\n` +
        `הגעה: ${arr.toLocaleString("he-IL")}`
      );
    }).join(`\n\n---\n\n`);
  }  
  const bestLodging = strategy.chooseOption(lodgingResults);
  const totalPrice =
  (Number.isFinite(bestFlight?.price) ? bestFlight.price : 0) +
  (Number.isFinite(bestLodging?.price) ? bestLodging.price : 0);
  
  console.log("✈️ Best Flight:", bestFlight);
  console.log("🏨 Best Lodging:", bestLodging);
  console.log("💰 Total Price:", totalPrice);

  return {
    flight: bestFlight,
    lodging: bestLodging,
    totalPrice,
    withinBudget: totalPrice <= (budget || 9999999),
  };
}
