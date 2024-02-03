import {ChannelRepository, PostRepository} from '@amityco/ts-sdk';
import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '../../components/Button';
import {LoadingView} from '../../components/loadingView';
import {ProfileList} from '../../components/profileList';
import usePeople from '../../hooks/usePeople';
import useRegistration from '../../hooks/useRegistration';
import colors from '../../utils/colors';
import Unavailable from '../../utils/404';

const User = ({route, navigation}) => {
  const {getDifferentUser, differentUser, isLoadingUser} = usePeople();
  const {currentUser} = useRegistration();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [hasNextPage, setHasNextPage] = useState(false);
  const onNextPage = useRef<() => void>();

  useEffect(() => {
    const userId = route.params.id;
    getDifferentUser(userId);
    const sub = PostRepository.getPosts(
      {
        targetId: userId,
        targetType: 'user',
        includeDeleted: false,
        limit: 12,
      },
      ({data, ...metadata}) => {
        if (!metadata.loading) {
          setIsloading(false);
          setLoadingMore(false);
          setPosts(data ?? []);
        }

        setHasNextPage(metadata.hasNextPage ?? false);

        onNextPage.current = metadata.onNextPage;
      },
    );

    return () => {
      sub();
    };
  }, [route]);

  const writeMessage = async () => {
    try {
      const newChannel = {
        displayName: differentUser.userName,
        tags: [],
        type: 'conversation' as Amity.ChannelType,
        userIds: [differentUser.id],
        metadata: {
          users: [currentUser, differentUser],
        },
      };

      const {data: channel} = await ChannelRepository.createChannel(newChannel);

      navigation.push('Chat', {channel});
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      {isLoadingUser ? (
        <LoadingView />
      ) : differentUser ? (
        <ProfileList
          loadingMore={loadingMore}
          isCurrentUser={false}
          onEndReached={() => {
            if (
              posts.length % 12 === 0 &&
              !loadingMore &&
              hasNextPage &&
              onNextPage.current
            ) {
              setLoadingMore(true);
              onNextPage.current();
            }
          }}
          isLoading={isLoading}
          posts={posts}
          user={differentUser}
          actions={
            <Button
              iconName="chatoutline"
              disabled
              title="Send Message"
              onPress={writeMessage}
              iconColor={colors.white}
              buttonStyle={styles.actionBtn}
              iconSize={17}
            />
          }
        />
      ) : (
        <Unavailable information="Looks like the user you're looking for doesn't exist." />
      )}
    </SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  actionBtn: {
    flex: 1,
    marginHorizontal: 0,
    paddingVertical: 8,
  },
});
export default User;
