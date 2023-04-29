import database, {firebase} from '@react-native-firebase/database';

export const userExists = async (uid: string) => {
  const snap = await firebase.database().ref(`users/${uid}`).once('value');
  return snap.exists();
};
export const getUserData = async (uid: string) => {
  const snap = await firebase.database().ref(`users/${uid}`).once('value');
  // console.log('getUserData', snap.val());
  return snap.val();
};

export const createCommunity = async (
  name: string,
  description: string,
  country: string,
  location: string,
  creatorUid: string,
  categories: string[],
  images: string[],
) => {
  const newCommunity = database().ref('/community').push();
  return newCommunity
    .update({
      name: name,
      description: description,
      country: country,
      location: location,
      creatorUid: creatorUid,
      categories: categories,
      images: images,
      id: newCommunity.key,
    })
    .then(response => {
      getUserData(creatorUid).then((userData: any) => {
        const communities: string[] = userData.myComunitiesIds ?? [];
        // console.log('getUserData', userData);
        database()
          .ref(`users/${creatorUid}`)
          .update({
            myComunitiesIds: [...communities, newCommunity.key],
          })
          .then();
      });

      // console.log('createCommunity', newCommunity.key);
      return response;
    });
};

export const getCommunities = async () => {
  const communityList = await database().ref('community').once('value');
  // console.log('getCommunities', communityList.val());
  return communityList.val();
};

export const joinCommunity = async (
  communityUid: string,
  userUid: string,
  userImg: string,
) => {
  const user = {
    userUid: userUid,
    userImg: userImg,
  };
  const refCommunity = database().ref(`community/${communityUid}/followers`);
  const refUser = database().ref(`users/${userUid}/joinedCommunities`);

  refCommunity
    .transaction(currentFollowers => {
      const isAvailable = currentFollowers
        ?.map((item: any) => item?.userUid)
        ?.includes(userUid);
      if (currentFollowers === null) {
        return [user];
      }
      if (isAvailable) {
        return currentFollowers?.filter(
          (item: any) => item?.userUid !== userUid,
        );
      }
      return [...currentFollowers, user];
    })
    .then(transaction => {
      const isFollowed = transaction.snapshot
        .val()
        ?.map((item: any) => item?.userUid)
        ?.includes(userUid);
      return isFollowed;
    });

  return refUser
    .transaction(currentComunities => {
      const isAvailable = currentComunities
        ?.map((item: any) => item)
        ?.includes(communityUid);
      if (currentComunities === null) {
        return [communityUid];
      }
      if (isAvailable) {
        return currentComunities?.filter((item: any) => item !== communityUid);
      } else {
        return [...currentComunities, communityUid];
      }
    })
    .then(transaction => {
      const followingCommunities = transaction.snapshot.val();
      return followingCommunities ?? [];
    });
};
