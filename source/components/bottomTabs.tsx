import React from 'react';
import * as RN from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import colors from '../utils/colors';
import {getIcon} from '../utils/helpers';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const BottomTabs = ({state, navigation, descriptors}: BottomTabBarProps) => {
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const tabs = state.routes;

  return (
    <RN.View style={[styles.container, {paddingBottom: bottom}]}>
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
        const iconName = getIcon(
          t(`${route.name}_tab`).toLowerCase(),
          isFocused,
        );
        return (
          <RN.View style={styles.btn} key={index}>
            <RN.TouchableOpacity onPress={onPressTab}>
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
            </RN.TouchableOpacity>
          </RN.View>
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
    alignItems: 'center',
    paddingHorizontal: 14,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
  },
  btn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
