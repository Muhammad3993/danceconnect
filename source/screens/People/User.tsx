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

const User = ({route, navigation}) => {
  const {getDifferentUser, differentUser, isLoadingUser} = usePeople();
  const {currentUser} = useRegistration();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);

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
        limit: 20,
      },
      ({data, ...metadata}) => {
        if (!metadata.loading) {
          setIsloading(false);
          setPosts(data);
        }

        setLoadingMore(metadata.loading);
        setHasNextPage(metadata.hasNextPage ?? false);

        if (metadata.onNextPage) {
          onNextPage.current = metadata.onNextPage;
        } else {
          onNextPage.current = undefined;
        }
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
      ) : (
        <ProfileList
          onEndReached={
            hasNextPage && !loadingMore ? onNextPage.current : undefined
          }
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
