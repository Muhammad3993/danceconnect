import { Community } from '../community/interfaces';

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

export interface UserShort {
  id: string;
  individualStyles: string[];
  email: string;
  userName?: string;
  location?: UserLocation;
  userGender?: Gender;
  userImage?: string;
}

export interface User extends UserShort {
  myCommunities: Community[];
  joinedCommunities: Community[];
  userRole: string[];
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
