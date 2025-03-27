// server/agents/mainAgent.js
import { runFlightAgent } from "./flightAgent.js";
import { runLodgingAgent } from "./lodgingAgent.js";

/**
 * מקבל מהמשתמש:
 * destination, startDate, endDate, numPeople, budget
 * מפעיל את flightAgent ואת lodgingAgent
 * ומחזיר "חבילת חופשה" בהתאם לתקציב.
 */
export async function runMainAgent({ destination, startDate, endDate, numPeople, budget }) {
  // 1. קריאה לסוכן טיסות
  const flightResults = await runFlightAgent({ destination, startDate, endDate, numPeople });
  // flightResults אמור להיות מערך עם כמה אופציות (price, airline וכו’)

  // 2. קריאה לסוכן לינה
  const lodgingResults = await runLodgingAgent({ destination, startDate, endDate, numPeople });
  // lodgingResults אמור להיות מערך של {price, name, type, ...}

  // 3. בוחרים את הטיסה והמלון/דירה עם המחיר הכולל המתאים לתקציב
  // לדוגמה: ניקח את הזול ביותר מכל קטגוריה ונבדוק האם נכנס בתקציב
  const bestFlight = findCheapestOption(flightResults);
  const bestLodging = findCheapestOption(lodgingResults);

  const totalPrice = (bestFlight?.price ?? 0) + (bestLodging?.price ?? 0);

  // החזר חבילה
  return {
    flight: bestFlight,
    lodging: bestLodging,
    totalPrice,
    withinBudget: totalPrice <= (budget || 9999999),
  };
}

function findCheapestOption(arr) {
  if (!arr || arr.length === 0) return null;
  // ממיינים ומחזירים ראשון
  const sorted = arr.sort((a, b) => a.price - b.price);
  return sorted[0];
}