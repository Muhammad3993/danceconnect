import { UserShort } from '../user/inerfaces';

export interface Community {
  images: string[];
  categories: string[];
  managers: UserShort[];
  creator: UserShort;
  followers: UserShort[];
  createdAt: string;
  updatedAt: string;
  id: string;
  description: string;
  location: string;
  title: string;
  type: 'free' | 'paid';
  isFollowing: boolean;
}
