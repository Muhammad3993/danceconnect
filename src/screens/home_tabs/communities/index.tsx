import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { theming } from 'common/constants/theming';
import { LocationIcon } from 'components/icons/location';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { DCInput } from 'components/shared/input';
import { PlusBigIcon } from 'components/icons/plusBig';
import { SearchIcon } from 'components/icons/search';
import { CommunitiesEvent } from 'components/commuties_event';
import { useDCStore } from 'store';
import { DCAmity } from 'common/libs/amity';

export function CommunitiesScreen() {
  const user = useDCStore.use.user();
  const [all, setAll] = useState<Amity.Post[]>([]);
  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = DCAmity.queryUserPosts({
      userId: user?.id,
      onGetPosts: ({ data, onNextPage, hasNextPage, loading, error }) => {
        if (!loading) {
          setAll(data ?? []);
          console.log(data, onNextPage, hasNextPage, loading, error);
        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [user]);


  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.communitiesLocation}>
        <LocationIcon width={16} height={16} />
        <Text style={styles.communitiesLocationTitle}>San Francisco, California</Text>
        <RightArrowIcon style={{transform: [{rotate: "90deg"}]}} />
      </View>

      <View style={styles.communitiesSearch}>
        <DCInput
          leftIcon={<SearchIcon />}
          placeholder='Community name, dance style'
          containerStyle={{
            width: "82%",
            height: 48,
          }}
          inputStyle={{
            padding: 0,
            borderWidth: 0,
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 20,
          }}
        />
        <View style={styles.communitiesPlus}>
          <PlusBigIcon />
        </View>
      </View>

      <CommunitiesEvent all={all} communities={[]} events={[]} user={user} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
    paddingHorizontal: theming.spacing.LG,
  },
  communitiesLocation: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theming.spacing.SM,
    marginTop: 10
  },
  communitiesLocationTitle: {
    fontWeight: "700",
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary
  },
  communitiesPlus: {
    width: 48,
    height: 48,
    backgroundColor: theming.colors.purple,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  communitiesSearch: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  }
});
