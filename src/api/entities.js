import { auth } from "@/firebase";

export const User = {
    async me() {
      const user = auth.currentUser;
      return user
        ? {
            id: user.uid, // 💥 חשוב
            full_name: user.displayName || "משתמש",
            email: user.email,
            role: "user"
          }
        : null;
    },
    async logout() {
      return auth.signOut();
    },
  };  
export const Trip = {
    create: (data) => {
      console.log("Saving trip:", data);
      return Promise.resolve({ id: Date.now(), ...data });
    },
  };
  export const TripItem = {
    create: (data) => {
      console.log("יצירת פריט טיול:", data);
      return Promise.resolve({ id: Date.now(), ...data });
    },
  };
  export const UserProfile = {
    getProfile: () => {
      return Promise.resolve({
        full_name: "משתמש לדוגמה",
        email: "example@email.com",
        role: "user",
      });
    },
  };  
  
  