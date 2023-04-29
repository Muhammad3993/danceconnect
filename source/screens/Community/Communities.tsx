import React, {useCallback, useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import {useCommunities} from '../../hooks/useCommunitites';
import CreateCommunityButton from '../../components/createCommunityBtn';
import Search from '../../components/search';
import useRegistration from '../../hooks/useRegistration';
import {useProfile} from '../../hooks/useProfile';
import BottomSheet from '../../components/bottomSheet';
import CommunityCard from '../../components/communityCard';

const TABS = ['All', 'Joined', 'Managing'];
Array.prototype.diff = function (a: string | any[]) {
  return this.filter(function (i) {
    return a.indexOf(i) >= 0;
  });
};
const CommunitiesScreen = () => {
  const {
    communitiesData,
    getCommunitites,
    isLoading,
    isLoadingWithFollow,
    joinedCommunities,
  } = useCommunities();
  const {userUid} = useRegistration();
  const navigation = useNavigation();
  const [searchValue, onSearch] = useState('');
  const [currentTab, setCurrentTab] = useState(TABS[0]);
  const [displayedData, setDisplayedData] = useState<string[]>([]);
  const [openingFilters, setOpeningFilters] = useState(false);
  const [communitiesCountValue, setCommunitiesCountValue] = useState(0);
  const [addedStyles, setAddedStyles] = useState<string[]>(
    new Array(0).fill(''),
  );
  const managingCommunity = useMemo(
    () => communitiesData?.filter((item: any) => item?.creatorUid === userUid),
    [communitiesData, userUid],
  );
  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   getCommunitites();
  //   setRefreshing(false);
  // }, [getCommunitites]);

  useEffect(() => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    // getCommunitites();
    setCommunitiesCountValue(communitiesData?.length ?? 0);
    onPressTab('All');
  }, [communitiesData?.length]);

  const onClear = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setAddedStyles([]);
    setDisplayedData(communitiesData);
  };

  const onChangeTextSearch = (value: string) => {
    const search = communitiesData.filter((item: any) => {
      const itemData = `${item.categories?.map(m =>
        m.toLowerCase(),
      )} ${item?.name?.toLowerCase()}`;
      const textData = value.toLowerCase();
      console.log(itemData, textData);
      return itemData.indexOf(textData) > -1;
    });
    setDisplayedData(search);
    setCommunitiesCountValue(displayedData?.length ?? 0);
    onSearch(value);
  };
  const onFilter = () => {
    const data = communitiesData.filter((item: any) => {
      const itemData = `${item.categories?.map(m => m)}`;
      const textData = addedStyles?.map(it => it.toString());
      return itemData.indexOf(textData) > -1;
    });
    if (!searchValue?.length) {
      setDisplayedData(data);
      setCommunitiesCountValue(displayedData?.length ?? 0);
    }
  };

  const onPressTab = useCallback(
    (value: string) => {
      RN.LayoutAnimation.configureNext(
        RN.LayoutAnimation.Presets.easeInEaseOut,
      );
      setCurrentTab(value);
      // getCommunitites();
      switch (value) {
        case 'All':
          getCommunitites();
          return setDisplayedData(communitiesData);
        case 'Joined':
          getCommunitites();
          return setDisplayedData(joinedCommunities);
        case 'Managing':
          getCommunitites();
          return setDisplayedData(managingCommunity);
        default:
          return communitiesData;
      }
    },
    [communitiesData, getCommunitites, joinedCommunities, managingCommunity],
  );

  useMemo(() => {
    setCommunitiesCountValue(displayedData?.length ?? 0);
  }, [displayedData.length]);

  const renderItemCommunity = (item: any) => {
    return <CommunityCard item={item} key={item.index} />;
  };

  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyContainer}>
        <RN.Text style={styles.emptyText}>There is no community yet</RN.Text>
        {communitiesData?.length <= 0 && (
          <CreateCommunityButton
            onPress={() => navigation.navigate('CreateCommunity')}
          />
        )}
      </RN.View>
    );
  };

  const renderLoading = () => {
    return (
      <RN.View style={styles.loadingContainer}>
        <RN.ActivityIndicator size={'large'} color={colors.orange} />
      </RN.View>
    );
  };

  // if (isLoading && !isLoadingWithFollow) {
  //   return renderLoading();
  // }
  const renderHeader = () => {
    return (
      <>
        <Search
          onSearch={onChangeTextSearch}
          searchValue={searchValue}
          placeholder="Community name, dance style"
          onPressAdd={() => navigation.navigate('CreateCommunity')}
        />
        <RN.View style={styles.tabsWrapper}>
          {TABS.map((item: string, index: number) => {
            return (
              <RN.TouchableOpacity
                onPress={() => onPressTab(item)}
                key={index}
                style={[
                  styles.itemTabContainer,
                  {
                    borderBottomWidth: currentTab === item ? 3 : 0,
                    marginBottom: -1,
                    paddingHorizontal: 16,
                    paddingBottom: 8,
                  },
                ]}>
                <RN.Text
                  style={[
                    styles.itemTabText,
                    {
                      color:
                        currentTab === item ? colors.purple : colors.darkGray,
                    },
                  ]}>
                  {item}
                </RN.Text>
              </RN.TouchableOpacity>
            );
          })}
        </RN.View>
        {currentTab !== 'All' && <RN.View style={{marginBottom: 14}} />}
        {currentTab === 'All' && (
          <RN.View style={styles.filterWrapper}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text
                style={
                  styles.communititesLength
                }>{`${communitiesCountValue} communities found`}</RN.Text>
            </RN.View>
            <RN.TouchableOpacity
              style={styles.filterBtn}
              onPress={() => setOpeningFilters(true)}>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'filter'}}
                  style={{height: 16, width: 16, marginRight: 8}}
                />
              </RN.View>
              <RN.Text style={styles.filterText}>Filters</RN.Text>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'downlight'}}
                  style={{height: 16, width: 16, marginLeft: 4, marginTop: 4}}
                />
              </RN.View>
            </RN.TouchableOpacity>
          </RN.View>
        )}
      </>
    );
  };

  return (
    <RN.View style={styles.container}>
      {renderHeader()}
      {isLoading && !isLoadingWithFollow && renderLoading()}
      <RN.FlatList
        data={displayedData}
        showsVerticalScrollIndicator={false}
        // onRefresh={onRefresh}
        // refreshing={refreshing}
        // ListHeaderComponent={renderHeader()}
        refreshControl={renderLoading()}
        renderItem={(item: any) => renderItemCommunity(item)}
        keyExtractor={(item, _index) => `${item}${_index}`}
        ListEmptyComponent={renderEmpty()}
      />
      {openingFilters && (
        <BottomSheet
          onClose={() => setOpeningFilters(false)}
          selectedStyles={addedStyles}
          setSelectedStyles={setAddedStyles}
          onClear={onClear}
          onFilter={onFilter}
        />
      )}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // paddingTop: 40,
    paddingHorizontal: 12,
    zIndex: 1,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 2,
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Mulish-Regular',
    textAlign: 'center',
    paddingVertical: 16,
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
  itemContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  headerItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 18,
    lineHeight: 25.2,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingVertical: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tagsItem: {
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    marginRight: 4,
    color: colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14.4,
    borderRadius: 4,
  },
  itemDesc: {
    fontSize: 14,
    lineHeight: 19.6,
    color: '#616161',
    fontWeight: '400',
    marginBottom: 8,
  },
  itemImg: {
    height: 105,
    width: 80,
    borderRadius: 6,
    marginBottom: 10,
  },
  footerItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  itemTabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.purple,
    alignSelf: 'center',
  },
  itemTabText: {
    fontSize: 16,
    lineHeight: 25.2,
    // letterSpacing: 0.2,
    paddingHorizontal: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  filterWrapper: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  communititesLength: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '600',
  },
  filterBtn: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 100,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterText: {
    fontSize: 16,
    lineHeight: 22.4,
    color: colors.darkGray,
    fontWeight: '500',
  },
  addedDanceStyleItem: {
    borderWidth: 1,
    borderColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    marginRight: 4,
    marginBottom: 8,
  },
  addedDanceStyleText: {
    color: colors.orange,
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 19.6,
    marginRight: 6,
    fontWeight: '600',
  },
  danceStyleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
});

export default CommunitiesScreen;
