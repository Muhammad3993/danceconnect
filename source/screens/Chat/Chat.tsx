import {Chat, useMessages, useMinChat} from '@minchat/reactnative';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  isSameUser,
} from 'react-native-gifted-chat';
import useRegistration from '../../hooks/useRegistration';
import colors from '../../utils/colors';
import {Header} from './ui/Header';

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

  return (
    <SafeAreaView style={styles.root}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.container}>
          <View style={{paddingHorizontal: 24}}>
            <Header onMenuPress={() => {}} />
          </View>
          <GiftedChat
            alwaysShowSend
            loadEarlier={localMessages.length % 25 === 0}
            infiniteScroll
            onLoadEarlier={paginate}
            messages={localMessages}
            onSend={msgs => sendMessage({text: msgs[0].text ?? ''})}
            user={{_id: currentUser.id}}
            renderLoading={() => <ActivityIndicator />}
            renderInputToolbar={props => {
              return (
                <InputToolbar
                  {...props}
                  containerStyle={styles.inputContainer}
                  renderSend={p => (
                    <Send {...p} containerStyle={styles.sendButton}>
                      <Image
                        source={{uri: 'edit'}}
                        style={{width: 20, height: 20}}
                      />
                    </Send>
                  )}
                />
              );
            }}
            renderMessage={message => {
              const currentMessage = message?.currentMessage;
              if (!currentMessage) {
                return null;
              }

              const isCurrUser = currentMessage.user._id === currentUser.id;
              const sameUser = isSameUser(
                message?.currentMessage,
                message.nextMessage,
              );

              return (
                <View
                  style={[
                    isCurrUser ? styles.right : styles.left,
                    {marginBottom: sameUser ? 2 : 10},
                  ]}>
                  <Bubble
                    {...message}
                    containerToNextStyle={{
                      left: styles.friendMsg,
                      right: styles.myMsg,
                    }}
                    containerToPreviousStyle={{
                      left: styles.friendMsg,
                      right: styles.myMsg,
                    }}
                    textStyle={{
                      left: styles.friendMsgText,
                      right: styles.myMsgText,
                    }}
                  />
                  {/* <View style={isCurrUser ? styles.myMsg : styles.friendMsg}>
                    <MessageText
                      {...message}
                      textStyle={{
                        left: styles.friendMsgText,
                        right: styles.myMsgText,
                      }}
                    />
                 </View> */}
                </View>
              );
            }}
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
  inputContainer: {
    borderRadius: 10,
    borderColor: colors.gray200,
    borderWidth: 1,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    height: 44,
    backgroundColor: colors.lightGray,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginRight: 0,
  },
  friendMsg: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.gray200,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  friendMsgText: {
    color: colors.black,
    fontFamily: 'Mulish-Regular',
    fontSize: 16,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 0,
    marginRight: 8,
  },
  myMsg: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.purple,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  myMsgText: {
    color: colors.white,
    fontFamily: 'Mulish-Regular',
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.orange,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
