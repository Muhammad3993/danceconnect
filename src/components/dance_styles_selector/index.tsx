import React, { useState } from 'react';

import { theming } from 'common/constants/theming';
import { useDCStore } from 'store';
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DanceStyleGroup } from 'data/api/collections/interfaces';
import { CloseSmallIcon } from 'components/icons/close_small';
import { ArrowDownButtonIcon } from 'components/icons/arrow_down_button';

interface Props {
  value: string[];
  onChange: (newValue: string[]) => void;
  errorMessage?: string;
  scrollEnabled?: boolean;
}

export const DanceStylesSelector = ({
  onChange,
  value,
  errorMessage,
  scrollEnabled,
}: Props) => {
  const constants = useDCStore.use.constants();
  const danceStyles = constants?.danceStyles ?? [];

  const deleteStyle = (style: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    onChange(value.filter(el => el !== style));
  };

  const addStyle = (style: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    onChange([...new Set([...value, style])]);
  };

  return (
    <View style={styles.container}>
      {value.length > 0 && (
        <View style={styles.danceStyleContainer}>
          {value.map(item => {
            return (
              <TouchableOpacity
                key={item}
                style={styles.addedDanceStyleItem}
                onPress={() => deleteStyle(item)}>
                <Text style={styles.addedDanceStyleText}>{item}</Text>
                <CloseSmallIcon style={{ marginBottom: -1 }} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <FlatList
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        data={danceStyles}
        renderItem={({ item }) => {
          return (
            <StylesGroup onSelectItem={addStyle} value={value} group={item} />
          );
        }}
        keyExtractor={(item, index) => `${item}-${index}`}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  errorText: {
    color: theming.colors.redError,
    marginBottom: theming.spacing.MD,
  },
  container: {
    flex: 1,
    marginBottom: theming.spacing.MD,
    paddingHorizontal: theming.spacing.LG,
  },
  addedDanceStyleItem: {
    borderWidth: 1,
    borderColor: theming.colors.orange,
    borderRadius: 20,
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: theming.spacing.SM,
    alignItems: 'center',
  },
  addedDanceStyleText: {
    color: theming.colors.orange,
    fontSize: 14,
    letterSpacing: 0.2,
    marginRight: 6,
    fontWeight: '600',
    fontFamily: theming.fonts.latoRegular,
  },
  danceStyleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theming.spacing.MD,
    gap: theming.spacing.SM,
  },
  mainContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    marginBottom: 12,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 20,
  },
  itemTitle: {
    color: theming.colors.textPrimary,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightIcon: {
    height: 10,
    width: 12,
    margin: 2,
    tintColor: theming.colors.white,
  },

  animatedBody: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 16,
    maxWidth: 380,
    rowGap: 8,
    columnGap: 5,
  },
  danceStyleItem: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  danceStyleText: {
    fontSize: 14,
    lineHeight: 14.9,
    fontWeight: '600',
    letterSpacing: 0.2,
    fontFamily: theming.fonts.latoRegular,
  },
});

interface StylesGroupProps {
  group: DanceStyleGroup;
  value: string[];
  onSelectItem: (newValue: string) => void;
}

export function StylesGroup({ group, value, onSelectItem }: StylesGroupProps) {
  const [expand, setExpand] = useState(false);
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.titleWrapper}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpand(!expand);
        }}
        activeOpacity={0.7}>
        <View style={{ justifyContent: 'center' }}>
          <Text style={styles.itemTitle}>{group.title}</Text>
        </View>
        <ArrowDownButtonIcon
          style={{ transform: [{ rotate: `${expand ? 0 : 180}deg` }] }}
        />
      </TouchableOpacity>
      {expand && (
        <View style={styles.animatedBody}>
          {group.items.map(dStyle => {
            const isAvailable = value.includes(dStyle);
            return (
              <TouchableOpacity
                key={dStyle}
                style={[
                  styles.danceStyleItem,
                  {
                    borderColor: isAvailable
                      ? theming.colors.orange
                      : theming.colors.darkGray,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => onSelectItem(dStyle)}>
                <Text
                  style={[
                    styles.danceStyleText,
                    {
                      color: isAvailable
                        ? theming.colors.orange
                        : theming.colors.darkGray,
                    },
                  ]}>
                  {dStyle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default DanceStylesSelector;
