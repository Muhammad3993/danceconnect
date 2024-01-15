import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {Header} from './ui/Header';
import {ChatItem} from './ui/ChatItem';
import {useChats, useMinChat} from '@minchat/reactnative';

export function ChatsScreen({navigation}: any) {
  const {chats, loading, error, paginate, paginateLoading} = useChats();
  const minchat = useMinChat();

  const goToChat = async () => {
    try {
      const otherUser = await minchat?.createUser({
        username: 'micheal',
        name: 'Micheal Saunders',
      });
      if (otherUser) {
        navigation.push('Chat', {username: otherUser.username});
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Header onMenuPress={() => {}} />

        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={chats}
            onEndReached={paginate}
            renderItem={({item}) => {
              const lastMessage = item.getLastMessage();
              const title = item.getTitle();
              return (
                <TouchableOpacity onPress={goToChat}>
                  <ChatItem name={title} text={lastMessage?.text ?? ''} />
                </TouchableOpacity>
              );
            }}
          />
        )}
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
