import React from 'react';
import * as RN from 'react-native';
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import colors from '../utils/colors';
import {getIcon} from '../utils/helpers';
import {isAndroid} from '../utils/constants';

const BottomTabs = ({state, navigation, descriptors}: BottomTabBarProps) => {
  const tabs = state.routes;
  const focusedOptions = descriptors[state.routes[state.index].key]
    .options as BottomTabNavigationOptions;
  const display = focusedOptions.tabBarStyle?.display;
  return (
    <RN.View style={[styles.container, {display}]}>
      {tabs.map((route, index) => {
        const {tabBarActiveTintColor, tabBarInactiveTintColor} =
          descriptors[route.key].options;
        const onPressTab = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (route.state?.routeNames?.length > 1) {
            navigation.navigate(route.state?.routeNames[0]);
          }
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        const isFocused = state.index === index;
        return (
          <RN.TouchableOpacity key={index} onPress={onPressTab}>
            <RN.View style={{alignSelf: 'center'}}>
              <RN.Image
                resizeMode={'contain'}
                source={{uri: getIcon(route.name, isFocused)}}
                style={styles.icon}
              />
            </RN.View>
            <RN.Text
              style={[
                {
                  color: isFocused
                    ? tabBarActiveTintColor
                    : tabBarInactiveTintColor,
                },
                styles.itemName,
              ]}>
              {route?.name}
            </RN.Text>
          </RN.TouchableOpacity>
        );
      })}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 14,
    // justifyContent: 'center',
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingBottom: isAndroid ? 0 : 30,
  },
  icon: {
    height: 20,
    width: 20,
  },
  itemName: {
    fontSize: 12,
  },
});
export default BottomTabs;
