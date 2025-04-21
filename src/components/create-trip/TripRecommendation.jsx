
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
  const handlePayment = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000); // נעלם אחרי 3 שניות (אם רוצים)
  };

  const [showSuccess, setShowSuccess] = useState(false);

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

          {recommendation.hotel && (
            <TripItemRow
              icon={Building2}
              title={recommendation.hotel.title}
              price={recommendation.hotel.price}
              onInfoClick={() => handleOpenDetails("hotel")}
            />
          )}

          {recommendation.activities && recommendation.activities.map((activity, index) => (
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
                 {new Intl.NumberFormat('he-IL').format(recommendation.totalPrice)} ₪
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
          onClick={handlePayment}
          disabled={loading}
        >
          <CreditCard className="ml-3 h-6 w-6" />
          שלם
        </Button>
        {showSuccess && (
          <div className="mt-4 text-center text-green-600 font-semibold text-lg">
          ✅ התשלום עבר בהצלחה!
      </div>
)}
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

            <div className="mt-4" dir="rtl">
            {openDialog === "flight" && (
              <div className="space-y-4 text-right" dir="rtl">
                {recommendation.flight.segments.map((seg, index) => {
                  const dep = new Date(seg.time.split("→")[0].trim());
                  const arr = new Date(seg.time.split("→")[1].trim());

                  return (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-gray-800">
                        <span className="font-bold">טיסה: </span>
                        מ-{seg.from} ל-{seg.to}
                      </p>
                      <p className="text-gray-800">
                        <span className="font-bold">יציאה: </span>
                        {dep.toLocaleString("he-IL")}
                      </p>
                      <p className="text-gray-800">
                        <span className="font-bold">הגעה: </span>
                        {arr.toLocaleString("he-IL")}
                      </p>
                    </div>
                  );
                })}

                <div className="flex justify-center mt-4">
                  <a 
                    href={recommendation.flight.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    צפייה בפרטי הטיסה
                  </a>
                </div>
              </div> // ✅ סגירת ה-div הפנימית
            )}
          </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
