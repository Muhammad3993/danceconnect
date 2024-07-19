import {
  FlatList,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';

interface Props {
  data: ({ text: string; containerStyle?: ViewStyle } | string)[];
  currentTab: string;
  onPressTab: (val: string) => void;
  textStyle?: TextStyle;
  itemStyle?: ViewStyle;
  scrollStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  wrapperStyle?: ViewStyle;
  scrollEnabled?: boolean;
}

export function DCTabs({
  data,
  currentTab,
  onPressTab,
  textStyle,
  scrollStyle,
  itemStyle,
  containerStyle,
  scrollEnabled = true,
  wrapperStyle,
}: Props) {
  if (!scrollEnabled) {
    return (
      <View style={containerStyle}>
        <View style={styles.tabsWrapper}>
          {data?.map(item => {
            const text = typeof item === 'string' ? item : item.text;
            const active = currentTab === text;
            return (
              <TouchableOpacity
                onPress={() => onPressTab(text)}
                key={text}
                style={[
                  styles.item,
                  itemStyle,
                  typeof item !== 'string' && item.containerStyle,
                  { borderBottomWidth: active ? 2 : 0 },
                ]}>
                <Text
                  style={[
                    textStyle,
                    {
                      color: active
                        ? theming.colors.purple
                        : theming.colors.darkGray,
                    },
                  ]}>
                  {text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.tabsWrapper, wrapperStyle]}>
      <FlatList
        style={scrollStyle}
        data={data}
        contentContainerStyle={containerStyle}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const text = typeof item === 'string' ? item : item.text;

          const active = currentTab === text;
          return (
            <TouchableOpacity
              onPress={() => onPressTab(text)}
              style={[
                styles.item,
                itemStyle,
                { borderBottomWidth: active ? 3 : 0 },
              ]}>
              <Text
                style={[
                  textStyle,
                  {
                    color: active
                      ? theming.colors.purple
                      : theming.colors.darkGray,
                  },
                ]}>
                {text}
              </Text>
            </TouchableOpacity>
          );
        }}
        horizontal
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignSelf: 'center',
    paddingBottom: theming.spacing.SM,
    borderBottomColor: theming.colors.purple,
  },
  tabsWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theming.colors.gray,
  },
});
