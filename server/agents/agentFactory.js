// server/agents/agentFactory.js
import { FlightsAgent } from "./flightAgent.js";
import { LodgingAgent } from "./lodgingAgent.js";
// אם תרצה, תוכל להוסיף אחרים: InsuranceAgent, CarRentalAgent, ...

export function createAgent(agentType) {
  switch (agentType) {
    case "flights":
      return new FlightsAgent();
    case "lodging":
      return new LodgingAgent();
    // case "insurance":
    //   return new InsuranceAgent();
    default:
      throw new Error(`Unknown agent type: ${agentType}`);
  }
}