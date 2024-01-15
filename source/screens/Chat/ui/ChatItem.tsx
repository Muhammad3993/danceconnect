import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../../utils/colors';
import {apiUrl} from '../../../api/serverRequests';
import {defaultProfile} from '../../../utils/images';
import FastImage from 'react-native-fast-image';

interface Props {
  name: string;
  text: string;
  avatar?: string;
  date: Date;
  seen: boolean;
}

export function ChatItem({name, text, avatar, date, seen}: Props) {
  let localTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.item}>
      <FastImage
        source={avatar ? {uri: apiUrl + avatar} : undefined}
        defaultSource={defaultProfile}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.message}>{text}</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.date}>{localTime}</Text>
        {seen && <View style={styles.dot} />}
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
    fontFamily: 'Mulish-Bold',
    fontSize: 18,
    marginBottom: 6,
  },
  message: {
    fontFamily: 'Mulish',
    fontSize: 14,
    color: colors.gray700,
  },
  date: {
    fontFamily: 'Mulish-Regular',
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
