import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Trip } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format, isAfter, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import TripCard from "../components/trips/TripCard";
import EmptyState from "../components/trips/EmptyState";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const tripsData = await Trip.list("-created_date");
        setTrips(tripsData);
      } catch (error) {
        console.error("שגיאה בטעינת הטיולים:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // פילטור הטיולים לפי חיפוש ולשוניות
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "upcoming") {
      return matchesSearch && isAfter(parseISO(trip.start_date), new Date());
    }
    if (activeTab === "active") {
      return matchesSearch && (trip.status === "מתוכנן" || trip.status === "בתהליך");
    }

    return matchesSearch;
  });

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">הטיולים שלי</h1>
        </div>
        <Link to={createPageUrl("CreateTrip")}>
          <Button className="mt-4 md:mt-0 bg-gradient text-white hover:opacity-90">
            <PlusCircle className="ml-2 h-5 w-5" />
            טיול חדש
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="חיפוש לפי יעד..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">כל הטיולים</TabsTrigger>
          <TabsTrigger value="upcoming">טיולים עתידיים</TabsTrigger>
          <TabsTrigger value="active">בתכנון</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <TripCard key={i} loading={true} />
              ))}
            </div>
          ) : filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="לא נמצאו טיולים"
              description={searchQuery ? "נסו לחפש משהו אחר" : "התחילו על ידי יצירת טיול חדש"}
            />
          )}
        </TabsContent>

        {["upcoming", "active"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <TripCard key={i} loading={true} />
                ))}
              </div>
            ) : filteredTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title={`לא נמצאו טיולים ${tab === "upcoming" ? "עתידיים" : "בתכנון"}`}
                description={searchQuery ? "נסו לחפש משהו אחר" : "התחילו על ידי יצירת טיול חדש"}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}