import React, {useEffect, useMemo, useState} from 'react';
import * as RN from 'react-native';
import {useCommunities} from '../../../hooks/useCommunitites';
import CommunityCard from '../../../components/communityCard';

import colors from '../../../utils/colors';
import FiltersBottom from '../../../components/bottomFilters';
import useAppStateHook from '../../../hooks/useAppState';
import SkeletonCommunityCard from '../../../components/skeleton/communityCard-Skeleton';
import {ScrollView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import Filters from '../../../components/filters';
import sortBy from 'lodash.sortby';

type props = {
  communititesSearch: string[];
  searchValue: string;
};

const AllTab = ({communititesSearch, searchValue}: props) => {
  const {communitiesData, isLoading, getCommunitites} = useCommunities();
  const {currentCity} = useAppStateHook();
  const {t} = useTranslation();

  const lengthEmptyCommunities = new Array(3).fill('');
  const [communitites, setCommunitites] = useState(communitiesData);

  const [openingFilters, setOpeningFilters] = useState(false);

  const [addedStyles, setAddedStyles] = useState<string[]>(
    new Array(0).fill(''),
  );
  useMemo(() => {
    setCommunitites(communitiesData);
  }, [isLoading]);

  useEffect(() => {
    if (searchValue?.length > 0 && communititesSearch) {
      setCommunitites(communititesSearch);
    }
    if (searchValue.length <= 0) {
      setCommunitites(communitiesData);
    }
  }, [communititesSearch, searchValue]);
  // useEffect(() => {
  //   setCommunitites(
  //     communitiesData
  //       ?.filter(i => i?.location?.toLowerCase() === currentCity.toLowerCase())
  //       .map(ev => ev),
  //   );
  // }, [currentCity]);
  // useEffect(() => {
  //   setCommunitites(
  //     communitiesData
  //       ?.filter(i => i?.location?.toLowerCase() === currentCity.toLowerCase())
  //       .map(ev => ev),
  //   );
  // }, [communitiesData.length]);
  const onClear = () => {
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setAddedStyles([]);
    setCommunitites(communitiesData);
  };

  const onFilter = () => {
    if (addedStyles?.length > 0) {
      const data = communitiesData.filter(
        (item: any) =>
          item?.categories?.some((ai: any) => addedStyles.includes(ai)) &&
          item?.location?.toLowerCase() === currentCity.toLowerCase(),
      );
      setCommunitites(data);
    } else {
      setCommunitites(communitiesData);
    }
    // RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
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
          <RN.Text style={styles.emptyText}>{t('non_communities')}</RN.Text>
        )}
      </RN.View>
    );
  };

  const renderItemCommunity = (item: any) => {
    return <CommunityCard item={item} key={item.id} />;
  };
  const renderFilters = () => {
    return (
      <Filters
        onPressFilters={() => setOpeningFilters(true)}
        title={t('communities_found', {count: communitites.length ?? 0})}
        filtersBorderColor={
          addedStyles?.length > 0 ? colors.orange : colors.gray
        }
      />
    );
  };
  const refreshControl = () => {
    return (
      <RN.RefreshControl
        onRefresh={() => {
          onClear();
          getCommunitites();
        }}
        refreshing={isLoading}
      />
    );
  };
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl()}>
        {renderFilters()}
        {communitites?.length > 0 &&
          sortBy(communitites)?.map((item: any) => {
            return (
              <RN.View
                style={{
                  minHeight: communitites.length > 1 ? 200 : 260,
                }}>
                {renderItemCommunity(item)}
              </RN.View>
            );
            // return <RN.View>{renderItemCommunity(item)}</RN.View>;
          })}
        {!communitites?.length && renderEmpty()}
      </ScrollView>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
export default AllTab;
