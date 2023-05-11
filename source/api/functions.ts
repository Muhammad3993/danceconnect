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
export const getCommunityByUid = async (communityUid: string) => {
  // database()
  //   .ref(`community/${communityUid}`)
  //   .on('value', snapshot => {
  //     return snapshot.val();
  //   });

  const data = await firebase
    .database()
    .ref(`community/${communityUid}`)
    .once('value');
  // console.log('getCommunityByUi function', data.val(), communityUid);
  return data.val();
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

export const removeCommunity = async (uid: string) => {
  await database().ref(`community/${uid}`).remove();
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

export const joinEvent = async (
  communityUid: string,
  userUid: string,
  eventUid: string,
) => {
  const user = {
    userUid: userUid,
  };
  const refEvent = database().ref(`events/${eventUid}/attendedPeople`);
  const refUser = database().ref(`users/${userUid}/goingEvent`);

  refEvent
    .transaction(currentEvent => {
      const isAvailable = currentEvent
        ?.map((item: any) => item?.userUid)
        ?.includes(userUid);
      if (currentEvent === null) {
        return [user];
      }
      if (isAvailable) {
        return currentEvent?.filter((item: any) => item?.userUid !== userUid);
      }
      return [...currentEvent, user];
    })
    .then(transaction => {
      const isFollowed = transaction.snapshot
        .val()
        ?.map((item: any) => item?.userUid)
        ?.includes(userUid);
      return isFollowed;
    });

  return refUser
    .transaction(currentEvent => {
      const isAvailable = currentEvent
        ?.map((item: any) => item)
        ?.includes(eventUid);
      if (currentEvent === null) {
        return [eventUid];
      }
      if (isAvailable) {
        return currentEvent?.filter((item: any) => item !== eventUid);
      } else {
        return [...currentEvent, eventUid];
      }
    })
    .then(transaction => {
      const followingCommunities = transaction.snapshot.val();
      return followingCommunities ?? [];
    });
};

export const changeInformationCommunity = async (
  name: string,
  description: string,
  country: string,
  location: string,
  communityUid: string,
  followers: string[],
  categories: string[],
  images: string[],
) => {
  return database()
    .ref(`community/${communityUid}`)
    .update({
      name: name,
      description: description,
      country: country,
      followers: followers,
      categories: categories,
      images: images,
      location: location,
    })
    .then();
};

export const getEvents = async () => {
  const eventsList = await database().ref('events').once('value');
  return eventsList.val();
};
export const getEventByUid = async (eventUid: string) => {
  const data = await firebase
    .database()
    .ref(`events/${eventUid}`)
    .once('value');
  return data.val();
};

export const createEvent = async (
  name: string,
  description: string,
  country: string,
  location: string,
  creatorUid: string,
  categories: string[],
  images: string[],
  eventDate: null,
  place: string,
  communityUid: string,
) => {
  const refEventsCommunity = database().ref(`community/${communityUid}/events`);
  const refEventsUser = database().ref(`users/${creatorUid}/events`);
  const refNewEvent = database().ref('/events').push();
  return refNewEvent
    .update({
      name: name,
      description: description,
      country: country,
      location: location,
      creatorUid: creatorUid,
      categories: categories,
      images: images,
      eventUid: refNewEvent.key,
      eventDate: eventDate,
      place: place,
    })
    .then(() => {
      refEventsUser
        .transaction(events => {
          if (!events?.length) {
            return [refNewEvent.key];
          }
          return [...events, refNewEvent.key];
        })
        .then();

      refEventsCommunity
        .transaction(events => {
          if (!events?.length) {
            return [refNewEvent.key];
          }
          return [...events, refNewEvent.key];
        })
        .then();
      // getUserData(creatorUid).then((userData: any) => {
      //   const communities: string[] = userData.myComunitiesIds ?? [];
      //   // console.log('getUserData', userData);
      //   database()
      //     .ref(`users/${creatorUid}`)
      //     .update({
      //       myEvents: [...communities, refNewEvent.key],
      //     })
      //     .then();
      // });
      // await refEventsUser
      //   .transaction(events => {
      //     return [...events, refNewEvent.key];
      //   })
      //   .then();
      // await refEventsCommunity
      //   .transaction(events => {
      //     return [...events, refNewEvent.key];
      //   })
      //   .then();
      // console.log('createCommunity', newCommunity.key);
      // return response;
    });
};
/**
 * refEventsCommunity (`community/${communityUid}/events`)
 * refEventsUser (`users/${userUid}/manageEvents`)
 * refEvent = analog fn createCommunity
 *
 * refEventsCommunity.transaction(events => {
 *    return [...events, eventUid]
 * });
 * .then(transaction => {
 *      return transaction.snapshot.val();
 * });
 **************
 * * refEventsUser.transaction(events => {
 *    return [...events, eventUid]
 * });
 * .then(transaction => {
 *      return transaction.snapshot.val();
 * });
 */
