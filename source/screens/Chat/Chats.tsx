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
  const {chats, loading, paginate} = useChats();
  const minchat = useMinChat();

  const goToChat = async (id: string) => {
    try {
      const otherUser = await minchat?.fetchUserById(id);

      navigation.push('Chat', {username: otherUser?.username});
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
            onEndReachedThreshold={0.3}
            onEndReached={() => {
              if ((chats?.length ?? 0) >= 25) {
                paginate();
              }
            }}
            renderItem={({item}) => {
              const lastMessage = item.getLastMessage();
              const title = item.getTitle();
              const ids = item.getMemberIds();
              const avatar = item.getChatAvatar();

              return (
                <TouchableOpacity
                  onPress={() => {
                    console.log(ids);

                    if (ids) {
                      goToChat(ids[0]);
                    }
                  }}>
                  <ChatItem
                    avatar={avatar}
                    name={title}
                    text={lastMessage?.text ?? ''}
                    date={
                      lastMessage?.createdAt
                        ? new Date(lastMessage?.createdAt)
                        : new Date()
                    }
                  />
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
