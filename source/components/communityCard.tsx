import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as RN from 'react-native';
import useRegistration from '../hooks/useRegistration';
import colors from '../utils/colors';
import {useCommunities} from '../hooks/useCommunitites';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_WIDTH} from '../utils/constants';
import SkeletonCommunityCard from './skeleton/communityCard-Skeleton';
import socket from '../api/sockets';
import {apiUrl} from '../api/serverRequests';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {defaultProfile, getDefaultImgUser} from '../utils/images';

interface Props {
  item: any;
  isProfileScreen: boolean;
  containerStyle?: RN.ViewStyle;
}

const CommunityCard = ({item, isProfileScreen, containerStyle}: Props) => {
  const {userUid} = useRegistration();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const data = item?.item ?? item;
  const {
    isLoadingWithFollow,
    isFollowedCurrentCommunity,
    communitiesData,
    startFollowed,
    isLoading,
    setSocketCommunities,
  } = useCommunities();
  const [countFollowers, setCountFollowers] = useState(0);

  const isMyCommunity = data?.creator?.uid === userUid;
  const isManager = data?.managers?.find(i => i === userUid);
  const [displayedData, setDisplayedData] = useState(data);

  const [isFollowed, setIsFollowed] = useState(false);
  // const isJoined =
  // communityData?.followers?.find((user: any) => user.userUid === userUid) ??
  // false;
  // const isFollowed = user?.joinedCommunities?.includes(data?.id);
  const [crntIndex, setCrntIndex] = useState(null);
  const [loadSubscribe, setLoadSubscribe] = useState(false);
  const index = communitiesData?.findIndex((itm: any) => itm.id === data?.id);
  const [attendedImgs, setAttendedImgs] = useState(displayedData?.userImages);

  const goToCommunity = () => {
    navigation.push('CommunityScreen', {data, isProfileScreen});
  };
  // console.log('di', data.followers, isFollowed);
  useEffect(() => {
    setIsFollowed(
      data?.followers?.find((i: {userUid: string}) => i.userUid === userUid),
    );
  }, [data?.followers, userUid]);

  useEffect(() => {
    setAttendedImgs(displayedData?.userImages);
  }, []);

  useEffect(() => {
    socket.on('subscribed', socket_data => {
      // console.log('data', socket_data);
      if (socket_data?.currentCommunity?.id === data?.id) {
        // socket.emit('joined_update', community.location);
        setAttendedImgs(socket_data?.userImages);
        setDisplayedData(socket_data?.currentCommunity);
        setIsFollowed(
          socket_data?.currentCommunity.followers?.find(
            (i: {userUid: string}) => i.userUid === userUid,
          ),
        );
        setLoadSubscribe(false);
        if (socket_data?.communities?.length) {
          setSocketCommunities(socket_data?.communities);
        }
        // socket.disconnect();
        // console.log(community?.followers?.find(i => i.userUid === userUid));
      }
    });
    // socket.on('updated_communities', communities => {
    //   console.log('joined_update', communities);
    // });
  }, [data?.id, userUid]);
  // console.log(data);
  // useEffect(() => {
  //   setLoadData(true);
  //   RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  //   const onValueChange = database()
  //     .ref(`community/${data?.id}`)
  //     .on('value', snapshot => {
  //       setDisplayedData(snapshot.val());
  //       setLoadData(false);
  //     });

  //   return () =>
  //     database().ref(`community/${data?.id}`).off('value', onValueChange);
  // }, [data?.id, user?.joinedCommunities]);

  // const description =
  //   displayedData?.description?.length > 70
  //     ? displayedData?.description?.slice(0, 70) + '...'
  //     : displayedData?.description;
  // const title =
  //   displayedData?.name?.length > 70
  //     ? displayedData?.name?.slice(0, 50) + '...'
  //     : displayedData?.name;
  useMemo(() => {
    setCountFollowers(displayedData?.followers?.length);
  }, [displayedData?.followers?.length]);
  const renderCount = () => {
    return (
      <RN.View style={{flexDirection: 'row', paddingVertical: 8}}>
        {attendedImgs?.slice(0, 3)?.map((img, idx) => {
          const imgUri =
            img?.userImage?.length > 0
              ? {uri: apiUrl + img?.userImage}
              : getDefaultImgUser(img.userGender);
          return (
            <RN.View
              style={{
                marginLeft: idx !== 0 ? -8 : 0,
                zIndex: idx !== 0 ? -idx : idx,
              }}>
              <RN.Image
                source={imgUri}
                style={styles.attendPeopleImg}
                defaultSource={getDefaultImgUser(img.userGender)}
              />
            </RN.View>
          );
        })}
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text
            style={{
              color: colors.darkGray,
            }}>
            {countFollowers > 0
              ? countFollowers > 3
                ? '+' + t('followers', {count: countFollowers - 3})
                : t('followed')
              : 'no subscribers yet'}
          </RN.Text>
        </RN.View>
      </RN.View>
    );
  };
  const renderTags = (tags: string[]) => {
    return (
      <RN.View style={styles.tagsContainer}>
        {tags?.slice(0, 2)?.map(tag => {
          return (
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.tagsItem}>{tag}</RN.Text>
            </RN.View>
          );
        })}
        {tags?.length > 2 && (
          <RN.View style={{justifyContent: 'center'}}>
            <RN.Text style={styles.tagsItem}>{`+${tags?.length - 2}`}</RN.Text>
          </RN.View>
        )}
      </RN.View>
    );
  };

  const renderLoading = () => {
    return (
      <RN.ActivityIndicator
        size={'small'}
        color={colors.orange}
        animating={loadSubscribe}
        key={index}
        style={{marginRight: 14}}
      />
    );
  };
  useMemo(() => {
    if (!loadSubscribe) {
      setCrntIndex(null);
    }
  }, [loadSubscribe]);
  const onPressJoin = (communityId: string, idx: number) => {
    setCrntIndex(idx);
    startFollowed(communityId, data.channelId);
    setLoadSubscribe(true);
  };
  // if (isLoading) {
  //   return (
  //     <>
  //       <RN.View style={{marginBottom: 16}}>
  //         <SkeletonCommunityCard />
  //       </RN.View>
  //     </>
  //   );
  // }
  return (
    <RN.View
      style={[
        styles.itemContainer,
        containerStyle,
        {
          borderColor:
            data?.type && data?.type === 'paid'
              ? colors.purple
              : colors.gray200,
        },
      ]}>
      <RN.TouchableOpacity
        onPress={goToCommunity}
        style={styles.headerItemContainer}
        activeOpacity={0.7}>
        <RN.View style={{maxWidth: SCREEN_WIDTH / 1.57}}>
          <RN.Text numberOfLines={1} style={styles.itemTitle}>
            {data?.title}
          </RN.Text>
          <RN.Text numberOfLines={3} style={styles.itemDesc}>
            {data?.description}
          </RN.Text>
        </RN.View>

        <FastImage
          source={
            data?.images[0]
              ? {
                  uri: apiUrl + data?.images[0],
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }
              : require('../assets/images/default.jpeg')
          }
          defaultSource={require('../assets/images/default.jpeg')}
          style={styles.itemImg}
        />
      </RN.TouchableOpacity>
      {attendedImgs?.length > 0 && renderCount()}
      <RN.View style={{borderTopWidth: 1, borderColor: colors.gray}} />
      <RN.View style={styles.footerItemContainer}>
        {data?.categories && renderTags(data?.categories)}
        <RN.View>
          {loadSubscribe ? (
            renderLoading()
          ) : isFollowed ? (
            <RN.View style={{flexDirection: 'row'}}>
              {/* <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'tick'}}
                  style={{
                    height: 12,
                    width: 12,
                    tintColor: isMyCommunity
                      ? colors.white
                      : colors.textPrimary,
                  }}
                />
              </RN.View> */}
              <RN.Text style={styles.joinedText}>
                {isMyCommunity || isManager ? t('managing') : t('joined')}
              </RN.Text>
            </RN.View>
          ) : isMyCommunity || isManager ? null : (
            <RN.TouchableOpacity
              onPress={() => onPressJoin(data?.id, index)}
              key={index}
              style={styles.joinBtn}>
              <RN.Text style={{color: colors.white}}>{t('join_small')}</RN.Text>
            </RN.TouchableOpacity>
          )}
        </RN.View>
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  itemContainer: {
    zIndex: 2,
    borderWidth: 1,
    // borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
  },
  attendPeopleImg: {
    height: 24,
    width: 24,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.white,
  },
  joinBtn: {
    backgroundColor: colors.orange,
    paddingVertical: 8,
    paddingHorizontal: 26,
    borderRadius: 100,
  },
  joinedText: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19.6,
    // paddingHorizontal: 12,
  },
  headerItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 18,
    lineHeight: 25.2,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingVertical: 8,
    paddingRight: 14,
    fontFamily: 'Lato-Black',
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tagsItem: {
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    marginRight: 4,
    color: colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14.4,
    borderRadius: 4,
  },
  itemDesc: {
    fontSize: 14,
    lineHeight: 19.6,
    color: '#616161',
    fontWeight: '400',
    marginBottom: 8,
    paddingRight: 14,
    fontFamily: 'Lato-Regular',
  },
  itemImg: {
    height: 105,
    width: 80,
    borderRadius: 6,
    marginBottom: 10,
  },
  footerItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
});
export default CommunityCard;
