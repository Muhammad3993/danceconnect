import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as RN from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FiltersBottom from '../../../components/bottomFilters';
import CommunityCard from '../../../components/communityCard';
import CreateCommunityButton from '../../../components/createCommunityBtn';
import {useCommunities} from '../../../hooks/useCommunitites';
import colors from '../../../utils/colors';
import Filters from '../../../components/filters';

type props = {
  communititesSearch: string[];
  searchValue: string;
};

const ManagingTab = ({communititesSearch, searchValue}: props) => {
  const {t} = useTranslation();
  const {managingCommunity, getManagingCommunities, isLoadManaging} =
    useCommunities();

  const [openingFilters, setOpeningFilters] = useState(false);

  const [addedStyles, setAddedStyles] = useState<string[]>([]);

  const managaing = useMemo(() => {
    if (searchValue?.length > 0) {
      return communititesSearch;
    }
    if (addedStyles?.length > 0) {
      return managingCommunity.filter((item: any) =>
        item?.categories?.some((ai: any) => addedStyles.includes(ai)),
      );
    }

    return managingCommunity;
  }, [addedStyles, communititesSearch, managingCommunity, searchValue?.length]);

  const renderItemCommunity = useCallback((item: any) => {
    if (!item?.id) {
      return null;
    }
    return <CommunityCard item={item} key={item?.id} />;
  }, []);

  const onClear = () => {
    setAddedStyles([]);
  };

  const renderFilters = () => {
    return (
      <Filters
        onPressFilters={() => setOpeningFilters(true)}
        title={t('communities_found', {count: managaing.length ?? 0})}
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
          getManagingCommunities();
        }}
        refreshing={isLoadManaging}
      />
    );
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl()}>
        {managaing?.length > 0 && renderFilters()}
        {managaing?.map((item: any) => {
          return <RN.View>{renderItemCommunity(item)}</RN.View>;
        })}
        {!managaing?.length && (
          <RN.View style={styles.emptyContainer}>
            <CreateCommunityButton />
          </RN.View>
        )}
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

const styles = RN.StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
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
export default ManagingTab;
