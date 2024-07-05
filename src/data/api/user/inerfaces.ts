export interface AuthResponse {
  access_token: string;
}

export interface AuthUserRequest {
  email: string;
  password: string;
}

export interface EditUserRequest {
  userRole?: string[];
  individualStyles?: string[];
  userName?: string;
  userGender?: string;
  about?: string;
  fcmToken?: string;
  location?: UserLocation;
  userImage?: string;
}

export interface User {
  id: string;
  myCommunities: string[];
  joinedCommunities: string[];
  userRole: string[];
  individualStyles: string[];
  email: string;
  userName?: string;
  location?: UserLocation;
  userGender?: Gender;
  userImage?: string;
  fcmToken?: string;
  about?: string;
}

export interface UserLocation {
  country: string;
  countryCode3: string;
  countryCode2: string;
  city: string;
  location: string;
}

export type Gender = 'male' | 'female';
