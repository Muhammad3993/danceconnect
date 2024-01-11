import {Image, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React from 'react';
import colors from '../../utils/colors';

export function ChatsScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text>Messages</Text>
        <Image
          source={{uri: 'more'}}
          style={{width: 28, height: 28, tintColor: colors.black}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
