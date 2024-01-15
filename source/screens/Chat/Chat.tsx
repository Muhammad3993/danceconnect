import {Chat, useMessages} from '@minchat/reactnative';
import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  isSameUser,
} from 'react-native-gifted-chat';
import useRegistration from '../../hooks/useRegistration';
import colors from '../../utils/colors';
import {NavigationProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {apiUrl} from '../../api/serverRequests';
import {defaultProfile} from '../../utils/images';
import FastImage from 'react-native-fast-image';

interface Props {
  route: {params: {chat: Chat}};
  navigation: NavigationProp<any>;
}

export function ChatScreen({route, navigation}: Props) {
  const {currentUser} = useRegistration();
  const {chat} = route.params;
  const {messages, loading, sendMessage, error, paginate, paginateLoading} =
    useMessages(chat, true);

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

  const title = chat.getTitle();
  const avatar = chat.getChatAvatar();

  if (error) {
    return (
      <View style={styles.loader}>
        <Text>{error?.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={navigation.goBack}>
              <View style={styles.headerLeft}>
                <Image source={{uri: 'backicon'}} style={styles.backIcon} />
                <Text style={styles.headerTitle}>{title}</Text>
              </View>
            </TouchableOpacity>

            <FastImage
              source={avatar ? {uri: apiUrl + avatar} : undefined}
              defaultSource={defaultProfile}
              style={styles.avatar}
            />
          </View>
          <GiftedChat
            alwaysShowSend
            loadEarlier={
              localMessages.length > 0 && localMessages.length % 25 === 0
            }
            messagesContainerStyle={{paddingBottom: 20}}
            listViewProps={{style: {paddingBottom: 30}}}
            isLoadingEarlier={paginateLoading}
            placeholder="Messsage"
            onLoadEarlier={paginateLoading ? undefined : paginate}
            messages={localMessages}
            onSend={msgs => sendMessage({text: msgs[0].text ?? ''})}
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
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 5,
    alignItems: 'center',
    borderBottomColor: colors.gray200,
    borderBottomWidth: 1,
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginLeft: 'auto',
  },
  container: {
    flex: 1,
    paddingVertical: 16,
  },

  inputContainer: {
    borderTopColor: colors.gray200,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 8,
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
  input: {
    marginRight: 12,
    backgroundColor: colors.lightGray,
    flex: 1,
    borderRadius: 8,
    minHeight: 44,
  },
  inputInner: {
    flex: 1,
    lineHeight: 0,
    fontFamily: 'Mulish',
    fontSize: 16,
    maxHeight: 120,
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
