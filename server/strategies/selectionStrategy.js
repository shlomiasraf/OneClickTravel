// server/strategies/selectionStrategy.js

export class SelectionStrategy {
    chooseOption(options) {
      throw new Error("Must implement chooseOption in subclass!");
    }
  }
  
  export class CheapestStrategy extends SelectionStrategy {
    chooseOption(options) {
      if (!options || options.length === 0) return null;
      const sorted = [...options].sort((a, b) => a.price - b.price);
      return sorted[0];
    }
  }
  
  export class FancyStrategy extends SelectionStrategy {
    chooseOption(options) {
      if (!options || options.length === 0) return null;
      // למשל למיין לפי rating (או "price desc" - יקר זה מפנק?)
      const sorted = [...options].sort((a, b) => b.rating - a.rating);
      return sorted[0];
    }
  }