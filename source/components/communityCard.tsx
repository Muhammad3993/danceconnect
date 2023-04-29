import React, {useMemo, useRef, useState} from 'react';
import * as RN from 'react-native';
import useRegistration from '../hooks/useRegistration';
import colors from '../utils/colors';
import {useCommunities} from '../hooks/useCommunitites';
import {useProfile} from '../hooks/useProfile';

type props = {
  item: any;
};

const CommunityCard = ({item}: props) => {
  const {userUid} = useRegistration();
  const data = item.item;
  const index = item.index;
  const {
    isLoadingWithFollow,
    isFollowedCurrentCommunity,
    communitiesData,
    startFollowed,
  } = useCommunities();
  const {userImgUrl} = useProfile();
  const [countFollowers, setCountFollowers] = useState(0);
  const [loading, setLoading] = useState(false);

  const isMyCommunity = userUid === data?.creatorUid;
  const isFollowed = isFollowedCurrentCommunity(data?.id);
  const [crntIndex, setCrntIndex] = useState(null);

  useMemo(() => {
    if (isLoadingWithFollow) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoadingWithFollow]);
  const description =
    data?.description?.length > 70
      ? data?.description?.slice(0, 70) + '...'
      : data?.description;
  const title =
    data?.name?.length > 70 ? data?.name?.slice(0, 50) + '...' : data.name;
  useMemo(() => {
    const count =
      communitiesData
        ?.map(item => item)
        ?.filter(item => item?.id === data?.id)[0]?.followers?.length ?? 0;
    setCountFollowers(count);
  }, [communitiesData, data?.id]);
  const renderCount = () => {
    // const usersImg = communitiesData
    //   ?.map(item => item)
    //   ?.slice(0, 3)
    //   ?.filter(item => item?.id === communityData.id)[0]
    //   ?.followers?.map(item => item?.userImg)[0];
    // console.log(usersImg);
    return (
      <RN.View style={{flexDirection: 'row'}}>
        {/* {count > 0 && (
        <RN.View style={{backgroundColor: 'red'}}>
        <RN.Image
          source={{uri: usersImg}}
          style={{height: 24, width: 24, borderRadius: 40}}
        />
        </RN.View>
        )} */}
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text
            style={{
              color: colors.darkGray,
            }}>
            {countFollowers > 0
              ? countFollowers > 100
                ? '+' + `${countFollowers} followers`
                : `${countFollowers} followers`
              : 'no subscribers yet'}
          </RN.Text>
        </RN.View>
      </RN.View>
    );
  };
  const renderTags = (tags: string[]) => {
    return (
      <RN.View style={styles.tagsContainer}>
        {tags?.slice(0, 3)?.map(tag => {
          return (
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.tagsItem}>{tag}</RN.Text>
            </RN.View>
          );
        })}
        {tags?.length > 3 && (
          <RN.Text style={styles.tagsItem}>{`+${tags?.length - 3}`}</RN.Text>
        )}
      </RN.View>
    );
  };

  const renderLoading = () => {
    return (
      <RN.ActivityIndicator
        size={'small'}
        color={colors.black}
        animating={loading}
        key={index}
      />
    );
  };
  useMemo(() => {
    if (!isLoadingWithFollow) {
      setCrntIndex(null);
    }
  }, [isLoadingWithFollow]);
  const onPressJoin = (communityId: string, idx: number) => {
    setCrntIndex(idx);
    startFollowed({
      communityUid: communityId,
      userUid: userUid,
      userImg: userImgUrl,
    });
  };
  return (
    <RN.View style={styles.itemContainer} key={index}>
      <RN.TouchableOpacity
        key={index}
        // onPress={() => onPressJoin(data?.id, index)}
        style={styles.headerItemContainer}
        activeOpacity={0.7}>
        <RN.View style={{maxWidth: '80%'}}>
          {data?.categories && renderTags(data?.categories)}
          <RN.Text style={styles.itemTitle}>{title}</RN.Text>
          <RN.Text style={styles.itemDesc}>{description}</RN.Text>
        </RN.View>
        {data?.images?.length > 0 && (
          <RN.View>
            <RN.Image
              source={{
                uri: 'data:image/png;base64,' + data?.images[0]?.base64,
              }}
              style={styles.itemImg}
            />
          </RN.View>
        )}
      </RN.TouchableOpacity>
      <RN.View style={{borderTopWidth: 1, borderColor: colors.gray}} />
      <RN.View style={styles.footerItemContainer} key={index}>
        {renderCount()}
        <RN.View>
          {isLoadingWithFollow &&
          communitiesData?.findIndex((itm: any) => itm.id === data.id) ===
            crntIndex ? (
            <>{renderLoading()}</>
          ) : isFollowed ? (
            <RN.View style={{flexDirection: 'row'}}>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'tick'}}
                  style={{height: 12, width: 12}}
                />
              </RN.View>
              <RN.Text style={styles.joinedText}>{'Joined'}</RN.Text>
            </RN.View>
          ) : isMyCommunity ? null : (
            <RN.TouchableOpacity
              onPress={() => onPressJoin(data?.id, index)}
              key={index}
              style={styles.joinBtn}>
              <RN.Text style={{color: colors.white}}>Join</RN.Text>
            </RN.TouchableOpacity>
          )}
        </RN.View>
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  itemContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  joinBtn: {
    backgroundColor: colors.orange,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  joinedText: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19.6,
    paddingLeft: 6,
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
