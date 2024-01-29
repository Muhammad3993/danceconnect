import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import colors from '../utils/colors';

interface Props {
  data: {text: string; containerStyle?: ViewStyle}[];
  currentTab: string;
  onPressTab: (val: string) => void;
  textStyle?: TextStyle;
  itemStyle?: ViewStyle;
  scrollStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  wrapperStyle?: ViewStyle;
  scrollEnabled?: boolean;
}

export function Tab({
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
          {data.map(item => {
            const active = currentTab === item.text;
            return (
              <TouchableOpacity
                onPress={() => onPressTab(item.text)}
                key={item.text}
                style={[
                  styles.item,
                  itemStyle,
                  item.containerStyle,
                  {borderBottomWidth: active ? 2 : 0},
                ]}>
                <Text
                  style={[
                    textStyle,
                    {color: active ? colors.purple : colors.darkGray},
                  ]}>
                  {item.text}
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
        renderItem={({item}) => {
          const active = currentTab === item.text;
          return (
            <TouchableOpacity
              onPress={() => onPressTab(item.text)}
              style={[
                styles.item,
                itemStyle,
                {borderBottomWidth: active ? 3 : 0},
              ]}>
              <Text
                style={[
                  textStyle,
                  {color: active ? colors.purple : colors.darkGray},
                ]}>
                {item.text}
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
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomColor: colors.purple,
  },
  tabsWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,

    // marginBottom: 14,
  },
});
