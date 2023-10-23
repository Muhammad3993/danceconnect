import React, {useCallback, useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCommunities} from '../../hooks/useCommunitites';
import {useProfile} from '../../hooks/useProfile';
import Search from '../../components/search';
import ManagingTab from './tabs/managingTab';
import JoinTab from './tabs/joinedTab';
import AllTab from './tabs/allTab';
import useAppStateHook from '../../hooks/useAppState';
import CitySelector from '../../components/citySelector';
import {Portal} from 'react-native-portalize';
import FindCity from '../../components/findCity';
import socket from '../../api/sockets';
import {SCREEN_WIDTH, isAndroid} from '../../utils/constants';

const TABS = ['All', 'Joined', 'Managing'];

const CommunitiesScreen = () => {
  const {
    communitiesData,
    managingCommunity,
    joinedCommunities,
    getCommunitites,
    isLoading,
    isLoadingWithFollow,
  } = useCommunities();
  const routeProps = useRoute();
  const navigation = useNavigation();
  const [searchValue, onSearch] = useState('');
  const [currentTab, setCurrentTab] = useState(TABS[0]);
  const [communititesSearch, setCommunitiesSearch] = useState<string[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const {currentCity, onChoosedCity} = useAppStateHook();

  const removedCommunity = routeProps.params?.removedCommunity ?? null;

  const onPressTab = (value: string) => {
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    if (searchValue?.length) {
      RN.Keyboard.dismiss();
      setCommunitiesSearch([]);
      onSearch('');
    }
    setCurrentTab(value);
  };
  useEffect(() => {
    getCommunitites();
  }, [currentCity]);
  // useEffect(() => {
  //   socket
  //     // .emit('joined_update', currentCity)
  //     .on('updated_communities', communities => {
  //       console.log('joined_update', communities);
  //       setUpdatedCommunities(communities);
  //     });

  //   // socket.on('joined_update', communities => {
  //   //   console.log('joined_update', communities);
  //   // });
  // }, []);
  // console.log('removedCommunity', removedCommunity, routeProps);
  useMemo(() => {
    if (removedCommunity) {
      onPressTab('Managing');
      // getCommunitites();
    }
  }, [removedCommunity]);

  const onRefSearch = () => {
    onPressTab('All');
  };

  const onChangeTextSearch = useCallback(
    (value: string) => {
      onSearch(value);
      if (currentTab === 'All') {
        const search = communitiesData.filter((item: any) => {
          const itemData = `${item.categories?.map((m: any) =>
            m.toLowerCase(),
          )} ${item?.name?.toLowerCase()}`;
          const textData = value?.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
        setCommunitiesSearch(search);
        if (!value?.length) {
          setCommunitiesSearch(communitiesData);
        }
      }
      if (currentTab === 'Joined') {
        const searchJoin = joinedCommunities.filter((item: any) => {
          const itemData = `${item.categories?.map((m: any) =>
            m.toLowerCase(),
          )} ${item?.name?.toLowerCase()}`;
          const textData = value?.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
        setCommunitiesSearch(searchJoin);
        if (!value?.length) {
          setCommunitiesSearch(joinedCommunities);
        }
      }
      if (currentTab === 'Managing') {
        const searchManaging = managingCommunity.filter((item: any) => {
          const itemData = `${item.categories?.map((m: any) =>
            m.toLowerCase(),
          )} ${item?.name?.toLowerCase()}`;
          const textData = value?.toLowerCase();
          return itemData.indexOf(textData) > -1;
        });
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
              // paddingHorizontal: 24,
              paddingBottom: 8,
            },
          ]}>
          <RN.Text
            style={[
              styles.itemTabText,
              {
                color: currentTab === item ? colors.purple : colors.darkGray,
              },
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
            placeholder="Community name, dance style"
            onPressAdd={() => navigation.navigate('CreateCommunity')}
          />
          <RN.View style={styles.tabsWrapper}>
            <RN.FlatList
              scrollEnabled={false}
              data={TABS}
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
      case 'All':
        return (
          <AllTab
            searchValue={searchValue}
            communititesSearch={communititesSearch}
          />
        );

      case 'Joined':
        return (
          <JoinTab
            searchValue={searchValue}
            onPressTabAll={onRefSearch}
            communititesSearch={communititesSearch}
          />
        );

      case 'Managing':
        return (
          <ManagingTab
            searchValue={searchValue}
            communititesSearch={communititesSearch}
            removedCommunity={removedCommunity}
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
  }, [currentTab, communititesSearch, searchValue, removedCommunity]);

  const onPressChange = () => {
    setOpenModal(false);
  };
  return (
    <RN.SafeAreaView style={styles.container}>
      {renderHeader()}
      {/* {isLoading && !isLoadingWithFollow && renderLoading()} */}
      {renderWrapper()}
      {openModal && (
        <Portal>
          <FindCity
            selectedLocation={currentCity}
            setSelectedLocation={onChoosedCity}
            onClosed={onPressChange}
            communityScreen
          />
        </Portal>
      )}
      {/* <CitySelector
        opening={openModal}
        onClose={() => setOpenModal(false)}
        onChoosedCity={onChoosedCity}
      /> */}
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
  name: {
    fontSize: 24,
    lineHeight: 28.8,
    fontWeight: '700',
    fontFamily: 'Mulish-Regular',
    color: colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    paddingTop: 0,
  },
  itemTabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.purple,
    alignSelf: 'center',
    paddingHorizontal: SCREEN_WIDTH / 24,
  },
  itemTabText: {
    fontSize: 16,
    lineHeight: 25.2,
    // letterSpacing: 0.2,
    paddingHorizontal: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CommunitiesScreen;
