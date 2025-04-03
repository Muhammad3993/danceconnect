import { Text, View, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { FilterIcon } from '@components/icons/filter';
import { RightArrowIcon } from '@components/icons/rightArrow';
import { useTranslation } from 'react-i18next';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface FilterComponentProps {
  containerStyle?: ViewStyle;
  title?: ReactNode;
}

export const FilterComponent = ({
  title,
  containerStyle,
}: FilterComponentProps) => {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(styleSheet);

  return (
    <View style={[styles.filter, containerStyle]}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.filterBtn}>
        <FilterIcon />
        <Text style={styles.filterBtnTitle}>{t('filters')}</Text>
        <RightArrowIcon
          stroke={theme.colors.textPrimary}
          style={{ transform: [{ rotate: '90deg' }] }}
        />
      </View>
    </View>
  );
};

const styleSheet = createStyleSheet(theming => ({
  filter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theming.colors.gray75,
    paddingHorizontal: theming.spacing.MD,
    paddingVertical: theming.spacing.XS,
    borderRadius: 100,
  },
  filterBtnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theming.colors.darkGray,
  },
}));
