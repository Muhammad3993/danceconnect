import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from 'screens/interfaces';
import { ChannelList } from 'stream-chat-react-native';

export function ChatsScreen({ navigation }: StackScreenProps<'chats'>) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChannelList onSelect={channel => navigation.push('chat', { channel })} />
    </SafeAreaView>
  );
}
