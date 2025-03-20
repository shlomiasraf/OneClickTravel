import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecommendedDestinations from "../components/dashboard/RecommendedDestinations";

export default function Dashboard() {
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex justify-end mb-8">
        <Link to={createPageUrl("CreateTrip")}>
          <Button className="bg-gradient text-white hover:opacity-90">
            <PlusCircle className="ml-2 h-5 w-5" />
            תכנון טיול חדש
          </Button>
        </Link>
      </div>

      <RecommendedDestinations />
    </div>
  );
}