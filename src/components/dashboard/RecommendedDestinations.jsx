import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ חדש
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { createPageUrl } from "@/utils";

// נתונים קבועים של יעדים מומלצים
const DESTINATIONS = [
  {
    id: 1,
    name: "ברצלונה, ספרד",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "שילוב מושלם של אדריכלות ייחודית, חופים נהדרים ואוכל מצוין.",
    tags: ["עיר", "חוף"],
    season: "אביב-קיץ",
    price: 3950
  },
  {
    id: 2,
    name: "סנטוריני, יוון",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "אי געשי עם נופים מרהיבים, חופים שחורים וכפרים לבנים על צוקים.",
    tags: ["רומנטי", "חוף"],
    season: "קיץ-סתיו",
    price: 4850
  },
  {
    id: 3,
    name: "תאילנד",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "יעד אקזוטי המציע חופים טרופיים, אוכל מעולה, תרבות עשירה ומחירים נוחים.",
    tags: ["טבע", "חוף"],
    season: "סתיו-חורף",
    price: 5250
  },
  {
    id: 4,
    name: "לונדון, אנגליה",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "עיר תוססת עם היסטוריה, תרבות, קניות ובידור.",
    tags: ["עיר", "תרבות"],
    season: "כל השנה",
    price: 3550
  }
];

export default function RecommendedDestinations({ loading }) {
  const navigate = useNavigate(); // ✅

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0">
                <Skeleton className="md:w-1/3 h-48 md:h-40 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2 flex-wrap">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-9 w-24 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleBookPackage = (destination) => {
    const params = new URLSearchParams({
      destination: destination.name,
      package: 'true',
      budget: destination.price
    });

    // ✅ שימוש ב-navigate במקום window.location.href
    navigate(`/CreateTrip?${params.toString()}`);
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-6">
          {DESTINATIONS.map((destination) => (
            <div key={destination.id} className="flex flex-col md:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0">
              <div className="md:w-1/3 h-48 md:h-40 overflow-hidden rounded-lg">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105" 
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold">{destination.name}</h3>
                  <div className="flex items-center text-cyan-700 font-bold text-lg">
                    <CreditCard className="h-4 w-4 ml-1" />
                    {new Intl.NumberFormat('he-IL').format(destination.price)} ₪
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{destination.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {destination.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-cyan-50">
                      {tag}
                    </Badge>
                  ))}
                  <Badge className="bg-amber-100 text-amber-800">
                    {destination.season}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button 
                    className="bg-gradient text-white hover:opacity-90"
                    onClick={() => handleBookPackage(destination)}
                  >
                    סגירת חבילה
                  </Button>
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(destination.name)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="sm" className="text-cyan-600">
                      מידע נוסף
                      <ExternalLink className="h-3 w-3 mr-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
