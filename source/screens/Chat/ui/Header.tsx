import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../../utils/colors';

export function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Messages</Text>
      <Image
        source={{uri: 'more'}}
        style={{width: 28, height: 28, tintColor: colors.black}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Mulish-Bold',
    fontSize: 20,
  },
});
