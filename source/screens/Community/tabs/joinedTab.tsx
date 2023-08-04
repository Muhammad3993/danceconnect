import React, {useCallback, useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import {useCommunities} from '../../../hooks/useCommunitites';
import CommunityCard from '../../../components/communityCard';
import {isAndroid} from '../../../utils/constants';
import colors from '../../../utils/colors';
import FiltersBottom from '../../../components/bottomFilters';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import useAppStateHook from '../../../hooks/useAppState';
import SkeletonCommunityCard from '../../../components/skeleton/communityCard-Skeleton';

type props = {
  communititesSearch: string[];
  searchValue: string;
};

const JoinTab = ({communititesSearch, searchValue}: props) => {
  const navigation = useNavigation();
  const {joinedCommunities, isLoading, getCommunitites} = useCommunities();
  const lengthEmptyCommunities = new Array(3).fill('');
  const {currentCity} = useAppStateHook();

  // console.log('joinedCommunities', joinedCommunities)
  const [communitites, setCommunitites] = useState(
    joinedCommunities
      ?.filter(i => i?.location?.toLowerCase() === currentCity.toLowerCase())
      .map(ev => ev),
  );
  const [openingFilters, setOpeningFilters] = useState(false);

  const [addedStyles, setAddedStyles] = useState<string[]>(
    new Array(0).fill(''),
  );

  // useEffect(() => {
  //   socket
  //     .emit('joined_update', currentCity)
  //     .on('updated_communities', communities => {
  //       console.log('joined_update', communities);
  //       setCommunitites(communities);
  //     });

  //   // socket.on('joined_update', communities => {
  //   //   console.log('joined_update', communities);
  //   // });
  // }, []);
  useEffect(() => {
    if (searchValue?.length > 0 && communititesSearch) {
      setCommunitites(communititesSearch);
    }
  }, [communititesSearch, searchValue]);
  useEffect(() => {
    setCommunitites(
      joinedCommunities
        ?.filter(i => i?.location?.toLowerCase() === currentCity.toLowerCase())
        .map(ev => ev),
    );
  }, [currentCity]);

  const onClear = () => {
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setAddedStyles([]);
    setCommunitites(
      joinedCommunities?.filter(
        i => i?.location?.toLowerCase() === currentCity.toLowerCase(),
      ),
    );
  };
  const onFilter = () => {
    if (addedStyles?.length > 0) {
      const data = joinedCommunities.filter(
        (item: any) =>
          item?.categories?.some((ai: any) => addedStyles.includes(ai)) &&
          item?.location?.toLowerCase() === currentCity.toLowerCase(),
      );
      setCommunitites(data);
    } else {
      setCommunitites(
        joinedCommunities?.filter(
          i => i?.location?.toLowerCase() === currentCity.toLowerCase(),
        ),
      );
    }
  };
  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyContainer}>
        {isLoading &&
          lengthEmptyCommunities.map(() => {
            return (
              <>
                <RN.View style={{marginVertical: 8}}>
                  <SkeletonCommunityCard />
                </RN.View>
              </>
            );
          })}
        {!isLoading && (
          <RN.Text style={styles.emptyText}>
            There are no communities yet
          </RN.Text>
        )}
      </RN.View>
    );
  };
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('state', () => {
        setCommunitites(joinedCommunities);
      });
      return unsubscribe;
    }, [joinedCommunities, navigation]),
  );

  const renderItemCommunity = useCallback((item: any) => {
    return <CommunityCard item={item} key={item.index + item.item.id} />;
  }, []);
  const renderFilters = () => {
    return (
      <RN.View style={styles.filterWrapper}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text style={styles.communititesLength}>{`${
            communitites?.length ?? 0
          } communities found`}</RN.Text>
        </RN.View>
        <RN.TouchableOpacity
          style={[
            styles.filterBtn,
            {
              borderColor:
                addedStyles?.length > 0 ? colors.orange : colors.gray,
            },
          ]}
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
    );
  };
  return (
    <>
      <RN.FlatList
        data={communitites}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderFilters()}
        renderItem={renderItemCommunity}
        keyExtractor={(item, _index) => `${item.item?.id}/${_index}`}
        ListEmptyComponent={renderEmpty()}
      />
      <FiltersBottom
        onOpening={openingFilters}
        onClose={() => setOpeningFilters(false)}
        selectedStyles={addedStyles}
        setSelectedStyles={setAddedStyles}
        onClear={onClear}
        onFilter={onFilter}
      />
    </>
  );
};

const styles = RN.StyleSheet.create({
  filterWrapper: {
    paddingVertical: 14,
    paddingHorizontal: isAndroid ? 0 : 20,
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
    borderWidth: 1,
  },
  filterText: {
    fontSize: 16,
    lineHeight: 22.4,
    color: colors.darkGray,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },

  emptyText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Mulish-Regular',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
export default JoinTab;
