import {FileRepository, PostRepository} from '@amityco/ts-sdk';
import {NavigationProp} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {apiUrl} from '../api/serverRequests';
import colors from '../utils/colors';
import {SCREEN_WIDTH} from '../utils/constants';
import {defaultProfile} from '../utils/images';
import ScalableImage from './ScalabelImage';
import {VideoView} from './VideoView';

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

const IMAGE_WIDTH = SCREEN_WIDTH - 32;

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
  const haveChildren = post.children.length > 0;

  const getData = useCallback(async () => {
    if (post.children.length > 0) {
      const postCh = await getPostImageInfo(post.children[0]);

      if (postCh.dataType === 'video') {
        const thumbnailFileId = postCh.data?.thumbnailFileId;

        if (thumbnailFileId) {
          const postVideoPoster = await getPostFile<'image'>(thumbnailFileId);
          setVideoPoster(postVideoPoster?.fileUrl);
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

  const deletePost = () => {
    PostRepository.deletePost(post.postId, true);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FastImage
          source={
            Boolean(user.userImage)
              ? {
                  uri: apiUrl + user.userImage,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }
              : defaultProfile
          }
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
                <TouchableOpacity
                  style={{borderBottomWidth: 0.5}}
                  onPress={editePost}>
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
              <ScalableImage
                originalWidth={IMAGE_WIDTH}
                uri={postImageUrl + '?size=medium'}
              />
            )}
            {(videoPoster || videoUrl) && (
              <VideoView
                width={IMAGE_WIDTH}
                height={IMAGE_WIDTH}
                paused={!isFocused || !inView}
                videoPoster={
                  videoPoster ? videoPoster + '?size=small' : undefined
                }
                videoUrl={videoUrl}
              />
            )}

            {!postImageUrl && !videoUrl && !videoPoster && (
              <ActivityIndicator />
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
  container: {backgroundColor: colors.white, marginBottom: 8, minHeight: 122},
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
    fontFamily: 'Lato-Bold',
    letterSpacing: 0.2,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Lato-Regular',
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
    fontFamily: 'Lato-Regular',
    lineHeight: 21,
  },
  mediaContainer: {
    width: IMAGE_WIDTH,
    minHeight: 200,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  readMore: {
    fontSize: 14,
    color: colors.textHighlighted,
    marginBottom: 8,
    fontFamily: 'Lato-Regular',
  },
  menu: {
    width: 120,

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
    padding: 14,
    fontFamily: 'Lato-Bold',
    textAlign: 'center',
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
