import React from 'react';
import * as RN from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import colors from '../utils/colors';
import {getIcon} from '../utils/helpers';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SCREEN_WIDTH} from '../utils/constants';

const BottomTabs = ({state, navigation}: BottomTabBarProps) => {
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const tabs = state.routes;

  // I PUT IT  TERNARY BECAUSE IN OLDER IPHONES YOU DON'T HAVE BOTTOM SAFEAREA AND ANDROID TOO
  // AND IT LOOOKS LIKE ICONS ARE STICKY ON BOTTOM
  return (
    <RN.View
      style={[styles.container, {paddingBottom: bottom == 0 ? 8 : bottom}]}>
      {tabs.map((route, index) => {
        // const {tabBarActiveTintColor, tabBarInactiveTintColor} =
        //   descriptors[route.key].options;
        const tabBarActiveTintColor = colors.orange;
        const tabBarInactiveTintColor = colors.grayScale;
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
        const iconName = getIcon(
          t(`${route.name}_tab`).toLowerCase(),
          isFocused,
        );
        return (
          <RN.TouchableOpacity
            key={index}
            onPress={onPressTab}
            style={{flex: 2}}>
            <RN.View style={{alignSelf: 'center'}}>
              <RN.Image
                resizeMode={'contain'}
                source={{uri: iconName}}
                style={[
                  styles.icon,
                  {
                    tintColor: isFocused
                      ? tabBarActiveTintColor
                      : tabBarInactiveTintColor,
                  },
                ]}
              />
            </RN.View>
            <RN.View style={{alignSelf: 'center'}}>
              <RN.Text
                style={[
                  {
                    color: isFocused
                      ? tabBarActiveTintColor
                      : tabBarInactiveTintColor,
                  },
                  styles.itemName,
                ]}>
                {t(route.name.toLowerCase() + '_tab')}
              </RN.Text>
            </RN.View>
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
    // paddingHorizontal: 16,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  btn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 24,
    width: 24,
  },
  itemName: {
    fontSize: SCREEN_WIDTH <= 375 ? 10 : 12,
    fontFamily: 'Lato-Regular',
  },
});
export default BottomTabs;
