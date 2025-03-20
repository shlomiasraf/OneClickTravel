import React from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const TripItemRow = ({ icon: Icon, title, price, onInfoClick, isHeader }) => {
  if (isHeader) {
    return (
      <div className="text-cyan-800 mb-5 pb-2 pl-12 text-xl font-bold grid grid-cols-2 gap-44 items-center w-full border-b-2 border-cyan-200">
        <div className="text-right mx-4">פריט</div>
        <div className="text-left mr-6 ml-3">מחיר</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r grid grid-cols-2 gap-36 items-center w-full border border-cyan-100 rounded-lg from-white to-cyan-50 hover:shadow-lg hover:border-cyan-300 transition-all duration-200">
      {/* עמודת שם הפריט - בצד ימין */}
      <div className="flex items-center gap-5">
        {Icon && <div className="p-2 rounded-full bg-cyan-100 text-cyan-700"><Icon className="w-5 h-5" /></div>}
        <div className="font-medium text-lg text-gray-700">{title}</div>
      </div>

      {/* עמודת המחיר - בצד שמאל */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-xl text-cyan-800 whitespace-nowrap">{typeof price === 'number' ? new Intl.NumberFormat('he-IL').format(price) : price} {typeof price === 'number' ? '₪' : ''}</div>
        {onInfoClick && (
          <Button variant="ghost" size="sm" className="text-cyan-600 hover:bg-cyan-100 p-1 h-auto rounded-full" onClick={onInfoClick}>
            <Info className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TripItemRow;