import {StyleSheet, View, SafeAreaView, FlatList} from 'react-native';
import React from 'react';
import {Header} from './ui/Header';
import {ChatItem} from './ui/ChatItem';

export function ChatsScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Header />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={Array(10).fill(null)}
          renderItem={({}) => <ChatItem />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Mulish-Bold',
    fontSize: 20,
  },
});
