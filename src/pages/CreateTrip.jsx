
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Trip } from "@/api/entities";
import { TripItem } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { he } from "date-fns/locale";
import { CalendarIcon, Loader2, Search, PlaneTakeoff } from "lucide-react";
import TripRecommendation from "../components/create-trip/TripRecommendation";
import { Card, CardContent } from "@/components/ui/card";
import { InvokeLLM } from "@/api/llm";


const formatWeekday = (day) => format(day, "EEEEEE", { locale: he });
const PREFERENCES = [
  { id: "חופש", label: "חופש", description: "חופים וים" },
  { id: "טבע", label: "טבע", description: "טיולי טבע ונופים" },
  { id: "אוכל", label: "אוכל", description: "חוויות קולינריות" },
  { id: "אטרקציות", label: "אטרקציות", description: "אטרקציות ובילויים" }
];

const POPULAR_DESTINATIONS = [
  "אמסטרדם, הולנד",
  "אתונה, יוון",
  "ברלין, גרמניה",
  "ברצלונה, ספרד",
  "דובאי, איחוד האמירויות",
  "ונציה, איטליה",
  "יוון",
  "ישראל",
  "לונדון, אנגליה",
  "מדריד, ספרד",
  "מילאנו, איטליה",
  "ניו יורק, ארה״ב",
  "פאריז, צרפת",
  "פראג, צ'כיה",
  "רומא, איטליה",
  "תאילנד"
];

const DESTINATIONS_BY_SEASON = {
  summer: [
    { 
      name: "סנטוריני, יוון", 
      price: 4500, 
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "אי געši עם נופים מרהיבים, חופים שחורים וכפרים לבנים על צוקים."
    },
    { 
      name: "ברצלונה, ספרד", 
      price: 3800,
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "שילוב מושלם של אדריכלות ייחודית, חופים נהדרים ואוכל מצוין."
    },
    { 
      name: "רייקאויק, איסלנד", 
      price: 5200,
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "טבע פראי, מעיינות חמים, מפלים מרהיבים ואורות הצפון בקיץ."
    },
    { 
      name: "פוקט, תאילנד", 
      price: 4800,
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "חופים טרופיים, מים צלולים, אוכל תאילנדי אותנטי ואווירה רגועה."
    }
  ],
  winter: [
    { 
      name: "דובאי, איחוד האמירויות", 
      price: 3200,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "עיר חדשנית עם גורדי שחקים, קניות, חופים ומזג אוויר נוח בחורף."
    },
    { 
      name: "בנגקוק, תאילנד", 
      price: 4700,
      image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "עיר תוססת עם מקדשים עתיקים, שווקים צבעוניים ואוכל רחוב מעולה."
    },
    { 
      name: "מלדיביים", 
      price: 8900,
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "גן עדן טרופי עם וילות על המים, ריפי אלמוגים ושקיעות מרהיבות."
    },
    { 
      name: "קנקון, מקסיקו", 
      price: 5600,
      image: "https://images.unsplash.com/photo-1552074284-f7a6a7f13b15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "חופים קריביים, אתרים מאיה עתיקים ומזג אוויר חמים בחורף."
    }
  ],
  spring: [
    { 
      name: "אמסטרדם, הולנד", 
      price: 3100,
      image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "תעלות מרהיבות, שדות צבעונים פורחים ואווירה תוססת עם בוא האביב."
    },
    { 
      name: "טוקיו, יפן", 
      price: 7200,
      image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "מטרופולין יפני מרתק ופריחת הדובדבן המפורסמת באביב."
    },
    { 
      name: "פאריז, צרפת", 
      price: 3400,
      image: "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "עיר האורות במיטבה כשהפארקים פורחים והטרסות מתמלאות שוב."
    },
    { 
      name: "רומא, איטליה", 
      price: 3600,
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "היסטוריה, אמנות, אוכל איטלקי מעולה ומזג אוויר נעים באביב."
    }
  ],
  fall: [
    { 
      name: "ניו יורק, ארה״ב", 
      price: 4900,
      image: "https://images.unsplash.com/photo-1522083165195-3424ed129620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "סתיו מרהיב בסנטרל פארק, תרבות, קניות והופעות."
    },
    { 
      name: "פראג, צ'כיה", 
      price: 2800,
      image: "https://images.unsplash.com/photo-1541849546-216549ae216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "עיר קסומה עם ארכיטקטורה גותית ומזג אוויר נעים בסתיו."
    },
    { 
      name: "לונדון, אנגליה", 
      price: 3600,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "עיר קוסמופוליטית עם פארקים צבעוניים בסתיו, מוזיאונים ותיאטראות."
    },
    { 
      name: "מדריד, ספרד", 
      price: 3300,
      image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "בירת ספרד במיטבה עם מזג אוויר נוח, טאפאס ואמנות."
    }
  ]
};

