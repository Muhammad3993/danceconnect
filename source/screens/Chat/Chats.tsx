import {useChats} from '@minchat/reactnative';
import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ChatItem} from './ui/ChatItem';
import colors from '../../utils/colors';
import {Header} from './ui/Header';
import {LoadingView} from '../../components/loadingView';

export function ChatsScreen({navigation}: any) {
  const {chats, loading, paginate, error, paginateLoading} = useChats();

  if (error) {
    return (
      <View style={styles.loader}>
        <Text>{error?.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Header
          title="Messages"
          navigation={navigation}
          rightIcon={
            <TouchableOpacity style={{marginLeft: 'auto'}} onPress={() => {}}>
              <Image
                source={{uri: 'more'}}
                style={{width: 28, height: 28, tintColor: colors.black}}
              />
            </TouchableOpacity>
          }
        />

        {loading ? (
          <LoadingView />
        ) : (
          <FlatList
            style={{padding: 24}}
            showsVerticalScrollIndicator={false}
            data={chats}
            onEndReachedThreshold={0.3}
            onEndReached={() => {
              if ((chats?.length ?? 0) >= 25 && !paginateLoading) {
                paginate();
              }
            }}
            renderItem={({item}) => {
              const lastMessage = item.getLastMessage();
              const title = item.getTitle();
              const avatar = item.getChatAvatar();

              return (
                <TouchableOpacity
                  onPress={() => navigation.push('Chat', {chat: item})}>
                  <ChatItem
                    seen={lastMessage?.seen ?? false}
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
    paddingTop: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Mulish-Bold',
    fontSize: 20,
    marginLeft: 16,
  },
  headerLeft: {flexDirection: 'row', alignItems: 'center'},
  backIcon: {
    height: 20,
    width: 24,
  },
});
