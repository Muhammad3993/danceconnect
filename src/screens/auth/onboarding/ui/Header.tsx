import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';

interface Props {
  title: string;
  description?: string;
}

export function Header({ description, title }: Props) {
  return (
    <View style={{ paddingHorizontal: theming.spacing.LG, marginBottom: 28 }}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theming.colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
  },
  description: {
    fontSize: 18,
    color: theming.colors.textPrimary,
    fontWeight: '500',
    lineHeight: 25.2,
    letterSpacing: 0.2,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 12,
  },
});
