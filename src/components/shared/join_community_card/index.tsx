import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { DCRoundIcon } from '../round_icon';
import { CommunitiesIcon } from 'components/icons/communities';
import { theming } from 'common/constants/theming';
import { DCButton } from '../button';
import { useTranslation } from 'react-i18next';

interface Props {
  containerStyle?: ViewStyle;
}

export const JoinCommunityCard = ({ containerStyle }: Props) => {
  const { t } = useTranslation();
  return (
    <View style={[styles.homeEventsFree, containerStyle]}>
      <DCRoundIcon
        icon={<CommunitiesIcon active fill={theming.colors.white} />}
        iconBoxStyle={styles.icon}
      />
      <Text style={styles.homeEventsFreeTitle}>
        {t('join_community_card_first')}
      </Text>
      <Text style={styles.homeEventsFreeSubtitle}>
        {t('join_community_card_second')}
      </Text>
      <View style={{ marginTop: theming.spacing.MD }}>
        <DCButton
          variant="primary"
          containerStyle={{ paddingHorizontal: theming.spacing.MD }}>
          {t('join_community_card_btn')}
        </DCButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: { width: 44, height: 44, backgroundColor: theming.colors.secondary500 },
  homeEventsFree: {
    paddingVertical: theming.spacing.LG,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: theming.spacing.XS,
    backgroundColor: theming.colors.white,
  },
  homeEventsFreeTitle: {
    color: theming.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    marginTop: 7,
  },
  homeEventsFreeSubtitle: {
    width: '90%',
    color: theming.colors.gray700,
    fontWeight: '400',
    fontSize: 14,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 3,
    textAlign: 'center',
  },
});
