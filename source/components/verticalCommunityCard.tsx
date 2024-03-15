import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import {CommunityT} from '../utils/interfaces';
import colors from '../utils/colors';
import {SCREEN_WIDTH} from '../utils/constants';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {getDefaultImgUser} from '../utils/images';
import {useTranslation} from 'react-i18next';
import {Button} from './Button';
import useRegistration from '../hooks/useRegistration';
import {useCommunities} from '../hooks/useCommunitites';
import {axiosInstance} from '../utils/helpers';

const VerticalCommunityCard = (community: CommunityT) => {
  const navigation = useNavigation();
  const {userUid} = useRegistration();
  const {t} = useTranslation();
  const {startFollowed, mainCommunities} = useCommunities();
  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(false);
  const countFollowers = community?.followers?.length;
  const isMyCommunity = community?.creator?.uid === userUid;
  const isManager = community?.managers?.find(i => i === userUid);
  useEffect(() => {
    setIsFollowed(
      community?.followers?.find(
        (i: {userUid: string}) => i.userUid === userUid,
      ),
    );
  }, [community?.followers, userUid]);
  const renderCount = () => {
    return (
      <RN.View style={{flexDirection: 'row', paddingVertical: 8}}>
        {community.userImages?.slice(0, 5)?.map((img, idx) => {
          const imgUri =
            img?.userImage?.length > 0
              ? {uri: axiosInstance.getUri() + img?.userImage}
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
              ? countFollowers > 5
                ? '+' + t('followers', {count: countFollowers - 5})
                : t('followed')
              : 'no subscribers yet'}
          </RN.Text>
        </RN.View>
      </RN.View>
    );
  };
  const onPress = () => {
    navigation.push('CommunityScreen', {id: community.id});
  };
  const onPressJoin = () => {
    startFollowed(community.id, community.channelId);
  };
  return (
    <RN.TouchableOpacity
      style={[
        styles.container,
        {
          minWidth:
            mainCommunities?.length > 1 ? SCREEN_WIDTH - 60 : SCREEN_WIDTH - 40,
        },
      ]}
      activeOpacity={0.7}
      onPress={onPress}>
      <RN.ImageBackground
        source={{uri: axiosInstance.getUri() + community.images[0]}}
        style={styles.image}
        imageStyle={styles.imgStyle}
        defaultSource={require('../assets/images/default.jpeg')}>
        <RN.View style={styles.wrapper}>
          <ScrollView horizontal style={styles.categoiesWrapper}>
            {community?.categories?.slice(0, 3).map((category, idx) => {
              return (
                <RN.View style={styles.categoryContainer} key={idx}>
                  <RN.Text style={styles.categoryText}>{category}</RN.Text>
                </RN.View>
              );
            })}
          </ScrollView>
          <RN.Text style={styles.title}>{community.title}</RN.Text>
          {community.userImages?.length > 0 && renderCount()}
          <RN.View style={styles.footerContainer}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.location}>{community.location}</RN.Text>
            </RN.View>
            {isFollowed ? (
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Text style={styles.joinedText}>
                  {isMyCommunity || isManager ? t('managing') : t('joined')}
                </RN.Text>
              </RN.View>
            ) : (
              <Button
                title={t('join_small')}
                buttonStyle={styles.joinBtn}
                disabled
                onPress={onPressJoin}
              />
            )}
          </RN.View>
        </RN.View>
      </RN.ImageBackground>
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginVertical: 14,
    marginBottom: 14,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: 'rgba(88, 76, 244, 0.15)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 9,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 360,
    maxHeight: 360,
    flex: 1,
  },
  wrapper: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  image: {
    justifyContent: 'flex-end',
    minHeight: 360,
    // width: SCREEN_WIDTH - 60,
    marginTop: -14,
    marginHorizontal: -12,
  },
  imgStyle: {
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    paddingVertical: 10,
    fontWeight: '700',
  },
  categoiesWrapper: {
    marginTop: -24,
  },
  categoryContainer: {
    borderRadius: 4,
    backgroundColor: colors.white,
    marginRight: 4,
    borderColor: colors.purple,
    borderWidth: 0.5,
  },
  categoryText: {
    color: colors.purple,
    fontSize: 12,
    lineHeight: 14.4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  attendPeopleImg: {
    height: 24,
    width: 24,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.white,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    fontSize: 16,
    paddingVertical: 10,
    fontWeight: '600',
  },
  joinBtn: {
    backgroundColor: colors.orange,
    paddingVertical: 0,
    paddingHorizontal: 26,
    borderRadius: 100,
    marginHorizontal: 0,
  },
  joinedText: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19.6,
  },
});
export default VerticalCommunityCard;
