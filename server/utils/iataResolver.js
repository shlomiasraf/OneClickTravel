export function resolveCityToIATA(cityName) {
    const cityMap = {
      "אמסטרדם, הולנד": "AMS",
      "לונדון, אנגליה": "LHR",
      "פריז, צרפת": "CDG",
      "ניו יורק, ארה\"ב": "JFK",
      "ברלין, גרמניה": "BER",
      "רומא, איטליה": "FCO",
      "בנגקוק, תאילנד": "BKK",
      "ברצלונה, ספרד": "BCN",
      "תל אביב, ישראל": "TLV",
    };
  
    return cityMap[cityName] || cityName; // אם לא נמצא – מחזיר את המקורי
  }
  