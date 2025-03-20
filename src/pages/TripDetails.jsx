import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Trip } from "@/api/entities";
import { TripItem } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { 
  ArrowLeft, 
  Calendar, 
  Plane, 
  Building2, 
  CreditCard, 
  Users, 
  Map, 
  Ticket, 
  ShieldCheck,
  ExternalLink,
  Share2,
  MapPin,
  AlertCircle
} from "lucide-react";

// רכיב פריט טיול
const TripItemCard = ({ item, onStatusChange }) => {
  const getTypeIcon = () => {
    switch (item.type) {
      case "טיסה": return <Plane className="h-5 w-5 text-cyan-600" />;
      case "מלון": return <Building2 className="h-5 w-5 text-teal-600" />;
      case "רכב": return <Map className="h-5 w-5 text-blue-600" />;
      case "אטרקציה": return <Ticket className="h-5 w-5 text-orange-600" />;
      case "ביטוח": return <ShieldCheck className="h-5 w-5 text-green-600" />;
      default: return <MapPin className="h-5 w-5 text-purple-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "מומלץ": return "bg-blue-100 text-blue-800";
      case "נבחר": return "bg-yellow-100 text-yellow-800";
      case "הוזמן": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1">{getTypeIcon()}</div>
            <div>
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              {(item.start_date || item.end_date) && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(item.start_date), "dd בMMMM", { locale: he })}
                  {item.end_date && item.end_date !== item.start_date && 
                    ` - ${format(new Date(item.end_date), "dd בMMMM", { locale: he })}`}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end mt-4 md:mt-0">
            <Badge className={getStatusColor(item.status)}>
              {item.status}
            </Badge>
            {item.price && (
              <div className="text-lg font-bold mt-2 text-gray-800">
                {new Intl.NumberFormat('he-IL').format(item.price)} {item.currency || "₪"}
              </div>
            )}
            {item.booking_url && (
              <a
                href={item.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 hover:underline text-sm mt-2 flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                להזמנה
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function TripDetails() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [tripItems, setTripItems] = useState({
    flights: [],
    accommodations: [],
    activities: [],
    other: []
  });
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tripId = urlParams.get("id");
        
        if (!tripId) {
          navigate(createPageUrl("Trips"));
          return;
        }

        const tripData = await Trip.filter({ id: tripId });
        
        if (tripData.length === 0) {
          navigate(createPageUrl("Trips"));
          return;
        }

        setTrip(tripData[0]);
        
        const items = await TripItem.filter({ trip_id: tripId });
        
        // חלוקת הפריטים לפי קטגוריות
        const categorizedItems = {
          flights: items.filter(item => item.type === "טיסה"),
          accommodations: items.filter(item => item.type === "מלון"),
          activities: items.filter(item => item.type === "אטרקציה"),
          other: items.filter(item => !["טיסה", "מלון", "אטרקציה"].includes(item.type))
        };
        
        setTripItems(categorizedItems);
        
        // חישוב סכום כולל
        const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
        setTotalPrice(total);
      } catch (error) {
        console.error("שגיאה בטעינת פרטי הטיול:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl py-8">
        <div className="animate-pulse">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-8 w-1/5 mb-4" />
          <div className="space-y-4 mb-8">
            {[1, 2].map(i => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate(createPageUrl("Trips"))}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold brand-text">{trip.destination}</h1>
              <p className="text-gray-500 mt-1">
                {format(new Date(trip.start_date), "dd בMMMM", { locale: he })} - {format(new Date(trip.end_date), "dd בMMMM", { locale: he })}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button variant="outline" className="flex gap-2">
            <Share2 className="h-4 w-4" />
            שיתוף
          </Button>
          <Button className="bg-gradient text-white hover:opacity-90">
            עריכת טיול
          </Button>
        </div>
      </div>

      {/* כרטיסי מידע */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="bg-cyan-100 p-3 rounded-full">
                <Calendar className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">תאריכים</p>
                <p className="font-semibold">
                  {format(new Date(trip.start_date), "dd בMMMM", { locale: he })} - {format(new Date(trip.end_date), "dd בMMMM", { locale: he })}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24))} ימים
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="bg-teal-100 p-3 rounded-full">
                <Users className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">נוסעים</p>
                <p className="font-semibold">
                  {trip.adults} מבוגרים{trip.children > 0 ? ` + ${trip.children} ילדים` : ""}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  סה"כ {trip.travelers} נוסעים
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <CreditCard className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">תקציב</p>
                <p className="font-semibold">
                  {new Intl.NumberFormat('he-IL').format(trip.budget)} ₪
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {totalPrice > 0 
                    ? `${new Intl.NumberFormat('he-IL').format(totalPrice)} ₪ מתוכננים`
                    : 'אין הוצאות מתוכננות'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* טאבים לפריטי הטיול */}
      <Tabs defaultValue="all">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">הכל</TabsTrigger>
            <TabsTrigger value="flights">טיסות</TabsTrigger>
            <TabsTrigger value="accommodations">לינה</TabsTrigger>
            <TabsTrigger value="activities">אטרקציות</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0 space-y-4">
          {Object.values(tripItems).flat().length > 0 ? (
            Object.values(tripItems).flat().map((item) => (
              <TripItemCard key={item.id} item={item} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">אין פריטים בטיול</h3>
                <p className="text-gray-500">
                  עדיין לא נוספו פריטים לטיול זה. תוכלו להוסיף טיסות, לינה ואטרקציות.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="flights" className="mt-0 space-y-4">
          {tripItems.flights.length > 0 ? (
            tripItems.flights.map((item) => (
              <TripItemCard key={item.id} item={item} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">אין טיסות</h3>
                <p className="text-gray-500">
                  עדיין לא נוספו טיסות לטיול זה.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="accommodations" className="mt-0 space-y-4">
          {tripItems.accommodations.length > 0 ? (
            tripItems.accommodations.map((item) => (
              <TripItemCard key={item.id} item={item} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">אין מקומות לינה</h3>
                <p className="text-gray-500">
                  עדיין לא נוספו מקומות לינה לטיול זה.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activities" className="mt-0 space-y-4">
          {tripItems.activities.length > 0 ? (
            tripItems.activities.map((item) => (
              <TripItemCard key={item.id} item={item} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">אין אטרקציות</h3>
                <p className="text-gray-500">
                  עדיין לא נוספו אטרקציות לטיול זה.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}