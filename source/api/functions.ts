import database, {firebase} from '@react-native-firebase/database';

export const userExists = async (uid: string) => {
  const snap = await firebase.database().ref(`users/${uid}`).once('value');
  return snap.exists();
};
export const getUserData = async (uid: string) => {
  const user = firebase.auth().currentUser?._user;
  // console.log(user);
  const snap = await firebase.database().ref(`users/${uid}`).once('value');
  // console.log('getUserData', snap.val());
  const refUser = database().ref(`users/${uid}/auth_data`);
  refUser.transaction(currentDate => {
    return {...currentDate, ...user};
  });

  return snap.val();
};
export const getUserDataById = async (uid: string) => {
  const snap = await firebase.database().ref(`users/${uid}`).once('value');
  return snap.val();
};

export const getImgsAttendedPeopleToEvent = async (ids: string[]) => {
  let images: string[] = [];
  for (let i = 0; i < ids.length; i++) {
    const item = ids[i];
    const ref = await firebase.database().ref(`users/${item}`).once('value');
    const img = ref.val()?.profileImg;
    images.push(img);
  }
  return Object.values(images);
};

export const getConstantsFromFirebase = async () => {
  const constants = await firebase.database().ref('appConstants').once('value');
  return constants.val();
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
  // country: string,
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
      // country: country,
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
  const userUid = firebase.auth().currentUser?.uid;
  const userValues = await firebase
    .database()
    .ref(`users/${userUid}`)
    .once('value');
  const userCommunities = userValues?.val()?.myComunitiesIds;
  const userEvents = userValues?.val()?.events;
  if (userCommunities?.length > 0) {
    database()
      .ref(`community/${uid}`)
      .remove()
      .then()
      .finally(() => {
        if (userEvents?.length > 0) {
          userEvents.forEach((eventId: string) => {
            removeEvent(eventId)
              .then()
              .finally(async () => {
                await database().ref(`users/${userUid}`).remove();
                firebase.auth().currentUser?.delete();
              });
          });
        }
      });
  } else {
    await database().ref(`users/${userUid}`).remove();
    firebase.auth().currentUser?.delete();
  }

  // await database().ref(`community/${uid}`).remove();
};
export const removeEvent = async (uid: string) => {
  await database().ref(`events/${uid}`).remove();
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
  // country: string,
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
      // country: country,
      followers: followers,
      categories: categories,
      images: images,
      location: location,
    })
    .then();
};
// name: string,
// description: string,
// country: string,
// location: string,
// creatorUid: string,
// categories: string[],
// images: string[],
// eventDate: null,
// place: string,
export const changeInformationEvent = async (
  name: string,
  description: string,
  // country: string,
  location: string,
  categories: string[],
  images: string[],
  eventDate: null,
  place: string,
  typeEvent: string,
  eventUid: string,
) => {
  return database()
    .ref(`events/${eventUid}`)
    .update({
      name: name,
      description: description,
      // country: country,
      categories: categories,
      images: images,
      location: location,
      eventDate: eventDate,
      place: place,
      typeEvent: typeEvent,
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
  // country: string,
  location: string,
  creatorUid: string,
  categories: string[],
  images: string[],
  eventDate: null,
  place: string,
  typeEvent: string,
  communityUid: string,
) => {
  const refEventsCommunity = database().ref(`community/${communityUid}/events`);
  const refEventsUser = database().ref(`users/${creatorUid}/events`);
  const refNewEvent = database().ref('/events').push();
  const attedCreator = {
    userUid: creatorUid,
  };
  return refNewEvent
    .update({
      name: name,
      description: description,
      // country: country,
      location: location,
      creatorUid: creatorUid,
      categories: categories,
      images: images,
      eventUid: refNewEvent.key,
      eventDate: eventDate,
      place: place,
      communityUid: communityUid,
      typeEvent: typeEvent,
      attendedPeople: [attedCreator],
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
    });
};

export const changeProfileInformation = async (
  name: string,
  gender: string,
  userImage: object,
) => {
  const userUid = firebase.auth().currentUser?.uid;
  const userRef = database().ref(`users/${userUid}`);
  return userRef
    .update({
      name: name,
      gender: gender,
      profileImg: userImage,
    })
    .then();
};
export const changeUserDanceStyles = async (danceStyles: string[]) => {
  const userUid = firebase.auth().currentUser?.uid;
  const userRef = database().ref(`users/${userUid}`);
  return userRef
    .update({
      individualStyles: danceStyles,
    })
    .then();
};
export const changeUserPassword = async (newPassword: string) => {
  const user = firebase.auth().currentUser;
  return user
    .updatePassword(newPassword)
    .then(res => {
      // console.log('changeUserPassword success', res);
      return res;
    })
    .catch(er => {
      // console.log('changeUserPassword function err', er?.message);
      return er;
    });
};
export const setUserCountry = async (country: string) => {
  const userUid = firebase.auth().currentUser?.uid;
  const userRef = database().ref(`users/${userUid}`);
  return userRef
    .update({
      country: country,
    })
    .then();
};
