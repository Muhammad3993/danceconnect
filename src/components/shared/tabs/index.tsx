import {
  FlatList,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

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
  const { styles, theme } = useStyles(styleSheet);

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
                      fontFamily: theme.fonts.latoRegular,
                      fontWeight: '600',
                      color: active
                        ? theme.colors.secondary500
                        : theme.colors.darkGray,
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
                    fontFamily: theme.fonts.latoRegular,
                    fontWeight: '600',
                    color: active
                      ? theme.colors.secondary500
                      : theme.colors.darkGray,
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

const styleSheet = createStyleSheet(theme => ({
  item: {
    alignSelf: 'center',
    paddingBottom: theme.spacing.XS,
    borderBottomColor: theme.colors.secondary500,
  },
  tabsWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
  },
}));
