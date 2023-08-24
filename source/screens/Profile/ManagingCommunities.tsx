import React, {useCallback, useEffect} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import CommunityCard from '../../components/communityCard';
import {useNavigation} from '@react-navigation/native';
import {useCommunities} from '../../hooks/useCommunitites';
import SkeletonCommunityCard from '../../components/skeleton/communityCard-Skeleton';

const ManagingCommunities = () => {
  const {managingCommunity, getManagingCommunities, isLoadManaging} =
    useCommunities();
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
        <RN.Text style={styles.headerText}>Managing communities</RN.Text>
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
          <RN.Text style={styles.emptyText}>There are no events yet</RN.Text>
        )}
      </RN.View>
    );
  };
  const renderItemCommunity = useCallback((item: any) => {
    return <CommunityCard item={item} key={item.item.id} isProfileScreen />;
  }, []);
  return (
    <RN.SafeAreaView style={styles.container}>
      {header()}
      <RN.FlatList
        style={styles.flatList}
        data={managingCommunity}
        showsVerticalScrollIndicator={false}
        renderItem={renderItemCommunity}
        keyExtractor={(item, _index) => `${item.item?.id}/${_index}`}
        ListEmptyComponent={renderEmpty()}
      />
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flatList: {
    paddingVertical: 24,
  },
  backIcon: {
    height: 24,
    width: 28,
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
    fontSize: 24,
    lineHeight: 28.8,
    fontFamily: 'Mulish-Regular',
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
    fontFamily: 'Mulish-Regular',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
export default ManagingCommunities;
