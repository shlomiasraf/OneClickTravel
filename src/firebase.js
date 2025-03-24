// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Preferences } from '@capacitor/preferences';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBolxTYm7PiuywICV49JCPljlGDUXVSsxI",
  authDomain: "oneclicktravel-17828.firebaseapp.com",
  projectId: "oneclicktravel-17828",
  storageBucket: "oneclicktravel-17828.appspot.com",
  messagingSenderId: "500595251807",
  appId: "1:500595251807:web:fcca5bc55e711952e3d9ea",
  measurementId: "G-LJ9E7BFCZ2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const isNative = !!window.Capacitor?.isNativePlatform;

// הרשמה
const registerWithEmail = async (email, password) => {
  if (isNative) {
    const result = await FirebaseAuthentication.createUserWithEmailAndPassword({ email, password });
    const user = await FirebaseAuthentication.getCurrentUser();
    return user.user;
  } else {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }
};

// התחברות
const loginWithEmail = async (email, password) => {
    if (isNative) {
      const result = await FirebaseAuthentication.signInWithEmailAndPassword({ email, password });
      const user = await FirebaseAuthentication.getCurrentUser();
  
      // שמירה באחסון מקומי
      if (user?.user?.uid) {
        await Preferences.set({
          key: 'user',
          value: JSON.stringify(user.user),
        });
      }
      return user.user;
    } else {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
    }
  };
  
// קבלת משתמש
const getCurrentUser = async () => {
  if (isNative) {
    const result = await FirebaseAuthentication.getCurrentUser();
    return result.user;
  } else {
    return auth.currentUser;
  }
};

// התנתקות
const logout = async () => {
    if (window.Capacitor?.isNativePlatform) {
        console.log("📱 logout דרך FirebaseAuthentication (native)");
        try {
          await FirebaseAuthentication.signOut();
          console.log("✅ signOut הצליח ב־native");
        } catch (err) {
          console.error("❌ שגיאה ב־FirebaseAuthentication.signOut:", err);
          throw err;
        }
      } else {
        console.log("🖥️ logout דרך Firebase (web)");
        await auth.signOut();
    }
};
  

export {
  auth,
  onAuthStateChanged,
  registerWithEmail,
  loginWithEmail,
  logout,
  getCurrentUser
};
