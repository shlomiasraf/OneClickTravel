import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActiveTripsCard({ trips, loading }) {
  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold text-gray-900">הטיולים הפעילים שלי</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-900">הטיולים הפעילים שלי</CardTitle>
      </CardHeader>
      <CardContent>
        {trips.length > 0 ? (
          <div className="space-y-4">
            {trips.map((trip) => (
              <Link 
                key={trip.id} 
                to={createPageUrl(`TripDetails?id=${trip.id}`)}
                className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-md transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <CalendarRange className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{trip.destination}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(trip.start_date), "dd בMMMM", { locale: he })} - {format(new Date(trip.end_date), "dd בMMMM", { locale: he })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {trip.travelers} נוסעים • {trip.status}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-3">אין לך טיולים פעילים כרגע</p>
            <Link to={createPageUrl("CreateTrip")}>
              <p className="text-blue-600 hover:underline">תכנון טיול חדש</p>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}