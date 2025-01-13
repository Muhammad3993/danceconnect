import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { DCRoundIcon } from '../round_icon';
import { CommunitiesIcon } from 'components/icons/communities';
import { DCButton } from '../button';
import { useTranslation } from 'react-i18next';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface Props {
  containerStyle?: ViewStyle;
}

export const JoinCommunityCard = ({ containerStyle }: Props) => {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(styleSheet);

  return (
    <View style={[styles.homeEventsFree, containerStyle]}>
      <DCRoundIcon
        icon={<CommunitiesIcon active fill={theme.colors.white} />}
        iconBoxStyle={styles.icon}
      />
      <Text style={styles.homeEventsFreeTitle}>
        {t('join_community_card_first')}
      </Text>
      <Text style={styles.homeEventsFreeSubtitle}>
        {t('join_community_card_second')}
      </Text>
      <View style={{ marginTop: theme.spacing.MD }}>
        <DCButton
          variant="primary"
          containerStyle={{ paddingHorizontal: theme.spacing.MD }}>
          {t('join_community_card_btn')}
        </DCButton>
      </View>
    </View>
  );
};

const styleSheet = createStyleSheet(theme => ({
  icon: { width: 44, height: 44, backgroundColor: theme.colors.secondary500 },
  homeEventsFree: {
    paddingVertical: theme.spacing.LG,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray250,
    borderRadius: theme.spacing.XS,
    backgroundColor: theme.colors.white,
  },
  homeEventsFreeTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: theme.fonts.latoRegular,
    marginTop: 7,
  },
  homeEventsFreeSubtitle: {
    width: '90%',
    color: theme.colors.gray700,
    fontWeight: '400',
    fontSize: 14,
    fontFamily: theme.fonts.latoRegular,
    marginTop: 3,
    textAlign: 'center',
  },
}));
