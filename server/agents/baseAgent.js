// server/agents/baseAgent.js

export class BaseAgent {
    constructor() {
      // מניעת יצירת אובייקטים ישירות ממחלקת הבסיס
      if (new.target === BaseAgent) {
        throw new Error("Cannot instantiate an abstract class (BaseAgent) directly.");
      }
    }
  
    async findOptions(params) {
      throw new Error("Must implement findOptions in subclass!");
    }
  }