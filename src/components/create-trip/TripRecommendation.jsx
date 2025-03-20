
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, ExternalLink, Info, Plane, Building2, Ticket, CreditCard } from "lucide-react";
import TripItemRow from "@/components/TripItemRow";

export default function TripRecommendation({ recommendation, tripData, onSave, onBack, loading }) {
  const [openDialog, setOpenDialog] = useState(null);

  const handleOpenDetails = (type) => {
    setOpenDialog(type);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-center brand-text mb-2">{tripData.destination}</h1>
        <p className="text-center text-gray-500">
          {tripData.start_date && `${formatDate(tripData.start_date)} - ${formatDate(tripData.end_date)} | `}
          {tripData.adults} מבוגרים {tripData.children > 0 ? `+ ${tripData.children} ילדים` : ""}
        </p>
      </div>

      <div className="bg-gradient-to-br from-white to-cyan-50 shadow-sm rounded-2xl" dir="rtl">
        <TripItemRow title="פריט" price="מחיר" isHeader={true} />

        <div className="space-y-2">
          <TripItemRow
            icon={Plane}
            title={recommendation.flight.title}
            price={recommendation.flight.price}
            onInfoClick={() => handleOpenDetails("flight")}
          />

          <TripItemRow
            icon={Building2}
            title={recommendation.hotel.title}
            price={recommendation.hotel.price}
            onInfoClick={() => handleOpenDetails("hotel")}
          />

          {recommendation.activities.map((activity, index) => (
            <TripItemRow
              key={index}
              icon={Ticket}
              title={activity.title}
              price={activity.price}
              onInfoClick={() => handleOpenDetails(`activity-${index}`)}
            />
          ))}

          <div className="w-full p-6 mt-8 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-lg shadow-md border border-cyan-400">
            <div className="grid grid-cols-2 gap-32 items-center">
              <div className="font-bold text-2xl text-white">סה"כ לתשלום</div>
              <div className="font-bold text-2xl text-white whitespace-nowrap">
                {new Intl.NumberFormat('he-IL').format(recommendation.total_price)} ₪
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mr-6 ml-8 flex justify-between gap-4 max-w-lg mx-auto">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onBack} 
          className="w-[45%] py-7 text-lg"
        >
          <ArrowLeft className="ml-3 h-6 w-6" />
          חזרה
        </Button>

        <Button
          className="w-[50%] bg-gradient text-white hover:opacity-90 text-lg py-7"
          onClick={onSave}
          disabled={loading}
        >
          <CreditCard className="ml-3 h-6 w-6" />
          שלם
        </Button>
      </div>

      {openDialog && (
        <Dialog open={!!openDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {openDialog === "flight" && (
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-cyan-600" />
                    פרטי טיסה
                  </div>
                )}
                {openDialog === "hotel" && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-teal-600" />
                    פרטי מלון
                  </div>
                )}
                {openDialog.startsWith("activity") && (
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-orange-600" />
                    פרטי אטרקציה
                  </div>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              {openDialog === "flight" && (
                <div>
                  <p className="text-gray-600">{recommendation.flight.description}</p>
                  <a 
                    href={recommendation.flight.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-600 hover:underline mt-4"
                  >
                    <ExternalLink className="h-4 w-4" />
                    צפייה בפרטי הטיסה
                  </a>
                </div>
              )}
              {openDialog === "hotel" && (
                <div>
                  <p className="text-gray-600">{recommendation.hotel.description}</p>
                  <a 
                    href={recommendation.hotel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-600 hover:underline mt-4"
                  >
                    <ExternalLink className="h-4 w-4" />
                    צפייה בפרטי המלון
                  </a>
                </div>
              )}
              {openDialog.startsWith("activity-") && (
                <div>
                  <p className="text-gray-600">
                    {recommendation.activities[parseInt(openDialog.split("-")[1])].description}
                  </p>
                  <a 
                    href={recommendation.activities[parseInt(openDialog.split("-")[1])].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-600 hover:underline mt-4"
                  >
                    <ExternalLink className="h-4 w-4" />
                    צפייה בפרטי האטרקציה
                  </a>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={handleCloseDialog}>סגירה</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
