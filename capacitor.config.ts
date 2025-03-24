// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.oneclick.travel',
  appName: 'OneClickTravel',
  webDir: 'dist', // ← חובה לוודא שזה מצביע על build תקני של react
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com']
    }
  }
};

export default config;
