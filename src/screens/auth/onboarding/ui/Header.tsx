import { Text, View } from 'react-native';
import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface Props {
  title: string;
  description?: string;
}

export function Header({ description, title }: Props) {
  const { styles, theme } = useStyles(styleSheet);

  return (
    <View
      style={{
        paddingHorizontal: theme.spacing.LG,
        marginBottom: theme.spacing.MD,
      }}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styleSheet = createStyleSheet(theming => ({
  title: {
    color: theming.colors.textPrimary,
    fontSize: 30,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    marginBottom: theming.spacing.MD,
  },
  description: {
    fontSize: 18,
    color: theming.colors.textPrimary,
    fontWeight: '500',
    lineHeight: 25.2,
    letterSpacing: 0.2,
    fontFamily: theming.fonts.latoRegular,
  },
}));
