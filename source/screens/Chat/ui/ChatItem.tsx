import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../../utils/colors';

interface Props {
  name: string;
  text: string;
}

export function ChatItem({name, text}: Props) {
  return (
    <View style={styles.item}>
      <View style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.message}>{text}</Text>
      </View>
      <Text style={styles.date}>20:49 PM</Text>
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
    backgroundColor: 'blue',
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
