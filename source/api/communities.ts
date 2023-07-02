import database from '@react-native-firebase/database';

export const getMinInfoCommunities = async () => {
  const communities = await database().ref('community').once('value');
  const communitiesData = Object.values(communities.val());

  return communitiesData;
};
