import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { ReactNode } from 'react';
import { theming } from 'common/constants/theming';

interface ListItemProps {
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  leftIcon?: ReactNode;
  title?: ReactNode;
  count?: ReactNode;
  location?: ReactNode;
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
  location,
  rightIcon,
}: ListItemProps) => {
  return (
    <TouchableOpacity style={[styles.listItem, containerStyle]} onPress={click}>
      <View style={styles.listItemWrapper}>
        {leftIcon}
        <Text style={[styles.listItemTitle, titleStyle]}>
          {title}
          <Text style={{ color: theming.colors.darkGray, fontWeight: '400' }}>
            {count}
          </Text>
        </Text>
      </View>
      <Text style={styles.listItemLocation}>{location}</Text>
      {rightIcon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  listItemLocation: {
    fontSize: 14,
    color: theming.colors.gray700,
    fontWeight: '400',
    fontFamily: theming.fonts.latoRegular,
  },
  listItemTitle: {
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
    fontSize: 18,
    fontWeight: '600',
  },
});
