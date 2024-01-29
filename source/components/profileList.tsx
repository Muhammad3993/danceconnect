import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {apiUrl} from '../api/serverRequests';
import {defaultProfile} from '../utils/images';

import colors from '../utils/colors';
import {getUserRole} from '../utils/helpers';
import {Tab} from './tab';
import {PostCard} from '../screens/Profile/ui/PostCard';

interface Props {
  currentUser: boolean;
  user: any;
  onEndReached?: () => void;
  posts: Amity.Post[];
  isLoading: boolean;
  onPressMenu?: () => void;
  actions: React.ReactNode;
}

export function ProfileList({
  user,
  onEndReached,
  posts,
  isLoading,
  onPressMenu,
  currentUser,
  actions,
}: Props) {
  const roles = user?.userRole ?? [];

  const rolesString = roles.reduce((acc, next) => {
    const role = getUserRole(next.title);
    return (acc += acc === '' ? role : `, ${role}`);
  }, '');

  const individualStyles = user?.individualStyles ?? [];

  return (
    <FlatList
      bounces={false}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: posts.length == 0 ? colors.white : colors.gray200,
      }}
      data={posts}
      ListHeaderComponent={
        <View style={{backgroundColor: colors.white}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={{uri: 'share'}}
                style={{width: 28, height: 28, tintColor: colors.black}}
              />
            </TouchableOpacity>
            {currentUser && (
              <TouchableOpacity onPress={onPressMenu}>
                <Image
                  source={{uri: 'setting'}}
                  style={{width: 28, height: 28, marginLeft: 20}}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.profile}>
            <FastImage
              source={{
                uri: apiUrl + user.userImage,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              defaultSource={defaultProfile}
              style={styles.image}
            />
            <View style={styles.profileData}>
              <Text numberOfLines={1} style={styles.userName}>
                {user?.userName}
              </Text>
              <Text numberOfLines={1} style={styles.userAdress}>
                {user?.userCountry}
              </Text>
              <ScrollView
                style={{height: 24}}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={individualStyles.length > 3}>
                {individualStyles.map((tag: string, idx: number) => {
                  return (
                    <View style={styles.tagItem} key={idx}>
                      <Text style={styles.tagItemText}>{tag}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          <Text style={styles.roles}>{rolesString}</Text>
          <View style={styles.actions}>{actions}</View>

          <Tab
            textStyle={styles.tabText}
            itemStyle={{alignItems: 'center'}}
            containerStyle={styles.tabContainer}
            scrollEnabled={false}
            data={[
              {text: 'Posts', containerStyle: {flex: 1}},
              {text: 'Communities', containerStyle: {flex: 1.6}},
              {
                text: 'Events',
                containerStyle: {flex: 1, borderBottomWidth: 3},
              },
            ]}
            currentTab={'Posts'}
            onPressTab={() => {}}
          />
        </View>
      }
      renderItem={({item}) => <PostCard post={item} user={user} />}
      ListEmptyComponent={
        <View style={{marginTop: 80}}>
          {isLoading ? (
            <ActivityIndicator size={'large'} />
          ) : (
            <Text style={styles.emptyText}>Your feed is empty</Text>
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  tagItem: {
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  tagItemText: {
    color: colors.purple,
    fontSize: 12,
    fontFamily: 'Mulish-Bold',
    letterSpacing: 0.2,
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileData: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Mulish-Bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userAdress: {
    fontSize: 14,
    color: colors.gray700,
    marginBottom: 8,
    fontFamily: 'Mulish-Regular',
    letterSpacing: 0.2,
  },

  roles: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.black,
    marginBottom: 4,
    fontFamily: 'Mulish-Bold',
    letterSpacing: 0.2,
  },

  actions: {
    marginTop: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  actionBtn: {
    flex: 1,
    marginHorizontal: 0,
    paddingVertical: 8,
  },

  tabContainer: {
    paddingHorizontal: 16,
  },
  tabText: {
    fontFamily: 'Mulish-Bold',
    lineHeight: 22,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Mulish-Regular',
    fontSize: 16,

    color: colors.gray500,
  },
});
