import React, {useCallback} from 'react';
import * as RN from 'react-native';
import {statusBarHeight} from '../../utils/constants';
import colors from '../../utils/colors';
import CommunityCard from '../../components/communityCard';
import {useNavigation} from '@react-navigation/native';
import {useCommunities} from '../../hooks/useCommunitites';

const ManagingCommunities = () => {
  const {managingCommunity} = useCommunities();
  const navigation = useNavigation();

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
    return (
      <RN.View style={styles.emptyContainer}>
        <RN.Text style={styles.emptyText}>There are no community yet</RN.Text>
      </RN.View>
    );
  };

  const renderItemCommunity = useCallback((item: any) => {
    return <CommunityCard item={item} key={item.index + item.item.id} />;
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
