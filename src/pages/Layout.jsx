
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { 
  Menu, 
  X, 
  PlaneTakeoff, 
  PlusCircle, 
  Compass, 
  LogOut, 
  Home,
  User as UserIcon,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.error("שגיאה בקבלת נתוני משתמש:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.reload();
    } catch (error) {
      console.error("שגיאה בהתנתקות:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      <style>
        {`
          :root {
            --primary: #0891b2;
            --primary-light: #22d3ee;
            --primary-dark: #0e7490;
            --gradient-start: #0891b2;
            --gradient-end: #06b6d4;
            --accent: #f97316;
          }
          
          body {
            background-color: #f8fafc;
          }
          
          .bg-gradient {
            background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
          }
          
          .brand-text {
            background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>

      {/* כיסוי רקע לניידים */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* תפריט צד */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64",
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="bg-gradient p-5 text-white">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <PlaneTakeoff className="w-6 h-6" />
              OneClickTravel
            </h1>
          </div>

          {user && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="font-medium">{user.full_name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-1">
            <Link
              to={createPageUrl("Dashboard")}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors",
                location.pathname === createPageUrl("Dashboard") && "bg-cyan-50 text-cyan-600 font-medium"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <Home className="w-5 h-5" />
              דף הבית
            </Link>
            <Link
              to={createPageUrl("Trips")}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors",
                location.pathname === createPageUrl("Trips") && "bg-cyan-50 text-cyan-600 font-medium"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <Compass className="w-5 h-5" />
              הטיולים שלי
            </Link>
            <Link
              to={createPageUrl("CreateTrip")}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors",
                location.pathname === createPageUrl("CreateTrip") && "bg-cyan-50 text-cyan-600 font-medium"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <PlusCircle className="w-5 h-5" />
              תכנון טיול חדש
            </Link>
            <Link
              to={createPageUrl("MyProfile")}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors",
                location.pathname === createPageUrl("MyProfile") && "bg-cyan-50 text-cyan-600 font-medium"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <UserCircle className="w-5 h-5" />
              הפרטים שלי
            </Link>
          </nav>

          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start text-gray-700 gap-3"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              התנתקות
            </Button>
          </div>
        </div>
      </div>

      {/* תוכן עיקרי */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b lg:hidden">
          <h1 className="text-lg font-bold flex items-center gap-2 text-cyan-600">
            <PlaneTakeoff className="w-5 h-5" />
            OneClickTravel
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
