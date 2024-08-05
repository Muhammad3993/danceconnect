import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDCStore } from 'store';
import { theming } from 'common/constants/theming';
import { TabScreenProps } from 'screens/interfaces';
import { PrifleView } from 'components/profile_view';

import { DCAmity } from 'common/libs/amity';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DCBottomSheet } from 'components/shared/bottom_sheet';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { ProfileSettings } from './ui/settings';
import { SettingIcon } from 'components/icons/settingIcon';
import { ShareIcon } from 'components/icons/shareIcon';
import { DCRoundIcon } from 'components/shared/round_icon';
import { DCButton } from 'components/shared/button';
import { PlusSquareIcon } from 'components/icons/plusSquare';

export function ProfileScreen({ navigation }: TabScreenProps<'profile'>) {
  const user = useDCStore.use.user();
  const [posts, setPosts] = useState<Amity.Post[]>([]);
  const settingsSheet = useRef<BottomSheetModal>(null);

  // const logOut = useDCStore.use.clearDCStoreAction();
  // const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = DCAmity.queryUserPosts({
      userId: user?.id,
      onGetPosts: ({ data, onNextPage, hasNextPage, loading, error }) => {
        if (!loading) {
          setPosts(data ?? []);
          console.log(data, onNextPage, hasNextPage, loading, error);
        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const presentModal = useCallback(() => {
    settingsSheet.current?.present();
  }, []);

  const closeModal = useCallback(() => {
    settingsSheet.current?.close();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <View style={styles.profileTop}>
        <TouchableOpacity onPress={presentModal}>
          <SettingIcon stroke={theming.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <ShareIcon stroke={theming.colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <PrifleView
        posts={posts}
        communities={[]}
        events={[]}
        user={user}
        actions={
          <DCButton
            children="Add Post"
            leftIcon={<PlusSquareIcon />}
            containerStyle={{
              width: '100%',
              height: 38,
              gap: 8,
            }}
          />
        }
      />
      <DCBottomSheet snapPoints={['80%']} ref={settingsSheet}>
        <BottomSheetView>
          <ProfileSettings close={closeModal} navigation={navigation} />
        </BottomSheetView>
      </DCBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // padding: theming.spacing.LG,
    backgroundColor: theming.colors.white,
    // justifyContent: 'space-between',
    position: "relative",
  },
  profileTop: {
    flexDirection: 'row-reverse',
    alignContent: 'center',
    gap: 10,
    paddingHorizontal: theming.spacing.MD,
    marginTop: 10,
  },
  profileTopIcon: {
    width: 44,
    height: 44,
    backgroundColor: theming.colors.purpleTransparent,
  },
  // profileView: {
  //   flexDirection: 'row',
  //   gap: 20,
  //   width: '100%',
  // },
  // img: { width: 60, height: 60, borderRadius: 50 },
  // name: {
  //   color: theming.colors.textPrimary,
  //   fontSize: 20,
  //   fontFamily: theming.fonts.latoRegular,
  //   fontWeight: '700',
  //   marginBottom: theming.spacing.SM,
  // },
  // email: {
  //   color: theming.colors.textSecondary,
  //   fontSize: 16,
  //   fontFamily: theming.fonts.latoRegular,
  // },
});
