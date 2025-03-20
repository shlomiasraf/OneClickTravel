
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarRange, Users, MapPin } from "lucide-react";

const statusColors = {
  "מתוכנן": "bg-blue-100 text-blue-800",
  "הוזמן": "bg-green-100 text-green-800",
  "בתהליך": "bg-yellow-100 text-yellow-800",
  "הושלם": "bg-gray-100 text-gray-800"
};

const destinationImages = {
  "ברצלונה, ספרד": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "סנטוריני, יוון": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "יוון": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "תאילנד": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "פוקט, תאילנד": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "לונדון, אנגליה": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "אנגליה": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "דובאי, איחוד האמירויות": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "בנגקוק, תאילנד": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "מלדיביים": "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "קנקון, מקסיקו": "https://images.unsplash.com/photo-1552074284-f7a6a7f13b15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "אמסטרדם, הולנד": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "הולנד": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "טוקיו, יפן": "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "יפן": "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "פאריז, צרפת": "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "צרפת": "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "רומא, איטליה": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "איטליה": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "ניו יורק, ארה״ב": "https://images.unsplash.com/photo-1522083165195-3424ed129620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "ארה״ב": "https://images.unsplash.com/photo-1522083165195-3424ed129620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "פראג, צ'כיה": "https://images.unsplash.com/photo-1541849546-216549ae216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "צ'כיה": "https://images.unsplash.com/photo-1541849546-216549ae216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "מדריד, ספרד": "https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "ספרד": "https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
};

export default function TripCard({ trip, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="p-0">
          <Skeleton className="w-full h-48 rounded-t-lg" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getImageForDestination = (destination) => {
    if (destinationImages[destination]) {
      return destinationImages[destination];
    }
    
    for (const [key, imageUrl] of Object.entries(destinationImages)) {
      if (destination.includes(key) || key.includes(destination)) {
        return imageUrl;
      }
    }
    
    return `https://source.unsplash.com/featured/400x300/?travel,${encodeURIComponent(trip.destination)}`;
  };

  const destinationImage = getImageForDestination(trip.destination);

  return (
    <Link to={createPageUrl(`TripDetails?id=${trip.id}`)}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="relative h-48">
            <img 
              src={destinationImage}
              alt={trip.destination}
              className="w-full h-full object-cover"
            />
            <Badge 
              className={`absolute top-3 right-3 ${statusColors[trip.status]}`}
            >
              {trip.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-2">{trip.destination}</h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4" />
              <span>
                {format(new Date(trip.start_date), "dd/MM/yy", { locale: he })} - {format(new Date(trip.end_date), "dd/MM/yy", { locale: he })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {trip.adults} מבוגרים{trip.children > 0 ? ` + ${trip.children} ילדים` : ""}
              </span>
            </div>

            {trip.preferences && trip.preferences.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {trip.preferences.map((pref, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="bg-gray-50"
                  >
                    {pref}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
