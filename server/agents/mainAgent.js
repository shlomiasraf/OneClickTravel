// server/agents/mainAgent.js
import { createAgent } from "./agentFactory.js";
import { CheapestStrategy, FancyStrategy } from "../strategies/selectionStrategy.js";

/**
 * הסוכן המנהל:
 * 1. בונה / לוקח את סוכני הטיסות והלינה
 * 2. מפעיל אותם
 * 3. בוחר את האופציה הטובה ביותר בהתאם לסגנון (Strategy)
 * 4. מחזיר למשתמש חבילה
 */
export async function runMainAgent({ destination, startDate, endDate, numPeople, budget, style }) {
  console.log("🤖 Running main agent with:", { destination, startDate, endDate, numPeople, budget, style });
  // ניצור סוכנים באמצעות Factory
  const flightAgent = createAgent("flights");
  const lodgingAgent = createAgent("lodging");

  // מפעילים אותם
  const flightResults = await flightAgent.findOptions({ destination, startDate, endDate, numPeople });
  const lodgingResults = await lodgingAgent.findOptions({ destination, startDate, endDate, numPeople });

  // נשתמש ב-Strategy שונה לפי 'style' מהמשתמש (נניח 'fancy' או 'cheap')
  let strategy;
  if (style === "fancy") {
    strategy = new FancyStrategy();
  } else {
    strategy = new CheapestStrategy();
  }

  // בוחרים טיסה ומלון לפי ה-Strategy
  const bestFlight = strategy.chooseOption(flightResults);
  const bestLodging = strategy.chooseOption(lodgingResults);

  const totalPrice = (bestFlight?.price ?? 0) + (bestLodging?.price ?? 0);

  return {
    flight: bestFlight,
    lodging: bestLodging,
    totalPrice,
    withinBudget: totalPrice <= (budget || 9999999),
  };
}