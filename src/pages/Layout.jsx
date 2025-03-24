import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

import {
  auth,
  onAuthStateChanged,
  loginWithEmail,
  registerWithEmail,
  logout,
} from "@/firebase";
import {
  PlaneTakeoff,
  Mail,
  UserPlus,
  LogIn,
  LogOut,
  Menu,
  PlusCircle,
  Compass,
  Home,
  User as UserIcon,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Preferences } from '@capacitor/preferences';


export default function Layout({ children }) {
  // ---- State for Auth ----
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);
  const [formMode, setFormMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---- State for UI ----
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const checkUser = async () => {
      try {
        await Preferences.configure();
        const saved = await Preferences.get({ key: 'user' });

        if (saved.value) {
          const parsed = JSON.parse(saved.value);
        
          // בדיקה האם באמת יש UID (משתמש אותנטי)
          if (parsed?.uid) {
            setUser(parsed);
            console.log("👤 נמצא משתמש מה־getCurrentUser paresed:", parsed);

            if (location.pathname === "/") {
              navigate("/dashboard");
            }
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("❌ שגיאה בשחזור המשתמש:", err);
      }

      try {
        const result = await FirebaseAuthentication.getCurrentUser();
        if (result?.user) {
          console.log("👤 נמצא משתמש מה־getCurrentUser:", result.user);
          setUser(result.user);
          if (location.pathname === "/") 
          {
            navigate("/dashboard");
          }
          return;
        }
      } catch (err) {
        console.error("❌ שגיאה בבדיקת התחברות:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // ✅ פה תוסיף את ה־redirect אם המשתמש נותק
  useEffect(() => {
    if (!isLoading && !user && location.pathname !== "/") {
      console.log("➡️ מנווט חזרה למסך התחברות כי אין משתמש");
      navigate("/", { replace: true });
    }
  }, [user, isLoading, location.pathname]);
  

  
  

  // ---- התחברות / הרשמה ----
  const handleSubmit = async () => {
    setLoginError(null);
    try {
      console.log("🔐 מתחיל login/register");
  
      let firebaseUser;
  
      if (formMode === "login") {
        console.log("➡️ מנסה להתחבר עם:", email, password);
        firebaseUser = await loginWithEmail(email, password);
      } else {
        console.log("➡️ מנסה להירשם עם:", email, password);
        firebaseUser = await registerWithEmail(email, password);
      }
  
      console.log("✅ הצליח:", firebaseUser);
      setUser(firebaseUser);
      navigate("/dashboard");
  
    } catch (err) {
      console.error("❌ שגיאה ב־handleSubmit:", err);
      setLoginError(err.message);
    }
  };
  
  // ---- התנתקות ----
  const handleLogout = async () => {
    console.log("🚪 התנתקות התחילה");
  
    try {
      await logout();
      await Preferences.remove({ key: 'user' });
      setUser(null);
      setEmail("");  // מנקה את השדה של המייל
      setPassword(""); 
      navigate("/");
    } catch (err) {
      console.error("❌ שגיאה בהתנתקות:", err);
      alert("שגיאה בהתנתקות: " + JSON.stringify(err)); // תראה מה בפועל מגיע
    }
    
  };
  

  // ---- אם עדיין טוען ----
  if (isLoading) {
    console.log("⏳ עדיין טוען - מציג spinner...");
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  // ---- אם אין משתמש מחובר - מציג טופס התחברות/הרשמה ----
  if (!user) {
    console.log("🙋‍♂️ לא מחובר - מציג מסך התחברות");
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <PlaneTakeoff className="mx-auto h-12 w-12 text-cyan-600" />
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              OneClickTravel
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              תכנון טיולים בקלות ובמהירות
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center">
                {formMode === "login" ? "התחברות למערכת" : "הרשמה"}
              </CardTitle>
              <CardDescription className="text-center">
                {formMode === "login"
                  ? "התחבר עם המייל שלך כדי להתחיל"
                  : "צור חשבון חדש כדי להצטרף"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="email"
                placeholder="כתובת אימייל"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full rounded text-sm"
              />
              <input
                type="password"
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full rounded text-sm"
              />
              {loginError && (
                <Alert className="bg-red-50 text-red-600 border-red-200">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleSubmit}
                className="w-full bg-cyan-600 text-white hover:bg-cyan-700"
              >
                {formMode === "login" ? (
                  <>
                    <LogIn className="ml-2 h-5 w-5" />
                    התחברות
                  </>
                ) : (
                  <>
                    <UserPlus className="ml-2 h-5 w-5" />
                    הרשמה
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter className="text-center text-sm text-gray-500 flex justify-center">
              <button
                onClick={() =>
                  setFormMode(formMode === "login" ? "register" : "login")
                }
                className="text-cyan-600 hover:underline"
              >
                {formMode === "login"
                  ? "אין לך חשבון? לחץ כאן להרשמה"
                  : "כבר יש לך חשבון? לחץ כאן להתחברות"}
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // ---- משתמש מחובר - מציג את ה-Layout המלא ----
  console.log("✅ מחובר - מציג את התוכן");

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      {/* סגנונות מותאמים */}
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

          @media (max-width: 768px) {
            .safe-area-top {
                padding-top: env(safe-area-inset-top, 16px);
            }
          }
        `}
      </style>

      {/* רקע מעבר */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* סיידבר */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64",
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="bg-gradient p-5 text-white safe-area-top" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.25rem)' }}>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <PlaneTakeoff className="w-6 h-6" />
              OneClickTravel
            </h1>
          </div>

          {/* פרטי המשתמש */}
          {user && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="font-medium">{user.displayName || "משתמש"}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* תפריט */}
          <nav className="flex-1 p-4 space-y-1">
            <Link
              to="/dashboard"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors",
                location.pathname === "/dashboard" && "bg-cyan-50 text-cyan-600 font-medium"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <Home className="w-5 h-5" />
              דף הבית
            </Link>
            <Link
              to="/trips"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors",
                location.pathname === "/Trips" && "bg-cyan-50 text-cyan-600 font-medium"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <Compass className="w-5 h-5" />
              הטיולים שלי
            </Link>
            <Link
              to="/createtrip"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors",
                location.pathname === "/CreateTrip" && "bg-cyan-50 text-cyan-600 font-medium"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <PlusCircle className="w-5 h-5" />
              תכנון טיול חדש
            </Link>
            <Link
              to="/myprofile"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors",
                location.pathname === "/MyProfile" && "bg-cyan-50 text-cyan-600 font-medium"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <UserCircle className="w-5 h-5" />
              הפרטים שלי
            </Link>
          </nav>

          {/* כפתור התנתקות */}
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

      {/* תוכן */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* כותרת עליונה במובייל */}
        <header
          className="px-4 pb-3 bg-white border-b flex items-center justify-between lg:hidden"
          style={{
            paddingTop: `calc(env(safe-area-inset-top, 0px) + 1.75rem)` // fallback ל־0 אם אין safe-area
          }}>
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

        {/* תוכן הדף */}
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          <Outlet context={user} />
        </main>
      </div>
    </div>
  );
}
