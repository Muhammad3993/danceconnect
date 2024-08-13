import {
  ActivityIndicator,
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
import { DCTabs } from 'components/shared/tabs';
import { TabScreenProps } from 'screens/interfaces';
import { JoinCommunityCard } from 'components/shared/join_community_card';

export function HomeScreen({ navigation }: TabScreenProps<'home'>) {
  const { t } = useTranslation();
  const TABS = [
    { text: t('all_tab'), containerStyle: { flex: 0.7 } },
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.homeTop}>
            <Text style={styles.homeTitle}>{t("interested")}</Text>
            <DCRoundIcon
              icon={<RightArrowIcon />}
              iconBoxStyle={{
                width: 28,
                height: 28,
                backgroundColor: theming.colors.lightPurple,
              }}
            />
          </View>

          <ScrollView
            style={{ paddingHorizontal: theming.spacing.LG }}
            horizontal
            showsHorizontalScrollIndicator={false}>
            <HomeItem />
            <HomeItem />
          </ScrollView>

          <View style={{ paddingHorizontal: theming.spacing.LG }}>
            <StartCommunity
              onPress={() => navigation.push('createCommunity')}
            />
          </View>

          <Text style={styles.homeEventsTitle}>{t('your_upcoming')}</Text>

          <DCTabs
            containerStyle={styles.infoHeader}
            textStyle={styles.tabText}
            itemStyle={{ alignItems: 'center' }}
            scrollEnabled={false}
            data={TABS}
            currentTab={currentTab}
            onPressTab={setCurrentTab}
          />

          <View style={{ paddingHorizontal: theming.spacing.LG }}>
            <JoinCommunityCard
              containerStyle={{ marginTop: theming.spacing.LG }}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  homeTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: theming.spacing.LG,
  },
  homeTitle: {
    width: "77%",
    fontSize: 24,
    fontWeight: '700',
    color: theming.colors.textPrimary,
  },
  homeEventsTitle: {
    color: theming.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    marginTop: 30,
    paddingHorizontal: theming.spacing.LG,
  },
  infoHeader: {
    backgroundColor: theming.colors.white,
    marginTop: 15,
    paddingHorizontal: theming.spacing.LG,
  },
  tabText: {
    lineHeight: 22,
    textTransform: 'capitalize',
  },
});
