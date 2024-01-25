import React, {useCallback, useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCommunities} from '../../hooks/useCommunitites';
import Search from '../../components/search';
import ManagingTab from './tabs/managingTab';
import JoinTab from './tabs/joinedTab';
import AllTab from './tabs/allTab';
import useAppStateHook from '../../hooks/useAppState';
import {Portal} from 'react-native-portalize';
import FindCity from '../../components/findCity copy';
import {SCREEN_WIDTH, isAndroid} from '../../utils/constants';
import {useTranslation} from 'react-i18next';
import i18n from '../../i18n/i118n';
import { FlatList } from 'react-native-gesture-handler';

const CommunitiesScreen = () => {
  const {
    communitiesData,
    managingCommunity,
    joinedCommunities,
    getCommunitites,
    isLoading,
    isLoadingWithFollow,
  } = useCommunities();
  const {t} = useTranslation();
  const TABS = [t('all_tab'), t('joined'), t('managing')];
  const routeProps = useRoute();
  const navigation = useNavigation();
  const [searchValue, onSearch] = useState('');
  const [tabs, setTabs] = useState(TABS);
  const [currentTab, setCurrentTab] = useState(tabs[0]);
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
      setTabs([i18n.t('all_tab'), i18n.t('joined'), i18n.t('managing')]);
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
    const renderTab = ({item, index}: any) => {
      return (
        <RN.TouchableOpacity
          onPress={() => onPressTab(item)}
          key={index}
          style={[
            styles.itemTabContainer,
            {
              borderBottomWidth: currentTab === item ? 3 : 0,
              paddingHorizontal: 16,
              paddingBottom: 8,
            },
          ]}>
          <RN.Text
            style={[
              styles.itemTabText,
              {color: currentTab === item ? colors.purple : colors.darkGray},
            ]}>
            {item}
          </RN.Text>
        </RN.TouchableOpacity>
      );
    };
    return (
      <>
        <RN.View
          style={{
            paddingHorizontal: isAndroid ? 0 : 20,
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
            onPressAdd={() => navigation.navigate('CreateCommunity')}
          />
          <RN.View style={styles.tabsWrapper}>
            <FlatList
              // scrollEnabled={false}
              data={tabs}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderTab}
              horizontal
            />
          </RN.View>
        </RN.View>
      </>
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
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    zIndex: 1,
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
  tabsWrapper: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    // paddingTop: 0,
  },
  itemTabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.purple,
    alignSelf: 'center',
    // paddingHorizontal: SCREEN_WIDTH / 24,
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
