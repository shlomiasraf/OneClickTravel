// server/agents/lodgingAgent.js
import { ChatOllama } from "langchain/chat_models/ollama";
import { createOpenAIToolsAgent, AgentExecutor } from "langchain/agents";

// שני כלים (פיקטיביים) ל-Booking ולאיירביאנבי
import { BookingTool } from "./tools/bookingTool.js";
import { AirbnbTool } from "./tools/airbnbTool.js";

export async function runLodgingAgent({ destination, startDate, endDate, numPeople }) {
  const booking = new BookingTool();
  const airbnb = new AirbnbTool();

  const chatModel = new ChatOllama({
    model: "llama3:8b",
    temperature: 0,
  });

  const agent = await createOpenAIToolsAgent({
    llm: chatModel,
    tools: [booking, airbnb],
  });
  const executor = new AgentExecutor({ agent, tools: [booking, airbnb] });

  const userPrompt = `
    Find lodging options from Booking & Airbnb for:
      Destination: ${destination}
      Start date: ${startDate}
      End date: ${endDate}
      Num. of people: ${numPeople}
    Return a JSON array with price, name, type, rating, etc.
  `;

  const result = await executor.invoke({ input: userPrompt });

  let lodgings = [];
  try {
    lodgings = JSON.parse(result.output);
  } catch (e) {
    console.warn("Could not parse lodging JSON:", e);
  }

  return lodgings;
}