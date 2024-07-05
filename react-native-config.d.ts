declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_WEB_CLIENT_ID?: string;
    AMITY_API_KEY?: string;
    STRIPE_MERCHANT_ID?: string;
    GOOGLE_API_KEY?: string;
    API_URL?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
