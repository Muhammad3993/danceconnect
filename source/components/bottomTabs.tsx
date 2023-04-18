import React from 'react';
import * as RN from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import colors from '../utils/colors';
import {getIcon} from '../utils/helpers';

const BottomTabs = ({state, navigation, descriptors}: BottomTabBarProps) => {
  const tabs = state.routes;
  return (
    <RN.View style={styles.container}>
      {tabs.map((route, index) => {
        const {tabBarActiveTintColor, tabBarInactiveTintColor} =
          descriptors[route.key].options;
        const onPressTab = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        const isFocused = state.index === index;
        return (
          <RN.TouchableOpacity
            key={index}
            style={styles.itemContainer}
            onPress={onPressTab}>
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
    justifyContent: 'center',
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  itemContainer: {
    marginHorizontal: 20,
  },
  icon: {
    height: 24,
    width: 24,
  },
  itemName: {
    fontSize: 12,
    letterSpacing: -0.2,
  },
});
export default BottomTabs;
