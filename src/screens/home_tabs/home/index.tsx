import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { theming } from 'common/constants/theming';
import { DCRoundIcon } from 'components/shared/round_icon';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { HomeItem } from 'components/shared/home_item';
import { StartCommunity } from 'components/shared/start_community';
import { HomeEvent } from 'components/home_event';
import { DCAmity } from 'common/libs/amity';
import { useDCStore } from 'store';

export function HomeScreen() {
  const user = useDCStore.use.user();
  const [all, setAll] = useState<Amity.Post[]>([]);

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
    <ScrollView style={styles.root}>
      <View style={styles.homeTop}>
        <Text style={styles.homeTitle}>You might be interested</Text>
        <DCRoundIcon
          icon={<RightArrowIcon />}
          iconBoxStyle={{
            width: 28,
            height: 28,
            backgroundColor: theming.colors.lightPurple,
          }}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HomeItem />
        <HomeItem />
      </ScrollView>

      <StartCommunity />

      <View style={styles.homeEvents}>
        <Text style={styles.homeEventsTitle}>Your upcoming events</Text>

        <HomeEvent all={all} communities={[]} events={[]} user={user} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
    padding: theming.spacing.LG,
  },
  homeTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeTitle: {
    fontSize: theming.spacing.LG,
    fontWeight: '700',
    color: theming.colors.textPrimary,
  },
  homeEvents: {
    marginVertical: 30,
  },
  homeEventsTitle: {
    color: theming.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
  },
  item: {
    width: '100%',
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: theming.spacing.SM,
    marginTop: 20,
    padding: 12,
  },
  itemBody: {
    width: '100%',
    flexDirection: 'row',
    // justifyContent: "center",
    alignItems: 'flex-start',
  },
  itemBodyText: {
    width: '74.7%',
  },
  itemCategories: {
    flexDirection: 'row',
    gap: 4,
  },
  itemCategory: {
    backgroundColor: theming.colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  itemCategoryTitle: {
    color: theming.colors.white,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: theming.fonts.latoRegular,
  },
  itemDate: {
    flexDirection: 'row',
    gap: theming.spacing.SM,
    marginTop: 13,
  },
  itemDateTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 6,
  },
  itemSubtitle: {
    fontWeight: '400',
    fontSize: 14,
    color: theming.colors.gray700,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 6,
  },
  itemImage: {
    width: 80,
    height: 105,
    borderRadius: 6,
    overflow: 'hidden',
  },
  itemImg: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    resizeMode: 'cover',
  },
  itemSpot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theming.spacing.SM,
    marginTop: 10,
    marginBottom: 15,
  },
  itemSpotRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  itemSpotTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: theming.colors.gray700,
    fontFamily: theming.fonts.latoRegular,
  },
  itemSpotImages: {
    flexDirection: 'row',
    position: 'relative',
  },
  itemSpotImg: {
    width: 24,
    height: 24,
    borderRadius: 50,
    position: 'relative',
  },
  itemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  itemTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemTag: {
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  itemTagTitle: {
    color: theming.colors.purple,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: theming.fonts.latoRegular,
  },
  itemAnotherTag: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: theming.colors.gray75,
  },
  itemAnotherTagTitle: {
    color: theming.colors.darkGray,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: theming.fonts.latoRegular,
  },
  itemBtn: {
    backgroundColor: theming.colors.orange,
    paddingHorizontal: 12,
    paddingVertical: theming.spacing.SM,
    borderRadius: 100,
  },
  itemBtnTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: theming.colors.white,
    fontFamily: theming.fonts.latoRegular,
  },
});
