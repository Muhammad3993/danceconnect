import React, {useCallback, useEffect} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import CommunityCard from '../../components/communityCard';
import {useNavigation} from '@react-navigation/native';
import {useCommunities} from '../../hooks/useCommunitites';
import SkeletonCommunityCard from '../../components/skeleton/communityCard-Skeleton';
import {isAndroid} from '../../utils/constants';
import {ScrollView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';

const ManagingCommunities = () => {
  const {managingCommunity, getManagingCommunities, isLoadManaging} =
    useCommunities();
  const {t} = useTranslation();
  const lengthEmptyEvents = new Array(3).fill('');
  const navigation = useNavigation();
  useEffect(() => {
    getManagingCommunities();
  }, []);

  const header = () => {
    return (
      <RN.TouchableOpacity
        style={styles.headerWrapper}
        onPress={() => navigation.goBack()}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.View>
        <RN.Text style={styles.headerText}>
          {t('manage_communities_title')}
        </RN.Text>
      </RN.TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    return (
      <RN.View style={styles.emptyContainer}>
        {isLoadManaging &&
          lengthEmptyEvents.map(() => {
            return (
              <>
                <RN.View style={{marginVertical: 8}}>
                  <SkeletonCommunityCard />
                </RN.View>
              </>
            );
          })}
        {!isLoadManaging && (
          <RN.Text style={styles.emptyText}>
            {t('no_manage_communities')}
          </RN.Text>
        )}
      </RN.View>
    );
  };
  const renderItemCommunity = useCallback((item: any) => {
    return (
      <CommunityCard
        item={item}
        key={item?.item?.id ?? item?.id}
        isProfileScreen
        containerStyle={{marginHorizontal: 12}}
      />
    );
  }, []);
  return (
    <RN.SafeAreaView style={styles.container}>
      {header()}
      <ScrollView style={{paddingTop: 24}}>
        {managingCommunity?.length > 0 &&
          managingCommunity?.map((item: any) => {
            return (
              <RN.View style={styles.flatList}>
                {renderItemCommunity(item)}
              </RN.View>
            );
          })}
        {!managingCommunity?.length && renderEmpty()}
      </ScrollView>

      {/* <RN.FlatList
        style={styles.flatList}
        data={managingCommunity}
        showsVerticalScrollIndicator={false}
        renderItem={renderItemCommunity}
        keyExtractor={(item, _index) => `${item.item?.id}/${_index}`}
        ListEmptyComponent={renderEmpty()}
      /> */}
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flatList: {
    flex: 1,
    // paddingVertical: 24,
    marginHorizontal: isAndroid ? 14 : 0,
  },
  backIcon: {
    height: 16,
    width: 19,
  },
  headerWrapper: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Lato-Regular',
    paddingLeft: 16,
    fontWeight: '600',
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
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    padding: 16,
  },
});
export default ManagingCommunities;