const getSeason = (date) => {
  const month = date.getMonth() + 1;
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 12 || month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  return "fall";
};

const getFlightDetails = (destination) => {
  let airlineName = "אל על";
  let airportCode = "TLV";
  let destinationCode = "BCN";
  
  if (destination.includes("יוון")) {
    airlineName = "איזי ג'ט";
    destinationCode = "ATH";
  } else if (destination.includes("לונדון")) {
    airlineName = "בריטיש איירווייס";
    destinationCode = "LHR";
  } else if (destination.includes("פאריז")) {
    airlineName = "איר פראנס";
    destinationCode = "CDG";
  } else if (destination.includes("איטליה") || destination.includes("רומא")) {
    airlineName = "אליטליה";
    destinationCode = "FCO";
  } else if (destination.includes("תאילנד")) {
    airlineName = "אל על";
    destinationCode = "BKK";
  } else if (destination.includes("ארה")) {
    airlineName = "יונייטד איירליינס";
    destinationCode = "JFK";
  } else if (destination.includes("צ'כיה") || destination.includes("פראג")) {
    airlineName = "ויזאייר";
    destinationCode = "PRG";
  } else if (destination.includes("דובאי")) {
    airlineName = "פליי דובאי";
    destinationCode = "DXB";
  }
  
  return {
    title: `טיסת ${airlineName} ל${destination.split(",")[0]}`,
    description: `טיסת הלוך ושוב ${airlineName} מ-${airportCode} ל-${destinationCode}, כולל מזוודה במשקל 23 ק"ג ומושבים רגילים.`
  };
};

const getHotelDetails = (destination) => {
  let hotelName = "Hotel Barcelona";
  let hotelFeatures = "WiFi חופשי, ארוחת בוקר, בריכה";
  
  if (destination.includes("ברצלונה")) {
    hotelName = "Hotel Barcelona Center";
    hotelFeatures = "WiFi חופשי, ארוחת בוקר, מרפסת גג עם נוף לעיר";
  } else if (destination.includes("יוון") || destination.includes("סנטוריני")) {
    hotelName = "Blue Dome Hotel";
    hotelFeatures = "נוף לים, WiFi חופשי, בריכת אינפיניטי";
  } else if (destination.includes("לונדון")) {
    hotelName = "The London Bridge Hotel";
    hotelFeatures = "מיקום מרכזי, WiFi חופשי, טרקלין עסקים";
  } else if (destination.includes("פאריז")) {
    hotelName = "Petit Paris Hotel";
    hotelFeatures = "מיקום קרוב לשאנז אליזה, WiFi חופשי";
  } else if (destination.includes("איטליה") || destination.includes("רומא")) {
    hotelName = "Roma Classic Hotel";
    hotelFeatures = "מיקום ליד הקולוסיאום, WiFi חופשי, מסעדה איטלקית";
  } else if (destination.includes("תאילנד")) {
    hotelName = "Thai Paradise Resort";
    hotelFeatures = "חוף פרטי, בריכות, ספא";
  } else if (destination.includes("ארה")) {
    hotelName = "Manhattan Suites";
    hotelFeatures = "נוף לסנטרל פארק, WiFi חופשי, חדר כושר";
  } else if (destination.includes("צ'כיה") || destination.includes("פראג")) {
    hotelName = "Prague Old Town Residence";
    hotelFeatures = "מיקום בעיר העתיקה, WiFi חופשי";
  } else if (destination.includes("דובאי")) {
    hotelName = "Dubai Luxury Towers";
    hotelFeatures = "נוף למפרץ, בריכת אינפיניטי, ספא";
  }
  
  return {
    title: `${hotelName}`,
    description: `מלון 4 כוכבים במיקום מרכזי ב${destination.split(",")[0]}, כולל ${hotelFeatures}`
  };
};

