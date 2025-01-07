import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theming } from 'common/constants/theming';

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
                : theming.colors.gray250,
            },
          ]}
          key={i}>
          <Text
            style={[
              styles.itemTagTitle,
              {
                color: backgroundColor.length
                  ? theming.colors.white
                  : theming.colors.purple,
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

const styles = StyleSheet.create({
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
    color: theming.colors.purple,
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
});
