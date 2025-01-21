import { Community } from '../community/interfaces';

export interface User {
  id: string;
  individualStyles: string[];
  userRole?: string[];
  email: string;
  fullName?: string;
  location?: UserLocation;
  gender?: Gender;
  photo?: {
    id: string;
    path: string;
  };
  about: string | null;
  createdAt: string;
  deactivated: false;
  provider: 'email' | 'google' | 'apple';
  socialId: string | null;
  subscribers: string[];
  subscribersCount: number;
  subscriptions: string[];
  subscriptionsCount: number;
  updatedAt: string;
}

export interface AuthResponse {
  refreshToken: string;
  token: string;
  tokenExpires: number;
  user: User;
}

export interface AuthUserRequest {
  email: string;
  password: string;
}

export interface UserLocation {
  city: string;
  country: string;
  countryCode2: string;
  countryCode3: string;
  location: string;
}

export type Gender = 'male' | 'female';
