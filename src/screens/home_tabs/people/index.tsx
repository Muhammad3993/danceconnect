import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { MessageIcon } from 'components/icons/message';
import { images } from 'common/resources/images';
import { MessageItem } from 'components/message_item';

export function PeopleScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.messageTop}>
        <Text style={styles.messageTitle}>Messages</Text>
        <MessageIcon />
      </View>
      <ScrollView style={styles.container}>

        <View style={styles.messageBody}>

          <MessageItem />
          <MessageItem />
          <MessageItem />
          <MessageItem />
          <MessageItem />
          <MessageItem />
          <MessageItem />
          <MessageItem />
          <MessageItem />
          <MessageItem />
          <MessageItem />
          <MessageItem />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  container: {
    paddingHorizontal: theming.spacing.LG
  },
  messageTop: {
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: theming.spacing.LG
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
  },
  messageBody: {
    gap: theming.spacing.SM,
  },

});
