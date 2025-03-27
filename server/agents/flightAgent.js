
import { ChatOllama } from "langchain/chat_models/ollama";
import { createOpenAIToolsAgent, AgentExecutor } from "langchain/agents";

// נניח יש כלי ל-Skyscanner (דמיוני או אמיתי)
import { SkyscannerTool } from "./tools/skyscannerTool.js"; 
// (תצטרך לממש או לשלב ספרייה שתדבר עם Skyscanner API בפועל)

export async function runFlightAgent({ destination, startDate, endDate, numPeople }) {
  // 1. מגדירים את הכלים לסוכן. עכשיו נגדיר Tool שמחפש טיסות ב-Skyscanner
  const skyscanner = new SkyscannerTool();

  // 2. מגדירים מודל שמדבר עם agent. (משתמשים ב-Ollama כדוגמה)
  const chatModel = new ChatOllama({
    model: "llama3:8b",
    temperature: 0,
  });

  // 3. יוצרים Prompt/סוכן
  // אפשר למשוך prompt מקובץ, או להשתמש ב-pull LangChain Hub, או לכתוב ידנית
  const agent = await createOpenAIToolsAgent({
    llm: chatModel,
    tools: [skyscanner],
    // prompt: ... 
  });

  const executor = new AgentExecutor({ agent, tools: [skyscanner] });

  // 4. מפעילים את הסוכן עם השאלה שלנו
  const userPrompt = `
    Find flights on Skyscanner for:
      Destination: ${destination}
      Start date: ${startDate}
      End date: ${endDate}
      Num. of people: ${numPeople}
    Return a JSON array of flight options with price, airline, flightNumber.
  `;

  const result = await executor.invoke({ input: userPrompt });

  // נניח הסוכן מחזיר מחרוזת JSON. ממירים למערך
  let flights = [];
  try {
    flights = JSON.parse(result.output);
  } catch (e) {
    console.warn("Could not parse flights JSON:", e);
    // נניח מחזירים מערך ריק
  }

  return flights; 
}