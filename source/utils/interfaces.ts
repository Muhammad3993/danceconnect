type AttendedUser = {
  userImage?: string;
  userGender?: string;
  userUid?: string;
};

export interface CommunityT {
  id: string;
  categories: string[];
  title: string;
  location: string;
  images: string[];
  userImages: [AttendedUser];
  followers: [AttendedUser];
  managers: [];
  creator: {
    uid: string;
  };
  channelId: string;
}
