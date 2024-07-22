import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { theming } from 'common/constants/theming';
import { DCRoundIcon } from 'components/shared/round_icon';
import { RightArrowIcon } from 'components/icons/rightArrow';
import { HomeItem } from 'components/shared/home_item';
import { StartCommunity } from 'components/shared/start_community';
import { useTranslation } from 'react-i18next';
import { JoinCommunity } from 'components/shared/join_community';
import { DCTabs } from 'components/shared/tabs';

export function HomeScreen() {
  const { t } = useTranslation();
  const TABS = [
    { text: t('all'), containerStyle: { flex: 0.7 } },
    { text: t('festival'), containerStyle: { flex: 1 } },
    {
      text: t('competitions'),
      containerStyle: { flex: 1.6 },
    },
    {
      text: t('class'),
      containerStyle: { flex: 0.8 },
    },
    {
      text: t('party'),
      containerStyle: { flex: 0.8, borderBottomWidth: 3 },
    },
  ];
  const [currentTab, setCurrentTab] = useState(TABS[0].text);

  return (
    <View style={styles.root}>
      {false ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlatList
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          ListHeaderComponent={
            <>
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

              <Text style={styles.homeEventsTitle}>Your upcoming events</Text>

              <View style={styles.infoHeader}>
                <DCTabs
                  textStyle={styles.tabText}
                  itemStyle={{ alignItems: 'center' }}
                  scrollEnabled={false}
                  data={TABS}
                  currentTab={currentTab}
                  onPressTab={setCurrentTab}
                />
              </View>
            </>
          }
          renderItem={() => null}
          ListEmptyComponent={<JoinCommunity />}
          ListFooterComponent={
            false ? <ActivityIndicator size={'large'} /> : undefined
          }
          keyExtractor={(item, index) =>
            item?.postId ?? item?.id ?? index.toString()
          }
          scrollEventThrottle={500}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
    paddingHorizontal: theming.spacing.LG,
  },
  homeTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  homeTitle: {
    fontSize: theming.spacing.LG,
    fontWeight: '700',
    color: theming.colors.textPrimary,
  },
  homeEventsTitle: {
    color: theming.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    marginTop: 30,
  },
  infoHeader: {
    backgroundColor: theming.colors.white,
    marginTop: 15
  },
  tabText: {
    lineHeight: 22,
    textTransform: "capitalize"
  },
});
