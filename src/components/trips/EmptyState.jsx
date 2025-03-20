import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function EmptyState({ title, description }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <PlusCircle className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <Link to={createPageUrl("CreateTrip")}>
        <Button className="bg-blue-600 hover:bg-blue-700">
          תכנון טיול חדש
        </Button>
      </Link>
    </div>
  );
}