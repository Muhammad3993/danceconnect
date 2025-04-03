import { CommunitiesIcon } from '@components/icons/communities';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function CreateBanner() {
  const { styles } = useStyles(styleSheet);
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.boxCircleOpacity}>
          <View style={styles.boxCircle}>
            <CommunitiesIcon active fill={'white'} />
          </View>
        </View>
        <Text style={styles.title}>{t('create_community_card_title')}</Text>
        <Text style={styles.boxSubtitle}>{t('ds_desc_event')}</Text>
      </View>
    </View>
  );
}

const styleSheet = createStyleSheet(theme => ({
  container: { paddingHorizontal: theme.spacing.LG },
  box: {
    backgroundColor: theme.colors.transparentPurple,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.MD,
    borderRadius: 8,
  },

  boxCircleOpacity: {
    padding: 10,
    backgroundColor: theme.colors.lightPurple,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxCircle: {
    width: 46,
    height: 46,
    backgroundColor: theme.colors.secondary500,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.black,
    fontFamily: theme.fonts.latoRegular,
    marginTop: theme.spacing.XS,
  },
  boxSubtitle: {
    width: '90%',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: theme.fonts.latoRegular,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
}));
