const LOCAL_NETWORK_IP = "http://172.20.10.2:3001";

const getBackendUrl = () => {
  if (window.Capacitor?.isNativePlatform) {
    return LOCAL_NETWORK_IP;
  }
  return "http://localhost:3001";
};

export const InvokeLLM = async ({ destination, startDate, endDate, numPeople, budget, style }) => {
  console.log("🚀 Sending request to /api/vacation with:", {
    destination,
    startDate,
    endDate,
    numPeople,
    budget,
    style
  });

  try {
    const response = await fetch(`${getBackendUrl()}/api/vacation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, startDate, endDate, numPeople, budget, style }),
    });

    console.log("📥 Response status:", response.status);

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("❌ Failed to parse JSON from backend:", jsonError);
      return { error: "שגיאה בפענוח התשובה מהשרת", details: jsonError.message };
    }

    console.log("📦 Response body:", data);

    if (!response.ok || !data.package) {
      return {
        error: "שגיאה בתשובה מהשרת",
        details: data?.error || "אין חבילת נופש תקינה"
      };
    }

    return {
      ...data.package,
      tips: [
        "בדוק את מזג האוויר לפני הטיסה",
        "הזמן כרטיסים מראש לאטרקציות",
        "השווה מחירים בין סוכנויות"
      ]
    };

  } catch (err) {
    console.error("🔥 LLM error calling backend:", err);
    return { error: "שגיאה בשליחת הבקשה לשרת", details: err.message };
  }
};
