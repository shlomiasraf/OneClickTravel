import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UserProfile } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, User as UserIcon, UserCheck, ShieldCheck, Lock, Loader2 } from "lucide-react";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    first_name_en: "",
    last_name_en: "",
    phone: "",
    passport_number: "",
    id_number: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);

        // בדיקה אם יש פרופיל למשתמש
        const profiles = await UserProfile.filter({ user_id: userData.id });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
        }
      } catch (error) {
        console.error("שגיאה בטעינת נתוני משתמש:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    setSaving(true);
    setSaveSuccess(false);
    
    try {
      const profiles = await UserProfile.filter({ user_id: user.id });
      
      if (profiles.length > 0) {
        // עדכון פרופיל קיים
        await UserProfile.update(profiles[0].id, {
          ...profile,
          user_id: user.id
        });
      } else {
        // יצירת פרופיל חדש
        await UserProfile.create({
          ...profile,
          user_id: user.id
        });
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("שגיאה בשמירת הפרופיל:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8 text-center brand-text">הפרטים שלי</h1>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="personal" className="text-base py-3">פרטים אישיים</TabsTrigger>
          <TabsTrigger value="account" className="text-base py-3">פרטי חשבון</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-cyan-600" />
                פרטים אישיים
              </CardTitle>
              <CardDescription>
                הפרטים האישיים שלך משמשים להזמנת כרטיסי טיסה ומלונות
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name_en">שם פרטי באנגלית</Label>
                  <Input
                    id="first_name_en"
                    name="first_name_en"
                    placeholder="First Name"
                    value={profile.first_name_en}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name_en">שם משפחה באנגלית</Label>
                  <Input
                    id="last_name_en"
                    name="last_name_en"
                    placeholder="Last Name"
                    value={profile.last_name_en}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <Label htmlFor="phone">מספר טלפון</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="מספר טלפון"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="id_number">מספר תעודת זהות</Label>
                  <Input
                    id="id_number"
                    name="id_number"
                    placeholder="מספר תעודת זהות"
                    value={profile.id_number}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passport_number">מספר דרכון</Label>
                  <Input
                    id="passport_number"
                    name="passport_number"
                    placeholder="מספר דרכון"
                    value={profile.passport_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={saveProfile} 
                  disabled={saving}
                  className="bg-gradient text-white hover:opacity-90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      שומר...
                    </>
                  ) : (
                    "שמור פרטים"
                  )}
                </Button>
              </div>
              
              {saveSuccess && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    הפרטים נשמרו בהצלחה
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-cyan-600" />
                פרטי חשבון
              </CardTitle>
              <CardDescription>
                פרטי החשבון שלך במערכת
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">שם מלא</p>
                    <p className="font-medium">{user.full_name}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">כתובת אימייל</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">סוג חשבון</p>
                      <p className="text-sm text-gray-500">{user.role === 'admin' ? 'מנהל' : 'משתמש רגיל'}</p>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-cyan-600" />
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">אבטחה</p>
                      <p className="text-sm text-gray-500">התחברות באמצעות גוגל</p>
                    </div>
                    <Lock className="h-5 w-5 text-cyan-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}