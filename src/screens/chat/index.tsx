import {
  ChannelRepository,
  MessageContentType,
  MessageRepository,
  SubChannelRepository,
} from '@amityco/ts-sdk-react-native';
import { theming } from 'common/constants/theming';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  isSameUser,
} from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from 'screens/interfaces';
import { useDCStore } from 'store';

export function ChatScreen({ route }: StackScreenProps<'chat'>) {
  const user = useDCStore.use.user();
  const ref = useRef(false);
  const { channelId } = route.params;
  const [channelData, setChannelData] = useState<Amity.Channel<any> | null>(
    null,
  );
  const [messages, setMessages] = useState<Amity.Message<'text'>[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    SubChannelRepository.startMessageReceiptSync(channelId);
    const channelSub = ChannelRepository.getChannel(
      channelId,
      ({ data, loading }) => {
        if (!loading) {
          setChannelData(data);
        }
      },
    );

    const msgSub = MessageRepository.getMessages(
      { subChannelId: channelId, limit: 18, type: 'text' },
      ({ data: list, error, ...metadata }) => {
        if (!metadata.loading) {
          setMessages(list as Amity.Message<'text'>[]);
          console.log(error);
        }
      },
    );
    return () => {
      SubChannelRepository.startMessageReceiptSync(channelId);
      channelSub();
      msgSub();
    };
  }, [channelId]);

  const localMessages: IMessage[] = useMemo(() => {
    if (messages.length) {
      console.log(messages[0]);

      return messages.map(el => {
        return {
          _id: el.uniqueId,
          text: el.data?.text ?? '',
          createdAt: new Date(el.createdAt),
          user: { _id: el.creatorId, name: el.metadata?.name },
        } as IMessage;
      });
    }
    return [];
  }, [messages]);

  const sendMessage = async (msg: IMessage[]) => {
    try {
      const textMessage = {
        subChannelId: channelId,
        dataType: MessageContentType.TEXT,
        data: {
          text: msg[0].text ?? '',
        },
        metadata: {
          name: user?.userName,
        },
      };

      console.log(textMessage);

      const { data: message } = await MessageRepository.createMessage(
        textMessage,
      );
      return message;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <GiftedChat
        alwaysShowSend
        // loadEarlier={hasNextPage}
        messagesContainerStyle={{ paddingBottom: 20 }}
        listViewProps={{
          style: { paddingBottom: 30 },
          showsVerticalScrollIndicator: false,
        }}
        // isLoadingEarlier={loadingMore}
        placeholder="Message"
        timeFormat="HH:mm"
        // onLoadEarlier={onNextPage.current}
        messages={localMessages}
        onSend={sendMessage}
        user={{ _id: user?.id ?? '' }}
        renderLoading={() => <ActivityIndicator />}
        renderUsernameOnMessage={true}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={styles.inputContainer}
              renderComposer={p => (
                <View style={styles.input}>
                  <Composer {...p} textInputStyle={styles.inputInner} />
                </View>
              )}
              renderSend={p => (
                <Send {...p} containerStyle={styles.sendButton}>
                  <Text>S M</Text>
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

          const isCurrUser = currentMessage.user._id === user?.id;
          const sameUser = isSameUser(
            message?.currentMessage,
            message.nextMessage,
          );

          // const userName = currentMessage.user.name;

          return (
            <View
              key={message.key}
              style={[
                isCurrUser ? styles.right : styles.left,
                { marginBottom: sameUser ? 2 : 10 },
              ]}>
              <Bubble
                {...message}
                onDeletePress={MessageRepository.deleteMessage}
                showDeleteButton={isCurrUser}
                wrapperStyle={{
                  left: styles.friendMsg,
                  right: styles.myMsg,
                }}
                textStyle={{
                  left: styles.friendMsgText,
                  right: styles.myMsgText,
                }}
              />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginLeft: 'auto',
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },

  inputContainer: {
    borderTopColor: theming.colors.gray200,
    backgroundColor: theming.colors.white,
    paddingHorizontal: 24,
    paddingVertical: 6,
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
    backgroundColor: theming.colors.gray200,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  friendMsgText: {
    color: theming.colors.black,
    fontFamily: 'Lato-Regular',
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
    backgroundColor: theming.colors.purple,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  myMsgText: {
    color: theming.colors.white,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
  },
  input: {
    marginRight: 12,
    backgroundColor: theming.colors.lightGray,
    flex: 1,
    borderRadius: 8,
    minHeight: 44,
    borderWidth: 1,
    borderColor: theming.colors.gray,
  },
  inputInner: {
    flex: 1,
    // lineHeight: 0,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    color: theming.colors.textPrimary,
  },
  sendButton: {
    // width: 44,
    // height: 44,
    padding: 12,
    backgroundColor: theming.colors.orange,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: theming.theming.colors.white,
//   },
//   messageTop: {
//     height: 48,
//     paddingHorizontal: theming.spacing.LG,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderColor: theming.theming.colors.gray75,
//   },
//   messageTopTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: theming.theming.colors.textPrimary,
//     fontFamily: theming.fonts.latoRegular,
//   },
//   messageTopLeft: {
//     flexDirection: 'row',
//     gap: theming.spacing.MD,
//   },
//   messageTopRight: {
//     width: 40,
//     height: 40,
//   },
//   messageTopimg: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 50,
//   },
//   messageBottom: {
//     borderTopWidth: 1,
//     borderColor: theming.theming.colors.gray75,
//     paddingHorizontal: theming.spacing.LG,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     paddingVertical: 10,
//     marginTop: 10,
//   },
//   messageBody: {
//     flex: 1,
//     paddingHorizontal: theming.spacing.LG,
//     flexDirection: 'column-reverse',
//   },
//   messeage: {
//     maxWidth: '80%',
//     backgroundColor: theming.theming.colors.purple,
//     padding: 8,
//     borderRadius: 8,
//     marginTop: 5,
//   },
//   myMessage: {
//     alignSelf: 'flex-end',
//     borderTopRightRadius: 0,
//   },
//   anotherMessage: {
//     alignSelf: 'flex-start',
//     borderTopLeftRadius: 0,
//     backgroundColor: theming.theming.colors.gray50,
//   },
//   myMessageText: {
//     lineHeight: 22,
//     fontSize: 16,
//     fontWeight: '400',
//     color: theming.theming.colors.white,
//   },
//   anotherMessageText: {
//     lineHeight: 22,
//     fontSize: 16,
//     fontWeight: '400',
//     color: theming.theming.colors.black,
//   },
//   myMessageTime: {
//     fontSize: 12,
//     fontWeight: '400',
//     color: theming.theming.colors.secondary300,
//     marginTop: 5,
//     alignSelf: 'flex-end',
//   },
//   anotherMessageTime: {
//     fontSize: 12,
//     fontWeight: '400',
//     color: theming.theming.colors.gray400,
//     marginTop: 5,
//     alignSelf: 'flex-end',
//   },
//   messageDate: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theming.spacing.SM,
//     marginVertical: 15,
//   },
//   messageDateTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: theming.theming.colors.textSecondary,
//   },
//   messageDateLine: {
//     width: '100%',
//     height: 1,
//     backgroundColor: theming.theming.colors.gray50,
//     marginVertical: 5,
//     flex: 1,
//   },
//   link: {
//     color: theming.theming.colors.orange,
//     textDecorationLine: 'underline',
//   },
// });
