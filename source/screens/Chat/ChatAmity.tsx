import {
  MessageContentType,
  MessageRepository,
  SubChannelRepository,
  ChannelRepository,
} from '@amityco/ts-sdk';
import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  isSameUser,
} from 'react-native-gifted-chat';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LoadingView} from '../../components/loadingView';
import colors from '../../utils/colors';
import {defaultProfile} from '../../utils/images';
import {Header} from './ui/Header';
import useRegistration from '../../hooks/useRegistration';
import {apiUrl} from '../../api/serverRequests';
import useAppStateHook from '../../hooks/useAppState';

interface Props {
  route: {params: {channel: Amity.Channel}};
  navigation: NavigationProp<any>;
}

export function ChatScreen({route, navigation}: Props) {
  const {channel} = route.params;
  const {sendMessageAction} = useAppStateHook();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Amity.Channel>();
  const [loadingMore, setLoadingMore] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const onNextPage = useRef<() => void>();
  const {currentUser} = useRegistration();

  const [messages, setMessages] = useState<Amity.Message<'text'>[]>([]);

  useEffect(() => {
    if (channel?.defaultSubChannelId) {
      ChannelRepository.getChannel(
        route.params.channel?.defaultSubChannelId,
        channelData => {
          if (!channelData.loading) {
            setData(channelData?.data);
          }
        },
      );
    }
  }, [route.params]);

  useEffect(() => {
    SubChannelRepository.startReading(channel?.defaultSubChannelId);
    const msgSub = MessageRepository.getMessages(
      {subChannelId: channel?.defaultSubChannelId, limit: 18, type: 'text'},
      ({data, ...metadata}) => {
        if (!metadata.loading) {
          setLoading(false);
          setMessages(data as Amity.Message<'text'>[]);
        }
        setLoadingMore(metadata.loading);
        setHasNextPage(metadata.hasNextPage ?? false);

        onNextPage.current = metadata.onNextPage;
      },
    );

    return () => {
      msgSub();
      SubChannelRepository.stopReading(channel?.defaultSubChannelId);
    };
  }, [channel?.defaultSubChannelId]);

  const localMessages: IMessage[] = useMemo(() => {
    if (messages.length) {
      return messages.map(el => {
        return {
          _id: el.uniqueId,
          text: el.data?.text ?? '',
          createdAt: new Date(el.createdAt),
          user: {_id: el.creatorId, name: el.creatorId},
        } as IMessage;
      });
    }
    return [];
  }, [messages]);

  const sendMessage = async (msg: IMessage[]) => {
    const textMessage = {
      subChannelId: data?.channelId,
      dataType: MessageContentType.TEXT,
      data: {
        text: msg[0].text ?? '',
      },
      tags: [currentUser.id],
      metadata: {},
    };

    const {data: message} = await MessageRepository.createMessage(textMessage);
    const usersList = data?.metadata;
    const users = usersList?.users ?? [];
    const dataChannel = {
      users: users,
      messages: [
        {
          ...textMessage,
          channelId: data?.channelId,
          userId: currentUser.id,
        },
      ],
    };
    // console.log('data', channel);
    sendMessageAction(dataChannel);
    return message;
  };

  const usersList = data?.metadata;
  const users = usersList?.users ?? [];
  const anotherUser = users.find(user => user.id !== currentUser.id);

  return (
    <SafeAreaView style={styles.root}>
      {loading ? (
        <LoadingView />
      ) : (
        <View style={styles.container}>
          <Header
            withLine
            title={
              anotherUser?.userName ?? data?.displayName ?? data?.channelId
            }
            navigation={navigation}
            rightIcon={
              <FastImage
                source={
                  Boolean(anotherUser?.userImage)
                    ? {uri: apiUrl + anotherUser?.userImage}
                    : defaultProfile
                }
                defaultSource={defaultProfile}
                style={styles.avatar}
              />
            }
          />

          <GiftedChat
            alwaysShowSend
            loadEarlier={hasNextPage}
            messagesContainerStyle={{paddingBottom: 20}}
            listViewProps={{
              style: {paddingBottom: 30},
              showsVerticalScrollIndicator: false,
            }}
            isLoadingEarlier={loadingMore}
            placeholder="Message"
            timeFormat="HH:mm"
            onLoadEarlier={onNextPage.current}
            messages={localMessages}
            onSend={sendMessage}
            user={{_id: currentUser.id}}
            renderLoading={() => <ActivityIndicator />}
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
                      <Image
                        source={{uri: 'airplane'}}
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
                    // renderTime={}
                    {...message}
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
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
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
    borderTopColor: colors.gray200,
    backgroundColor: colors.white,
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
    backgroundColor: colors.gray200,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  friendMsgText: {
    color: colors.black,
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
    backgroundColor: colors.purple,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  myMsgText: {
    color: colors.white,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
  },
  input: {
    marginRight: 12,
    backgroundColor: colors.lightGray,
    flex: 1,
    borderRadius: 8,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  inputInner: {
    flex: 1,
    lineHeight: 0,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    // width: 44,
    // height: 44,
    padding: 12,
    backgroundColor: colors.orange,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
