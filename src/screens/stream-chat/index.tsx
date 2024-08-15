import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import React from 'react';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
} from 'stream-chat-react-native';
import { client } from 'common/libs/strem-chat';
import { StackScreenProps } from 'screens/interfaces';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ChatScreen2({ route }: StackScreenProps<'chat'>) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Channel channel={route.params.channel}>
        <MessageList />
        <MessageInput />
      </Channel>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
