import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as RN from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FiltersBottom from '../../../components/bottomFilters';
import CommunityCard from '../../../components/communityCard';
import EmptyContainer from '../../../components/emptyCommunitiesMain';
import {useCommunities} from '../../../hooks/useCommunitites';
import colors from '../../../utils/colors';
import Filters from '../../../components/filters';

type props = {
  communititesSearch: string[];
  searchValue: string;
  onPressTabAll: () => void;
};

const JoinTab = ({communititesSearch, searchValue, onPressTabAll}: props) => {
  const {t} = useTranslation();
  const {joinedCommunities, isLoading, getCommunitites} = useCommunities();

  const [openingFilters, setOpeningFilters] = useState(false);

  const [addedStyles, setAddedStyles] = useState<string[]>([]);

  const joined = useMemo(() => {
    if (searchValue?.length > 0) {
      return communititesSearch;
    }
    if (addedStyles?.length > 0) {
      return joinedCommunities.filter((item: any) =>
        item?.categories?.some((ai: any) => addedStyles.includes(ai)),
      );
    }

    return joinedCommunities;
  }, [addedStyles, communititesSearch, joinedCommunities, searchValue]);

  const onClear = () => {
    setAddedStyles([]);
  };

  const renderFilters = () => {
    return (
      <Filters
        onPressFilters={() => setOpeningFilters(true)}
        title={t('communities_found', {count: joined.length ?? 0})}
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
        {joined?.length > 0 && renderFilters()}
        {joined?.length > 0 &&
          joined?.map((item: any) => {
            return (
              <RN.View key={item?.id}>
                <CommunityCard item={item} />
              </RN.View>
            );
          })}
        {!joined?.length && <EmptyContainer onPressButton={onPressTabAll} />}
      </ScrollView>
      <FiltersBottom
        onOpening={openingFilters}
        onClose={() => setOpeningFilters(false)}
        selectedStyles={addedStyles}
        setSelectedStyles={setAddedStyles}
        onClear={onClear}
      />
    </>
  );
};

export default JoinTab;
