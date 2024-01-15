import {useChats} from '@minchat/reactnative';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {ChatItem} from './ui/ChatItem';
import {Header} from './ui/Header';

export function ChatsScreen({navigation}: any) {
  const {chats, loading, paginate} = useChats();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Header onMenuPress={() => {}} />

        {loading ? (
          <View>
            <ActivityIndicator size={'large'} />
          </View>
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
              const avatar = item.getChatAvatar();

              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('Chat', {chat: item});
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
