import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../../utils/colors';
// import {apiUrl} from '../../../api/serverRequests';
import {defaultProfile} from '../../../utils/images';
import FastImage from 'react-native-fast-image';
import {apiUrl} from '../../../api/serverRequests';

interface Props {
  channel: Amity.Channel;
  currentUser: any;
}

export function ChatItem({channel, currentUser}: Props) {
  const unreadCount = channel?.unreadCount ?? 0;

  const usersList = channel.metadata;
  const users = usersList?.users ?? [];

  const anotherUser = users.find(user => user.id !== currentUser.id);

  const messagePreview = channel?.messagePreview?.data?.text;

  const previewCreateAt = new Date(
    channel?.messagePreview?.createdAt ?? channel?.createdAt,
  );

  let localTime = previewCreateAt?.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.item}>
      <FastImage
        source={
          Boolean(anotherUser?.userImage)
            ? {uri: apiUrl + anotherUser?.userImage}
            : defaultProfile
        }
        defaultSource={defaultProfile}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <Text style={styles.name}>
          {anotherUser?.userName ?? channel?.displayName ?? channel?.channelId}
        </Text>
        <Text style={styles.message}>{messagePreview}</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.date}>{localTime}</Text>
        {unreadCount > 0 && <View style={styles.dot} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 50,
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontFamily: 'Lato-Bold',
    fontSize: 18,
    marginBottom: 6,
  },
  message: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: colors.gray700,
  },
  date: {
    fontFamily: 'Lato-Regular',
    fontSize: 12,
    color: colors.gray700,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: colors.purple,
    borderRadius: 4,
    marginLeft: 5,
  },
});