const getActivities = (destination) => {
  if (destination.includes("ברצלונה")) {
    return [
      {
        title: "סיור בפארק גואל",
        description: "סיור מודרך בפארק המפורסם של גאודי, כולל כניסה וסיור עם מדריך מקומי דובר עברית"
      },
      {
        title: "כרטיס לסגרדה פמיליה",
        description: "כרטיס כניסה לקתדרלה המפורסמת של גאודי כולל אודיו-גייד בעברית"
      },
      {
        title: "שייט בנמל ברצלונה",
        description: "שייט מרהיב בנמל ברצלונה, כולל משקה קל ונשנושים"
      }
    ];
  } else if (destination.includes("יוון") || destination.includes("סנטוריני")) {
    return [
      {
        title: "סיור באיה",
        description: "סיור מודרך בעיירה היפהפייה איה, כולל צפייה בשקיעה המפורסמת"
      },
      {
        title: "שייט סביב הקלדרה",
        description: "שייט סביב הקלדרה הגעשית, כולל עצירות לשחייה במעיינות חמים"
      },
      {
        title: "סיור יינות מקומיים",
        description: "סיור ביקבים מקומיים, כולל טעימות יין וגבינות יווניות"
      }
    ];
  } else if (destination.includes("לונדון")) {
    return [
      {
        title: "London Eye",
        description: "כרטיס למגלגל ענק המפורסם, כולל כניסה מועדפת ללא תורים"
      },
      {
        title: "סיור במוזיאון הבריטי",
        description: "סיור מודרך במוזיאון הבריטי המפורסם, כולל מדריך פרטי"
      },
      {
        title: "הופעה בווסט אנד",
        description: "כרטיסים להצגה מובילה באזור התיאטראות המפורסם של לונדון"
      }
    ];
  } else if (destination.includes("פאריז")) {
    return [
      {
        title: "כרטיס למגדל אייפל",
        description: "כרטיס עלייה למגדל אייפל המפורסם, כולל כניסה מועדפת ללא תורים"
      },
      {
        title: "סיור במוזיאון הלובר",
        description: "סיור מודרך במוזיאון הלובר, כולל דילוג על התורים וצפייה במונה ליזה"
      },
      {
        title: "שייט על נהר הסיין",
        description: "שייט קסום על נהר הסיין בשעות הערב, כולל ארוחת ערב"
      }
    ];
  } else {
    return [
      {
        title: `סיור מודרך ב${destination.split(",")[0]}`,
        description: `סיור מקיף להכרת האתרים המרכזיים ב${destination.split(",")[0]}`
      },
      {
        title: `אטרקציה מרכזית ב${destination.split(",")[0]}`,
        description: `כניסה לאטרקציה המרכזית והמפורסת ביותר ב${destination.split(",")[0]}`
      },
      {
        title: `חוויה מקומית ב${destination.split(",")[0]}`,
        description: `חוויה ייחודית לשילוב בתרבות המקומית של ${destination.split(",")[0]}`
      }
    ];
  }
};

