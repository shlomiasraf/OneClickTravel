// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.oneclick.travel',
  appName: 'OneClickTravel',
  webDir: 'dist', // ← תיקיית ה-build של React/Vite
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com']
    }
  }
};

export default config;
