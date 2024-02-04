import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as RN from 'react-native';
import {Portal} from 'react-native-portalize';
import FindCity from '../../components/findCity copy';
import Search from '../../components/search';
import {Tab} from '../../components/tab';
import useAppStateHook from '../../hooks/useAppState';
import {useCommunities} from '../../hooks/useCommunitites';
import i18n from '../../i18n/i118n';
import colors from '../../utils/colors';
import {isAndroid} from '../../utils/constants';
import AllTab from './tabs/allTab';
import JoinTab from './tabs/joinedTab';
import ManagingTab from './tabs/managingTab';

const CommunitiesScreen = ({navigation}) => {
  const {
    communitiesData,
    managingCommunity,
    joinedCommunities,
    getCommunitites,
    isLoading,
    isLoadingWithFollow,
  } = useCommunities();
  const {t} = useTranslation();
  const TABS = [
    {text: t('all_tab')},
    {text: t('joined')},
    {text: t('managing')},
  ];
  const routeProps = useRoute();
  const [searchValue, onSearch] = useState('');
  const [tabs, setTabs] = useState(TABS);
  const [currentTab, setCurrentTab] = useState(tabs[0].text);
  const [communititesSearch, setCommunitiesSearch] = useState<string[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const {currentCity, onChoosedCity} = useAppStateHook();

  const removedCommunity = routeProps.params?.removedCommunity ?? null;

  const onPressTab = (value: string) => {
    if (searchValue?.length) {
      RN.Keyboard.dismiss();
      setCommunitiesSearch([]);
      onSearch('');
    }
    setCurrentTab(value);
  };
  useEffect(() => {
    i18n.on('languageChanged', lg => {
      setTabs([
        {text: i18n.t('all_tab')},
        {text: i18n.t('joined')},
        {text: i18n.t('managing')},
      ]);
      onPressTab(t('all_tab'));
    });
  }, [t]);

  useEffect(() => {
    getCommunitites();
  }, [currentCity]);

  useMemo(() => {
    if (removedCommunity) {
      onPressTab(t('managing'));
    }
  }, [removedCommunity]);

  const onRefSearch = () => {
    onPressTab(t('all_tab'));
  };

  const onChangeTextSearch = useCallback(
    (value: string) => {
      onSearch(value);
      if (currentTab === t('all_tab')) {
        const search = communitiesData.filter(
          (item: {categories: string[]; title: string}) => {
            const itemData = `${item.categories?.map((m: string) =>
              m.toLowerCase(),
            )} ${item?.title?.toLowerCase()}`;
            const textData = value?.toLowerCase();
            return itemData.indexOf(textData) > -1;
          },
        );
        setCommunitiesSearch(search);
        if (!value?.length) {
          setCommunitiesSearch(communitiesData);
        }
      }
      if (currentTab === t('joined')) {
        const searchJoin = joinedCommunities.filter(
          (item: {categories: string[]; title: string}) => {
            const itemData = `${item.categories?.map((m: string) =>
              m.toLowerCase(),
            )} ${item?.title?.toLowerCase()}`;
            const textData = value?.toLowerCase();
            return itemData.indexOf(textData) > -1;
          },
        );
        setCommunitiesSearch(searchJoin);
        if (!value?.length) {
          setCommunitiesSearch(joinedCommunities);
        }
      }
      if (currentTab === t('managing')) {
        const searchManaging = managingCommunity.filter(
          (item: {categories: string[]; title: string}) => {
            const itemData = `${item.categories?.map((m: string) =>
              m.toLowerCase(),
            )} ${item?.title?.toLowerCase()}`;
            const textData = value?.toLowerCase();
            return itemData.indexOf(textData) > -1;
          },
        );
        setCommunitiesSearch(searchManaging);
        if (!value?.length) {
          setCommunitiesSearch(managingCommunity);
        }
      }
    },
    [communitiesData, currentTab, joinedCommunities, managingCommunity],
  );

  const renderHeader = () => {
    return (
      <RN.View
        style={{
          marginTop: isAndroid ? 14 : 0,
        }}>
        <RN.TouchableOpacity
          style={styles.userLocationWrapper}
          onPress={() => setOpenModal(true)}>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image
              source={{uri: 'locate'}}
              style={{height: 16, width: 16}}
            />
          </RN.View>
          <RN.Text style={styles.userLocationText}>{currentCity}</RN.Text>
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Image
              source={{uri: 'downlight'}}
              style={{height: 16, width: 16, marginLeft: 6}}
            />
          </RN.View>
        </RN.TouchableOpacity>
        <Search
          onFocus={onRefSearch}
          onSearch={onChangeTextSearch}
          searchValue={searchValue}
          placeholder={t('input_search_communities')}
          onPressAdd={() => navigation.push('CreateCommunity')}
        />
        <Tab
          data={tabs}
          currentTab={currentTab}
          onPressTab={onPressTab}
          textStyle={styles.itemTabText}
        />
      </RN.View>
    );
  };

  const renderWrapper = useCallback(() => {
    switch (currentTab) {
      case t('all_tab'):
        return (
          <AllTab
            searchValue={searchValue}
            communititesSearch={communititesSearch}
          />
        );

      case t('joined'):
        return (
          <JoinTab
            searchValue={searchValue}
            onPressTabAll={onRefSearch}
            communititesSearch={communititesSearch}
          />
        );

      case t('managing'):
        return (
          <ManagingTab
            searchValue={searchValue}
            communititesSearch={communititesSearch}
          />
        );

      default:
        return (
          <AllTab
            searchValue={searchValue}
            communititesSearch={communititesSearch}
          />
        );
    }
  }, [currentTab, communititesSearch, searchValue]);

  const onPressChange = () => {
    setOpenModal(false);
  };
  return (
    <RN.SafeAreaView style={styles.container}>
      <RN.View style={styles.root}>
        {renderHeader()}
        {renderWrapper()}
        {openModal && (
          <Portal>
            <FindCity
              selectedLocation={currentCity}
              setSelectedLocation={onChoosedCity}
              isTabScreen
              onClosed={onPressChange}
              setCurrentCountry={() => console.log('setCurrentCountry')}
              communityScreen
            />
          </Portal>
        )}
      </RN.View>
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  root: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
  },
  userLocationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    backgroundColor: '#FBFBFB',
    padding: 8,
    borderRadius: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#CDCDCD',
  },
  userLocationText: {
    paddingLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  loadingContainer: {
    position: 'absolute',
    zIndex: 2,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  itemTabText: {
    fontSize: 16,
    lineHeight: 25.2,
    letterSpacing: 0.2,
    paddingHorizontal: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CommunitiesScreen;
