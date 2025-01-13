import React from 'react';
import { Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface IProps {
  list: string[];
  shouldSlice?: boolean;
  backgroundColor?: string[];
}

export function TagsList({
  list,
  backgroundColor = [],
  shouldSlice = true,
}: IProps) {
  const slicedCategories = shouldSlice ? list.slice(0, 2) : list;
  const remainingCategoriesCount = list.length - slicedCategories.length;
  const { styles, theme } = useStyles(styleSheet);

  return (
    <View style={styles.itemTags}>
      {slicedCategories.map((category, i) => (
        <View
          style={[
            styles.itemTag,
            {
              backgroundColor: backgroundColor[i],
              borderColor: backgroundColor.length
                ? backgroundColor[i]
                : theme.colors.gray250,
            },
          ]}
          key={i}>
          <Text
            style={[
              styles.itemTagTitle,
              {
                color: backgroundColor.length
                  ? theme.colors.white
                  : theme.colors.secondary500,
              },
            ]}>
            {category}
          </Text>
        </View>
      ))}
      {remainingCategoriesCount > 0 && (
        <View style={styles.itemAnotherTag}>
          <Text style={styles.itemAnotherTagTitle}>
            +{remainingCategoriesCount}
          </Text>
        </View>
      )}
    </View>
  );
}

const styleSheet = createStyleSheet(theming => ({
  itemTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  itemTag: {
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  itemTagTitle: {
    color: theming.colors.secondary500,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: theming.fonts.latoRegular,
  },
  itemAnotherTag: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: theming.colors.gray75,
  },
  itemAnotherTagTitle: {
    color: theming.colors.darkGray,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: theming.fonts.latoRegular,
  },
}));
