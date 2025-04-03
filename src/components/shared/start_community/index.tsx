import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { DCRoundIcon } from '../round_icon';
import { CommunitiesIcon } from '@components/icons/communities';
import { PlusIcon } from '@components/icons/plus';
import { RightArrowIcon } from '@components/icons/rightArrow';
import { useTranslation } from 'react-i18next';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface StartCommunityProps {
  containerStyle?: ViewStyle;
  onPress?: () => void;
}

export function StartCommunity({
  containerStyle,
  onPress,
}: StartCommunityProps) {
  const { styles, theme } = useStyles(styleSheet);

  const { t } = useTranslation();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.box, containerStyle]}>
      <View style={styles.boxIcon}>
        <DCRoundIcon
          icon={<CommunitiesIcon active fill={theme.colors.white} />}
          iconBoxStyle={styles.icon}
        />
        <View style={styles.boxPlusIcon}>
          <PlusIcon />
        </View>
      </View>

      <View style={{ width: '77%', flex: 1 }}>
        <Text style={styles.boxTitle}>{t('create_community_first')}</Text>
        <Text style={styles.boxSubtitle}>{t('create_community_second')}</Text>
      </View>

      <View>
        <RightArrowIcon />
      </View>
    </TouchableOpacity>
  );
}

const styleSheet = createStyleSheet(theme => ({
  box: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.lightPurple,
    borderWidth: 1,
    borderColor: theme.colors.gray75,
    borderRadius: theme.spacing.XS,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  boxIcon: {
    width: 44,
    position: 'relative',
  },
  icon: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.secondary500,
  },
  boxPlusIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.secondary500,
    borderRadius: 50,
    position: 'absolute',
    right: 0,
  },
  boxTitle: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: 18,
    fontFamily: theme.fonts.latoRegular,
  },
  boxSubtitle: {
    color: theme.colors.gray700,
    fontWeight: '400',
    fontSize: 14,
    fontFamily: theme.fonts.latoRegular,
  },
}));
