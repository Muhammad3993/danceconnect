import { StyleSheet, Text } from 'react-native';
import React from 'react';
import {
  Channel,
  FileIcon,
  MessageInput,
  MessageList,
} from 'stream-chat-react-native';
import { StackScreenProps } from 'screens/interfaces';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InfoIcon } from 'components/icons/info';

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
