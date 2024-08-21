import { FileRepository, PostRepository } from '@amityco/ts-sdk-react-native';
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Share, { Social } from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import { SCREEN_WIDTH } from 'common/constants';
import { User } from 'data/api/user/inerfaces';
import { UserImage } from './user_image';
import { getImgePath } from 'data/api';
import { theming } from 'common/constants/theming';
import { ScalableImage } from './shared/scallable_image';
import { VideoView } from './shared/scallable_video';
import ExpandableText from './shared/expandable_text';
import { TabScreenNavigation } from 'screens/interfaces';
import { MenuIcon } from './icons/menu';
import { showErrorToast } from 'common/libs/toast';

interface Props {
  post: Amity.Post;
  user: User;
  inView: boolean;
  navigation: TabScreenNavigation<'profile'>;
}

const getPostImageInfo = async (postChildrenId: string) => {
  const postChildren = await new Promise<Amity.Post<'image' | 'video'>>(
    resolve => {
      PostRepository.getPost(postChildrenId, ({ data, loading }) => {
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
  const { data: file } = await FileRepository.getFile(fileId);

  return file as Amity.File<T>;
};

const IMAGE_WIDTH = SCREEN_WIDTH - 32;

export function PostCard({ post, user, inView, navigation }: Props) {
  const isFocused = useIsFocused();

  const [file, setFile] = useState<Amity.File<'image' | 'video'> | null>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const haveChildren = post.children.length > 0;

  const getData = useCallback(async () => {
    if (post.children.length > 0) {
      const postCh = await getPostImageInfo(post.children[0]);

      const file = await getPostFile<'video' | 'image'>(
        postCh.dataType === 'video'
          ? postCh.data?.videoFileId?.original
          : postCh.data?.fileId,
      );

      setFile(file);
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
    navigation.push('createPost', {
      postId: post.postId,
      postText: post.data.text,
      targetId: user.id,
      targetType: 'user',
      file: file ?? undefined,
    });
    setMenuIsOpen(false);
  };

  const sharePost = async () => {
    setMenuIsOpen(false);
    try {
      const downloadUrl = file?.fileUrl;

      if (!downloadUrl) {
        return;
      }
      if (file?.type == 'video') {
        const cache = await RNFetchBlob.config({
          fileCache: true,
          appendExt: 'mp4',
        }).fetch('GET', downloadUrl, {});
        const gallery = await CameraRoll.save(cache.path(), { type: 'video' });
        cache.flush();
        await Share.shareSingle({
          social: Share.Social.INSTAGRAM as Social,
          url: gallery,
          type: 'video/*',
          appId: 'com.danceconnect',
        });
      } else {
        const resp = await RNFetchBlob.config({
          fileCache: true,
        }).fetch('GET', downloadUrl, {});
        const base64 = await resp.readFile('base64');

        await Share.shareSingle({
          social: Share.Social.INSTAGRAM as Social,
          url: ('data:image/png;base64,' + base64) as string,
          type: 'image/*',
          appId: 'com.danceconnect',
        });
        resp.flush();
      }
    } catch (err) {
      const error = err as Error;
      showErrorToast(error.message);
    }
  };

  const isCurrentUser = post.postedUserId == user.id;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UserImage
          userImage={getImgePath(user.userImage)}
          style={styles.avatar}
        />

        <View style={styles.headerUser}>
          <Text style={styles.userName}>{user.userName}</Text>
          <Text style={styles.time}>{timeAgo(post.createdAt)} </Text>
        </View>

        {isCurrentUser && (
          <View>
            <TouchableOpacity onPress={toggleMenu}>
              <MenuIcon />
              {/* <Image source={{ uri: 'menu' }} style={styles.headerAction} /> */}
            </TouchableOpacity>
            {menuIsOpen && (
              <View style={styles.menu}>
                <TouchableOpacity
                  style={{ borderBottomWidth: 0.5 }}
                  onPress={editePost}>
                  <Text style={styles.menuItem}>Edit</Text>
                </TouchableOpacity>
                {haveChildren && (
                  <TouchableOpacity
                    style={{ borderBottomWidth: 0.5 }}
                    onPress={sharePost}>
                    <Text style={styles.menuItem}>Share Post</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={deletePost}>
                  <Text
                    style={[
                      styles.menuItem,
                      { color: theming.colors.redError },
                    ]}>
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
          <>
            {file == null ? (
              <ActivityIndicator style={{ marginVertical: 20 }} />
            ) : file.type == 'image' ? (
              <ScalableImage
                originalWidth={IMAGE_WIDTH}
                uri={file.fileUrl + '?size=medium'}
                containerStyle={{ marginVertical: 8 }}
              />
            ) : (
              <VideoView
                containerStyle={{ marginVertical: 8 }}
                width={IMAGE_WIDTH}
                paused={!isFocused || !inView}
                videoUrl={
                  file?.videoUrl?.['720p'] ??
                  file?.videoUrl?.['480p'] ??
                  file?.videoUrl?.original ??
                  file?.fileUrl
                }
              />
            )}
          </>
        )}
      </View>
    </View>
  );
}

const TextRenderer = memo(({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(text.length < 255);

  if (text === '') {
    return null;
  }

  return (
    <View>
      <ExpandableText cutLength={255} expand={expanded}>
        {text}
      </ExpandableText>

      {!expanded && (
        <Text onPress={() => setExpanded(true)} style={styles.readMore}>
          Read more
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theming.colors.white,
    marginBottom: 8,
    minHeight: 122,
  },
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
    color: theming.colors.textPrimary,
    fontFamily: 'Lato-Bold',
    letterSpacing: 0.2,
  },
  time: {
    fontSize: 12,
    color: theming.colors.textSecondary,
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

  mediaContainer: {
    width: IMAGE_WIDTH,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theming.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  readMore: {
    fontSize: 14,
    color: theming.colors.textHighlighted,
    marginBottom: 8,
    fontFamily: 'Lato-Regular',
  },
  menu: {
    width: 120,

    borderRadius: 8,
    backgroundColor: theming.colors.white,
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
