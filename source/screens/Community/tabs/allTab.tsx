import React, {useCallback, useEffect, useState} from 'react';
import * as RN from 'react-native';
import {useCommunities} from '../../../hooks/useCommunitites';
import CommunityCard from '../../../components/communityCard';
import {isAndroid} from '../../../utils/constants';
import colors from '../../../utils/colors';
import FiltersBottom from '../../../components/bottomFilters';
import {useProfile} from '../../../hooks/useProfile';

type props = {
  communititesSearch: string[];
  searchValue: string;
};

const AllTab = ({communititesSearch, searchValue}: props) => {
  const {communitiesData} = useCommunities();
  const {userCountry} = useProfile();

  const [communitites, setCommunitites] = useState(
    communitiesData?.filter(i =>
      i?.location?.toLowerCase().includes(userCountry.toLowerCase()),
    ),
  );
  const [openingFilters, setOpeningFilters] = useState(false);
  const [communityLocation, setCommunityLocation] = useState(userCountry);

  const [addedStyles, setAddedStyles] = useState<string[]>(
    new Array(0).fill(''),
  );

  useEffect(() => {
    if (searchValue?.length > 0 && communititesSearch) {
      setCommunitites(communititesSearch);
    }
  }, [communititesSearch, searchValue]);

  const onClear = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setAddedStyles([]);
    setCommunitites(
      communitiesData?.filter(i =>
        i?.location?.toLowerCase().includes(userCountry.toLowerCase()),
      ),
    );
  };
  const onFilter = () => {
    if (addedStyles?.length > 0) {
      const data = communitiesData.filter((item: any) =>
        item?.categories?.some((ai: any) => addedStyles.includes(ai)),
      );
      setCommunitites(data);
    } else if (communityLocation?.length > 0) {
      setCommunitites(
        communitiesData?.filter(i =>
          i?.location?.toLowerCase().includes(communityLocation.toLowerCase()),
        ),
      );
    } else {
      setCommunitites(
        communitiesData?.filter(i =>
          i?.location?.toLowerCase().includes(userCountry.toLowerCase()),
        ),
      );
    }
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  };
  const renderEmpty = () => {
    return (
      <RN.View style={styles.emptyContainer}>
        <RN.Text style={styles.emptyText}>There is no community yet</RN.Text>
      </RN.View>
    );
  };

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
        setCommunityLocation={setCommunityLocation}
        communityLocation={communityLocation}
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
export default AllTab;
