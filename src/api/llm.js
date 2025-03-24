// src/utils/llm.js

const MOCK_DESTINATIONS = {
    "ברצלונה": {
      flight: {
        title: "טיסת אל על לברצלונה",
        description: "טיסת הלוך ושוב מ-TLV ל-BCN עם מזוודה",
        price: 1350,
        url: "https://www.google.com/search?q=טיסות+לברצלונה"
      },
      hotel: {
        title: "Hotel Barcelona Center",
        description: "מלון 4 כוכבים ליד הרמבלה עם WiFi וארוחת בוקר",
        price: 1600,
        url: "https://www.google.com/search?q=מלונות+בברצלונה"
      },
      activities: [
        {
          title: "סיור בפארק גואל",
          description: "סיור עם מדריך מקומי בעברית",
          price: 400,
          url: "https://www.google.com/search?q=סיור+בפארק+גואל"
        },
        {
          title: "שייט בנמל ברצלונה",
          description: "חוויה ימית מהנה",
          price: 300,
          url: "https://www.google.com/search?q=שייט+ברצלונה"
        },
        {
          title: "סגרדה פמיליה",
          description: "כניסה לקתדרלה המפורסמת",
          price: 300,
          url: "https://www.google.com/search?q=סגרדה+פמיליה"
        }
      ],
      total_price: 3950
    },
    "אמסטרדם": {
      flight: {
        title: "טיסת KLM לאמסטרדם",
        description: "טיסה ישירה מ-TLV ל-AMS עם תיק יד",
        price: 1200,
        url: "https://www.google.com/search?q=טיסות+לאמסטרדם"
      },
      hotel: {
        title: "Canal View Hotel",
        description: "מלון 3 כוכבים ליד התעלות עם ארוחת בוקר",
        price: 1500,
        url: "https://www.google.com/search?q=מלונות+באמסטרדם"
      },
      activities: [
        {
          title: "שייט בתעלות",
          description: "סיור רומנטי בתעלות אמסטרדם",
          price: 300,
          url: "https://www.google.com/search?q=שייט+בתעלות+אמסטרדם"
        },
        {
          title: "סיור אופניים",
          description: "חווית רכיבה במרכז העיר",
          price: 200,
          url: "https://www.google.com/search?q=סיור+אופניים+אמסטרדם"
        },
        {
          title: "מוזיאון ואן גוך",
          description: "כניסה למוזיאון האיקוני",
          price: 350,
          url: "https://www.google.com/search?q=ואן+גוך+אמסטרדם"
        }
      ],
      total_price: 3750
    }
  };
  
  export const InvokeLLM = async ({ prompt, response_json_schema }) => {
    console.log("🤖 InvokeLLM called with prompt:", prompt);
  
    const destination = Object.keys(MOCK_DESTINATIONS).find(dest =>
      prompt.includes(dest)
    );
  
    const result = destination
      ? MOCK_DESTINATIONS[destination]
      : MOCK_DESTINATIONS["ברצלונה"]; // ברירת מחדל
  
    return {
      ...result,
      tips: [
        "בדוק את מזג האוויר לפני הטיסה",
        "הזמן כרטיסים לאטרקציות מראש",
        "הורד מפות לא מקוונות למקרה שלא יהיה אינטרנט"
      ]
    };
  };
  