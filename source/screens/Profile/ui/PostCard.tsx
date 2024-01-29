import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {FileRepository, PostRepository} from '@amityco/ts-sdk';
import FastImage from 'react-native-fast-image';
import {apiUrl} from '../../../api/serverRequests';
import {defaultProfile} from '../../../utils/images';
import colors from '../../../utils/colors';
import {SCREEN_WIDTH} from '../../../utils/constants';

interface Props {
  post: Amity.Post;
  user: any;
}

const getPostImageInfo = async (postChildrenId: string) => {
  const postChildren = await new Promise<Amity.Post<'image'>>(resolve => {
    PostRepository.getPost(postChildrenId, ({data, loading}) => {
      if (!loading) {
        resolve(data as Amity.Post<'image'>);
      }
    });
  });

  return postChildren;
};

const getPostFile = async <T extends Amity.FileType>(fileId?: string) => {
  if (!fileId) {
    return null;
  }
  const {data: file} = await FileRepository.getFile(fileId);

  return file as Amity.File<T>;
};

export function PostCard({post, user}: Props) {
  const [postImageUrl, setPostImageUrl] = useState<string | undefined>(
    undefined,
  );
  const haveChildren = post.children.length > 0;

  const getData = useCallback(async () => {
    if (haveChildren) {
      const postCh = await getPostImageInfo(post.children[0]);

      const postImage = await getPostFile<'image'>(postCh.data?.fileId);

      setPostImageUrl(postImage?.fileUrl);
    }
  }, [post, haveChildren]);

  useEffect(() => {
    getData();
  }, [getData]);

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

        <Image source={{uri: 'menu'}} style={styles.headerAction} />
      </View>
      <View style={styles.content}>
        <TextRenderer text={post.data.text} />
        {haveChildren && (
          <View style={styles.mediaContainer}>
            <FastImage
              style={styles.media}
              source={{uri: postImageUrl + '?size=medium'}}
            />
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
  media: {
    flex: 1,
  },
  readMore: {
    fontSize: 14,
    color: colors.textHighlighted,
    marginBottom: 8,
    fontFamily: 'Mulish-Regular',
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
