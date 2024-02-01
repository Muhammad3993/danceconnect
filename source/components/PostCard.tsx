import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {FileRepository, PostRepository} from '@amityco/ts-sdk';
import FastImage from 'react-native-fast-image';
import {apiUrl} from '../api/serverRequests';
import {defaultProfile} from '../utils/images';
import colors from '../utils/colors';
import {SCREEN_WIDTH} from '../utils/constants';
import Video from 'react-native-video';
import {NavigationProp} from '@react-navigation/native';

interface Props {
  post: Amity.Post;
  user: any;
  canEdit: boolean;
  isFocused: boolean;
  inView: boolean;
  navigation: NavigationProp<ReactNavigation.RootParamList>;
}

const getPostImageInfo = async (postChildrenId: string) => {
  const postChildren = await new Promise<Amity.Post<'image' | 'video'>>(
    resolve => {
      PostRepository.getPost(postChildrenId, ({data, loading}) => {
        if (!loading) {
          resolve(data as Amity.Post<'image' | 'video'>);
        }
      });
    },
  );

  return postChildren;
};

const getPostFile = async <T extends Amity.FileType>(fileId?: string) => {
  if (!fileId) {
    return null;
  }
  const {data: file} = await FileRepository.getFile(fileId);

  return file as Amity.File<T>;
};

export function PostCard({
  post,
  user,
  canEdit,
  isFocused,
  inView,
  navigation,
}: Props) {
  const [postImageUrl, setPostImageUrl] = useState<string | undefined>(
    undefined,
  );
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const [videoPoster, setVideoPoster] = useState<string | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(true);
  const haveChildren = post.children.length > 0;

  const getData = useCallback(async () => {
    // console.log(post.children);

    if (post.children.length > 0) {
      const postCh = await getPostImageInfo(post.children[0]);

      if (postCh.dataType === 'video') {
        const thumbnailFileId = postCh.data?.thumbnailFileId;

        if (thumbnailFileId) {
          const postVideoPoster = await getPostFile<'image'>(thumbnailFileId);
          setVideoPoster(postVideoPoster?.fileUrl);
        } else {
          setVideoPoster(undefined);
          setIsPaused(false);
        }
        const videoFileId = postCh.data?.videoFileId?.original;

        const postVideo = await getPostFile<'video'>(videoFileId);

        setVideoUrl(postVideo?.videoUrl?.['480p'] ?? postVideo?.fileUrl);
        setPostImageUrl(undefined);
      } else {
        const postImage = await getPostFile<'image'>(postCh.data?.fileId);

        setPostImageUrl(postImage?.fileUrl);
        setVideoUrl(undefined);
        setVideoPoster(undefined);
      }
    }
  }, [post]);

  useEffect(() => {
    getData();
  }, [getData]);

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const deletePost = async () => {
    await PostRepository.deletePost(post.postId, true);
  };

  const editePost = async () => {
    navigation.push('CreatePost', {
      postId: post.postId,
      postText: post.data.text,
      postImage: postImageUrl,
      postVideo: videoUrl,
    });
    setMenuIsOpen(false);
  };

  // console.log({postImageUrl, videoUrl, videoPoster});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FastImage
          source={{
            uri: apiUrl + user.userImage,
            cache: FastImage.cacheControl.immutable,
            priority: FastImage.priority.high,
          }}
          defaultSource={defaultProfile}
          style={styles.avatar}
        />
        <View style={styles.headerUser}>
          <Text style={styles.userName}>{user.userName}</Text>
          <Text style={styles.time}>{timeAgo(post.createdAt)} </Text>
        </View>

        {canEdit && (
          <View>
            <TouchableOpacity onPress={toggleMenu}>
              <Image source={{uri: 'menu'}} style={styles.headerAction} />
            </TouchableOpacity>
            {menuIsOpen && (
              <View style={styles.menu}>
                <TouchableOpacity onPress={editePost}>
                  <Text style={styles.menuItem}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={deletePost}>
                  <Text style={[styles.menuItem, {color: colors.redError}]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
      <View style={styles.content}>
        <TextRenderer text={post.data.text} />
        {haveChildren && (
          <View style={styles.mediaContainer}>
            {postImageUrl && (
              <FastImage
                style={styles.media}
                source={{uri: postImageUrl + '?size=medium'}}
              />
            )}
            {(videoPoster || videoUrl) && (
              <>
                <Video
                  paused={isPaused || !isFocused || !inView}
                  repeat
                  posterResizeMode="cover"
                  poster={videoPoster ? videoPoster + '?size=small' : undefined}
                  style={{flex: 1}}
                  resizeMode="cover"
                  source={{uri: videoUrl}}
                />

                <Pressable
                  onPress={() => setIsPaused(!isPaused)}
                  style={styles.playOverlay}>
                  {isPaused && (
                    <Image
                      source={{uri: 'playcircle'}}
                      style={{width: 40, height: 40, tintColor: colors.white}}
                    />
                  )}
                </Pressable>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const TextRenderer = ({text}: {text: string}) => {
  const [expanded, setExpanded] = useState(text.length < 255);

  if (text === '') {
    return null;
  }

  return (
    <Text style={styles.text}>
      {expanded ? text : `${text.substring(0, 255)}... `}
      {!expanded && (
        <Text onPress={() => setExpanded(true)} style={styles.readMore}>
          Read more
        </Text>
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: colors.white, marginBottom: 8},
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 8,
    zIndex: 10,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerUser: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Mulish-Bold',
    letterSpacing: 0.2,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Mulish-Regular',
    letterSpacing: 0.2,
  },
  headerAction: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  content: {
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    color: colors.textPrimary,
    marginVertical: 8,
    fontFamily: 'Mulish-Regular',
    lineHeight: 21,
  },
  mediaContainer: {
    width: '100%',
    height: SCREEN_WIDTH - 32,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray100,
  },
  media: {flex: 1},
  playOverlay: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_WIDTH - 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  readMore: {
    fontSize: 14,
    color: colors.textHighlighted,
    marginBottom: 8,
    fontFamily: 'Mulish-Regular',
  },
  menu: {
    width: 120,
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    position: 'absolute',
    right: 0,
    top: 22,
  },
  menuItem: {
    fontSize: 14,
    paddingVertical: 6,
    fontFamily: 'Mulish-Bold',
  },
});

function timeAgo(date: string) {
  const now = new Date().getTime();
  const d = new Date(date).getTime();
  const diffInSeconds = Math.floor((now - d) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    min: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);

    if (interval >= 1) {
      return interval === 1 ? `${interval} ${unit}` : `${interval} ${unit}s`;
    }
  }

  return 'Just now';
}