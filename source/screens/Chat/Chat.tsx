import {StyleSheet, View, SafeAreaView, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Header} from './ui/Header';
import {Chat, useMessages, useMinChat} from '@minchat/reactnative';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import useRegistration from '../../hooks/useRegistration';

interface Props {
  route: {params: {username: string}};
}

export function ChatScreen({route}: Props) {
  const {currentUser} = useRegistration();

  const [chat, setChat] = useState<Chat | undefined>(undefined);
  const minchat = useMinChat();
  const {username} = route.params;

  const {messages, loading, error, sendMessage, paginate, paginateLoading} =
    useMessages(chat, true);

  const getChat = useCallback(async () => {
    const response = await minchat?.chat(username);
    if (response) {
      setChat(response);
    }
  }, [minchat, username]);

  useEffect(() => {
    getChat();
  }, [getChat]);

  const localMessages: IMessage[] = useMemo(() => {
    if (messages) {
      return messages.map(el => {
        const user = el.user;
        return {
          _id: el.id,
          text: el.text,
          createdAt: el.createdAt,
          user: {_id: user.username, name: user.name},
        } as IMessage;
      });
    }
    return [];
  }, [messages]);

  // console.log(messages);

  return (
    <SafeAreaView style={styles.root}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.container}>
          <Header onMenuPress={() => {}} />
          <GiftedChat
            loadEarlier
            infiniteScroll
            onLoadEarlier={() => {
              paginate();
              console.log('aaa');
            }}
            messages={localMessages}
            onSend={msgs => sendMessage({text: msgs[0].text ?? ''})}
            user={{_id: currentUser.id}}
          />
        </View>
      )}
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
