import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../../utils/colors';

interface Props {
  name: string;
  text: string;
  avatar?: string;
  date: Date;
}

export function ChatItem({name, text, avatar, date}: Props) {
  let localTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.item}>
      <Image source={{uri: avatar ?? 'profilefull'}} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.message}>{text}</Text>
      </View>
      <Text style={styles.date}>{localTime}</Text>
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
});