export default function CreateTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState({
    destination: searchParams.get("destination") || "",
    start_date: "",
    end_date: "",
    adults: 2,
    children: 0,
    budget: searchParams.get("budget") ? parseInt(searchParams.get("budget")) : 10000,
    preferences: [],
  });
  const [recommendation, setRecommendation] = useState(null);
  const [showDestinations, setShowDestinations] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState(POPULAR_DESTINATIONS);
  const [suggestedDestinations, setSuggestedDestinations] = useState([]);
  const [showDateSuggestions, setShowDateSuggestions] = useState(false);

  useEffect(() => {
    if (searchParams.get("package") === "true") {
      const now = new Date();
      const startDate = addDays(now, 30);
      const endDate = addDays(startDate, 7);
      
      setTripData(prev => ({
        ...prev,
        start_date: startDate,
        end_date: endDate,
        preferences: ["חופש", "אטרקציות"]
      }));
      
      setTimeout(() => {
        generateRecommendationForPackage();
      }, 500);
    }
  }, [searchParams]);

  const handleDateSelect = (date, type) => {
    setTripData(prev => ({
      ...prev,
      [type]: date
    }));

    if (type === "end_date" && !tripData.destination) {
      const season = getSeason(date);
      setSuggestedDestinations(DESTINATIONS_BY_SEASON[season]);
      setShowDateSuggestions(true);
    }
  };

  const handlePreferenceChange = (preference) => {
    setTripData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setTripData(prev => ({ ...prev, destination: value }));
    
    if (value.length > 0) {
      setFilteredDestinations(
        POPULAR_DESTINATIONS.filter(dest => 
          dest.toLowerCase().includes(value.toLowerCase())
        )
      );
      setShowDestinations(true);
    } else {
      setFilteredDestinations(POPULAR_DESTINATIONS);
      setShowDestinations(false);
    }
  };

  const selectDestination = (destination) => {
    setTripData(prev => ({ ...prev, destination }));
    setShowDestinations(false);
    setShowDateSuggestions(false);
  };

  const handleOutsideClick = () => {
    setShowDestinations(false);
  };

  const selectSuggestedDestination = (destination) => {
    setTripData(prev => ({ 
      ...prev, 
      destination: destination.name,
      budget: destination.price
    }));
    
    generateRecommendationForDestination(destination);
  };

  const generateRecommendationForDestination = async (destination) => {
    setLoading(true);
    try {
      const flightDetails = getFlightDetails(destination.name);
      const hotelDetails = getHotelDetails(destination.name);
      const activities = getActivities(destination.name);
      
      const result = {
        flight: {
          title: flightDetails.title,
          description: flightDetails.description,
          price: Math.round(destination.price * 0.35),
          url: `https://www.google.com/search?q=טיסות+ל${encodeURIComponent(destination.name)}`
        },
        hotel: {
          title: hotelDetails.title,
          description: hotelDetails.description,
          price: Math.round(destination.price * 0.4),
          url: `https://www.google.com/search?q=מלונות+ב${encodeURIComponent(destination.name)}`
        },
        activities: activities.map((activity, index) => ({
          title: activity.title,
          description: activity.description,
          price: Math.round(destination.price * (0.1 - index * 0.02)),
          url: `https://www.google.com/search?q=${encodeURIComponent(activity.title)}+${encodeURIComponent(destination.name)}`
        })),
        total_price: destination.price,
        tips: [
          `הזמינו מטבע מקומי מראש לפני הנסיעה ל${destination.name}`,
          `בדקו את תחזית מזג האוויר לפני האריזה`,
          `הורידו אפליקציות מקומיות של תחבורה ציבורית או הזמנת מוניות`
        ]
      };

      setRecommendation(result);
      setCurrentStep(2);
    } catch (error) {
      console.error("שגיאה בקבלת המלצות:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendationForPackage = async () => {
    setLoading(true);
    try {
      const destination = tripData.destination;
      const flightDetails = getFlightDetails(destination);
      const hotelDetails = getHotelDetails(destination);
      const activities = getActivities(destination);
      
      const result = {
        flight: {
          title: flightDetails.title,
          description: flightDetails.description,
          price: Math.round(tripData.budget * 0.35),
          url: `https://www.google.com/search?q=טיסות+ל${encodeURIComponent(destination)}`
        },
        hotel: {
          title: hotelDetails.title,
          description: hotelDetails.description,
          price: Math.round(tripData.budget * 0.4),
          url: `https://www.google.com/search?q=מלונות+ב${encodeURIComponent(destination)}`
        },
        activities: activities.map((activity, index) => ({
          title: activity.title,
          description: activity.description,
          price: Math.round(tripData.budget * (0.1 - index * 0.02)),
          url: `https://www.google.com/search?q=${encodeURIComponent(activity.title)}+${encodeURIComponent(destination)}`
        })),
        total_price: tripData.budget,
        tips: [
          `הזמינו מטבע מקומי מראש לפני הנסיעה ל${destination}`,
          `בדקו את תחזית מזג האוויר לפני האריזה`,
          `הורידו אפליקציות מקומיות של תחבורה ציבורית או הזמנת מוניות`
        ]
      };

      setRecommendation(result);
      setCurrentStep(2);
    } catch (error) {
      console.error("שגיאה בקבלת המלצות:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendation = async () => {
    setLoading(true);
    try {
      const prompt = `בתור סוכן נסיעות מקצועי, אנא תכנן חופשה ל${tripData.destination} עבור ${tripData.adults} מבוגרים ${
        tripData.children > 0 ? `ו-${tripData.children} ילדים` : ""
      } בתאריכים ${format(new Date(tripData.start_date), "dd/MM/yyyy")} עד ${format(new Date(tripData.end_date), "dd/MM/yyyy")}.
      תקציב החופשה הוא ${tripData.budget} ש"ח והלקוח מעוניין ב: ${tripData.preferences.join(", ")}.
      אנא הצע חבילת נופש מפורטת הכוללת טיסות, מלון, אטרקציות ופעילויות מומלצות.`;

      const result = await InvokeLLM({
        destination: tripData.destination,
        startDate: format(tripData.start_date, "yyyy-MM-dd"),
        endDate: format(tripData.end_date, "yyyy-MM-dd"),
        numPeople: tripData.adults + tripData.children,
        budget: tripData.budget,
        style: tripData.preferences.includes("יוקרתי") ? "fancy" : "cheap"
      });
      setRecommendation(result);
      setCurrentStep(2);
    } catch (error) {
      console.error("שגיאה בקבלת המלצות:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = async () => {
    setLoading(true);
    try {
      const trip = await Trip.create({
        ...tripData,
        status: "מתוכנן",
        travelers: tripData.adults + tripData.children
      });

      const items = [
        {
          trip_id: trip.id,
          type: "טיסה",
          title: recommendation.flight.title,
          description: recommendation.flight.description,
          price: recommendation.flight.price,
          booking_url: recommendation.flight.url,
          start_date: tripData.start_date,
          end_date: tripData.end_date,
          status: "מומלץ"
        },
        {
          trip_id: trip.id,
          type: "מלון",
          title: recommendation.hotel.title,
          description: recommendation.hotel.description,
          price: recommendation.hotel.price,
          booking_url: recommendation.hotel.url,
          start_date: tripData.start_date,
          end_date: tripData.end_date,
          status: "מומלץ"
        },
        ...recommendation.activities.map(activity => ({
          trip_id: trip.id,
          type: "אטרקציה",
          title: activity.title,
          description: activity.description,
          price: activity.price,
          booking_url: activity.url,
          start_date: tripData.start_date,
          end_date: tripData.end_date,
          status: "מומלץ"
        }))
      ];

      await Promise.all(items.map(item => TripItem.create(item)));
      
      navigate(createPageUrl(`TripDetails?id=${trip.id}`));
    } catch (error) {
      console.error("שגיאה בשמירת הטיול:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderDateButton = (date, placeholder) => {
    return (
      <Button
        variant="outline"
        className="w-full justify-start text-right font-normal"
      >
        <CalendarIcon className="ml-2 h-4 w-4" />
        {date ? (
          <span className="text-sm">{format(date, "dd/MM/yy", { locale: he })}</span>
        ) : (
          <span>{placeholder}</span>
        )}
      </Button>
    );
  };

  const renderDateBasedDestinations = () => {
    if (!showDateSuggestions) return null;

    return (
      <div className="mt-8 mb-4">
        <h2 className="text-xl font-bold mb-4 text-center">יעדים מומלצים לתאריכים שבחרת</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestedDestinations.map((destination, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => selectSuggestedDestination(destination)}
            >
              <div className="h-40 overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">
                    {destination.name}
                  </h3>
                  <div className="font-bold text-cyan-700">
                    {new Intl.NumberFormat('he-IL').format(destination.price)} ₪
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {destination.description.length > 75 
                    ? `${destination.description.substring(0, 75)}...` 
                    : destination.description}
                </p>
                <Button 
                  className="w-full bg-gradient text-white hover:opacity-90 mt-2"
                >
                  <PlaneTakeoff className="ml-2 h-4 w-4" />
                  סגירת חבילה
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const showCustomForm = !showDateSuggestions && currentStep === 1;

  return (
    <div className="max-w-6xl py-8" onClick={handleOutsideClick}>
      {currentStep === 1 ? (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center mb-8 brand-text">תכנון טיול חדש</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>יעד הטיול</Label>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                  <Input
                    placeholder="לאן תרצו לטוס?"
                    value={tripData.destination}
                    onChange={handleDestinationChange}
                    onFocus={() => setShowDestinations(true)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                
                {showDestinations && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border">
                    <div className="py-1 max-h-60 overflow-auto">
                      {filteredDestinations.length > 0 ? (
                        filteredDestinations.map((dest) => (
                          <div
                            key={dest}
                            className="px-4 py-2 hover:bg-cyan-50 cursor-pointer text-right"
                            onClick={() => selectDestination(dest)}
                          >
                            {dest}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 text-right">לא נמצאו יעדים</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label>תאריכים</Label>
              <div className="grid grid-cols-2 gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    {renderDateButton(tripData.start_date, "יציאה")}
                  </PopoverTrigger>
                  <PopoverContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-popover text-popover-foreground m-0 p-0 z-50 rounded-md border shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-auto" side="top" align="start">
                    <Calendar
                      mode="single"
                      selected={tripData.start_date}
                      onSelect={(date) => handleDateSelect(date, "start_date")}
                      locale={he}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      showOutsideDays={false}
                      formatters={{ formatWeekday }}
                      className="max-w-[320px] scale-[0.9] sm:scale-100"
                      classNames={{
                        caption: "text-xs flex justify-center items-center h-5 p-0 mb-0 leading-none",
                        head_cell: "h-5 w-8 p-0 flex items-center justify-center rounded-md mt-0 leading-none",
                        cell: "text-xs h-8 w-8 p-0 relative focus-within:relative focus-within:z-20",
                        day: "h-8 w-8 p-0 flex items-center justify-center rounded-md aria-selected:bg-cyan-600 aria-selected:text-white hover:bg-gray-100 cursor-pointer",
                        nav_button: "h-7 w-7",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        caption_label: "text-sm font-medium",
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0"
                      }}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    {renderDateButton(tripData.end_date, "חזרה")}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" side="top" align="start">
                    <Calendar
                      mode="single"
                      selected={tripData.end_date}
                      onSelect={(date) => handleDateSelect(date, "end_date")}
                      locale={he}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        // אם יש תאריך התחלה, לא מאפשר תאריכים לפניו
                        if (tripData.start_date) {
                          return date < tripData.start_date;
                        }
                        
                        // אחרת, לא מאפשר תאריכים לפני היום
                        return date < today;
                      }}
                      initialFocus
                      showOutsideDays={false}
                      formatters={{ formatWeekday }}
                      className="max-w-[320px] scale-[0.9] sm:scale-100"
                      classNames={{
                        caption: "text-xs flex justify-center items-center h-5 p-0 mb-0 leading-none",
                        head_cell: "h-5 w-8 p-0 flex items-center justify-center rounded-md mt-0 leading-none",
                        cell: "text-xs h-8 w-8 p-0 relative focus-within:relative focus-within:z-20",
                        day: "h-8 w-8 p-0 flex items-center justify-center rounded-md aria-selected:bg-cyan-600 aria-selected:text-white hover:bg-gray-100 cursor-pointer",
                        nav_button: "h-7 w-7",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        caption_label: "text-sm font-medium",
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0"
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>          
          {renderDateBasedDestinations()}
          {showCustomForm && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>מספר נוסעים</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">מבוגרים</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTripData(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }));
                        }}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{tripData.adults}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTripData(prev => ({ ...prev, adults: prev.adults + 1 }));
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>&nbsp;</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ילדים</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTripData(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }));
                        }}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{tripData.children}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTripData(prev => ({ ...prev, children: prev.children + 1 }));
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>תקציב מקסימלי (בש״ח)</Label>
                <div className="space-y-3">
                <Slider
                    value={[50000 - tripData.budget]} // 💡 הפוך את הערך
                    onValueChange={([value]) =>
                      setTripData(prev => ({ ...prev, budget: 50000 - value })) // 💡 הפוך חזרה כשמשנים
                    }
                    max={50000 - 1000} // = 49000
                    min={0}
                    step={1000}
                  />
                  <div className="text-center font-medium">
                    {new Intl.NumberFormat('he-IL').format(tripData.budget)} ₪
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>העדפות לטיול</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PREFERENCES.map((preference) => (
                    <div
                      key={preference.id}
                      className={cn(
                        "flex items-center space-x-2 space-x-reverse rounded-lg border p-4 cursor-pointer transition-colors",
                        tripData.preferences.includes(preference.id)
                          ? "border-cyan-500 bg-cyan-50"
                          : "hover:bg-gray-50"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreferenceChange(preference.id);
                      }}
                    >
                      <Checkbox
                        checked={tripData.preferences.includes(preference.id)}
                        onCheckedChange={() => handlePreferenceChange(preference.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{preference.label}</div>
                        <div className="text-sm text-gray-500">{preference.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-gradient text-white hover:opacity-90"
                size="lg"
                onClick={generateRecommendation}
                disabled={loading || !tripData.destination || !tripData.start_date || !tripData.end_date}
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    מכין המלצות...
                  </>
                ) : (
                  "קבלת המלצות לטיול"
                )}
              </Button>
            </>
          )}
        </div>
      ) : (
        <TripRecommendation
          recommendation={recommendation}
          tripData={tripData}
          onSave={saveTrip}
          onBack={() => setCurrentStep(1)}
          loading={loading}
        />
      )}
    </div>
  );
}
