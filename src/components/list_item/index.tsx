import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { ReactNode } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface ListItemProps {
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  leftIcon?: ReactNode;
  title?: ReactNode;
  count?: ReactNode;
  rightIcon?: ReactNode;
  click?: () => void;
}

export const ListItem = ({
  containerStyle,
  titleStyle,
  leftIcon,
  title,
  count,
  click,
  rightIcon,
}: ListItemProps) => {
  const { styles, theme } = useStyles(styleSheet);
  return (
    <TouchableOpacity style={[styles.listItem, containerStyle]} onPress={click}>
      <View style={styles.listItemWrapper}>
        {leftIcon}
        <Text style={[styles.listItemTitle, titleStyle]}>
          {title}{' '}
          <Text style={{ color: theme.colors.darkGray, fontWeight: '400' }}>
            {count}
          </Text>
        </Text>
      </View>

      {rightIcon}
    </TouchableOpacity>
  );
};

const styleSheet = createStyleSheet(theming => ({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  listItemTitle: {
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
    fontSize: 18,
  },
}));
