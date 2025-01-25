import { User } from '../user/inerfaces';

export interface Community {
  images: string[];
  categories: string[];
  managers: User[];
  creator: User;
  followers: User[];
  createdAt: string;
  updatedAt: string;
  id: string;
  description?: string;
  location: string;
  title: string;
  type: 'free' | 'paid';
  isFollowing: boolean;
  channelId: string;
}
