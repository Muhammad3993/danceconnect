import {PostRepository} from '@amityco/ts-sdk';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as RN from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, ButtonVariant} from '../../components/Button';
import {ProfileList} from '../../components/profileList';
import {useProfile} from '../../hooks/useProfile';
import useRegistration from '../../hooks/useRegistration';
import useTickets from '../../hooks/useTickets';
import colors from '../../utils/colors';
import {SCREEN_HEIGHT} from '../../utils/constants';
import {MenuItems} from './ui/MenuItems';
import usePeople from '../../hooks/usePeople';
import {useIsFocused} from '@react-navigation/native';

const ProfileScreen = ({navigation}) => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const {getUser} = useProfile();
  const {getEventsByUserId, getCommunitiesByUserId} = usePeople();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);

  const [hasNextPage, setHasNextPage] = useState(false);
  const onNextPage = useRef<() => void>();

  const menuRef = useRef<Modalize>(null);

  const {getPurchasedTickets} = useTickets();
  const {currentUser} = useRegistration();

  useEffect(() => {
    const sub = PostRepository.getPosts(
      {
        targetId: currentUser?.id,
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
  }, [currentUser?.id]);

  const editProfile = () => {
    navigation.navigate('ChangeProfile');
  };

  const onPressMenu = () => {
    menuRef.current?.open();
  };

  useEffect(() => {
    getUser();
    getPurchasedTickets();
  }, []);

  useEffect(() => {
    if (isFocused) {
      getEventsByUserId(currentUser.id);
      getCommunitiesByUserId(currentUser.id);
    }
  }, [isFocused, currentUser.id]);

  function createImagePost() {
    navigation.push('CreatePost');
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ProfileList
        isCurrentUser
        onEndReached={
          hasNextPage && !loadingMore ? onNextPage.current : undefined
        }
        isLoading={isLoading}
        posts={posts}
        user={currentUser}
        headerActions={
          <RN.TouchableOpacity onPress={onPressMenu}>
            <RN.Image
              source={{uri: 'setting'}}
              style={{width: 28, height: 28, marginLeft: 20}}
            />
          </RN.TouchableOpacity>
        }
        actions={
          <>
            <Button
              iconName="plusoutline"
              disabled
              title="Add Post"
              onPress={createImagePost}
              buttonStyle={styles.actionBtn}
              iconColor={colors.white}
              iconSize={16}
            />
            <RN.View style={{width: 8}} />
            <Button
              iconName="edit"
              disabled
              title={t('Edit Profile')}
              onPress={editProfile}
              buttonStyle={styles.actionBtn}
              variant={ButtonVariant.outlined}
              iconSize={20}
            />
          </>
        }
      />

      <Portal>
        <Modalize
          modalHeight={SCREEN_HEIGHT * 0.75}
          handlePosition="inside"
          handleStyle={{height: 3, width: 38}}
          ref={menuRef}>
          <MenuItems
            close={() => menuRef.current?.close()}
            navigation={navigation}
          />
        </Modalize>
      </Portal>
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

export default ProfileScreen;
