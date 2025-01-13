import { DCButton } from 'components/shared/button';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function CountryBottomSheet({ setContent }: any) {
  return (
    <View>
      <DCButton onPress={() => setContent('main')}>←</DCButton>
      <Text>CountryBottomSheet</Text>
    </View>
  );
}

const styleSheet = createStyleSheet({});
