import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as RN from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FiltersBottom from '../../../components/bottomFilters';
import CommunityCard from '../../../components/communityCard';
import EmptyContainer from '../../../components/emptyCommunitiesMain';
import {useCommunities} from '../../../hooks/useCommunitites';
import colors from '../../../utils/colors';
import {isAndroid} from '../../../utils/constants';

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
      console.log(addedStyles?.length);

      return joinedCommunities.filter((item: any) =>
        item?.categories?.some((ai: any) => addedStyles.includes(ai)),
      );
    }

    return joinedCommunities;
  }, [addedStyles, communititesSearch, joinedCommunities, searchValue]);

  const onClear = () => {
    setAddedStyles([]);
  };

  const renderItemCommunity = useCallback((item: any) => {
    return <CommunityCard item={item} key={item?.id} />;
  }, []);
  const renderFilters = () => {
    return (
      <RN.View style={styles.filterWrapper}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text style={styles.communititesLength}>
            {t('communities_found', {count: joined.length ?? 0})}
          </RN.Text>
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
          <RN.Text style={styles.filterText}>{t('filters')}</RN.Text>
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
            return <RN.View>{renderItemCommunity(item)}</RN.View>;
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

const styles = RN.StyleSheet.create({
  filterWrapper: {
    paddingVertical: 14,
    paddingHorizontal: isAndroid ? 4 : 20,
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
