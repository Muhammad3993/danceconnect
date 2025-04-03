import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageIcon } from '@components/icons/message';
// import { MessageItem } from '../chat/ui';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@screens/interfaces';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function ChatsScreen({ navigation }: StackScreenProps<'chats'>) {
  const { t } = useTranslation();
  const { styles } = useStyles(styleSheet);

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

const styleSheet = createStyleSheet(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    paddingHorizontal: theme.spacing.LG,
  },
  messageTop: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: theme.spacing.LG,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.latoRegular,
  },
  messageBody: {
    gap: theme.spacing.XS,
  },
}));
