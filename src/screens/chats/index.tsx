import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageIcon } from 'components/icons/message';
import { theming } from 'common/constants/theming';
// import { MessageItem } from '../chat/ui';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from 'screens/interfaces';

export function ChatsScreen({ navigation }: StackScreenProps<'chats'>) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.messageTop}>
        <Text style={styles.messageTitle}>{t('messages')}</Text>
        <MessageIcon />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.messageBody}>
          {/* <MessageItem click={() => navigation.navigate('message')} /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  container: {
    paddingHorizontal: theming.spacing.LG,
  },
  messageTop: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: theming.spacing.LG,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
  },
  messageBody: {
    gap: theming.spacing.XS,
  },
});
