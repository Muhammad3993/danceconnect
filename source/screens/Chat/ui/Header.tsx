import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';
import colors from '../../../utils/colors';
import {NavigationProp} from '@react-navigation/native';

interface Props {
  title: string;
  navigation: NavigationProp<any>;
  rightIcon: ReactNode;
  withLine?: boolean;
}

export function Header({
  title,
  navigation,
  rightIcon,
  withLine = false,
}: Props) {
  return (
    <View
      style={[
        styles.header,
        withLine && {borderBottomColor: colors.gray200, borderBottomWidth: 1},
      ]}>
      <TouchableOpacity onPress={navigation.goBack}>
        <View style={styles.headerLeft}>
          <Image source={{uri: 'backicon'}} style={styles.backIcon} />
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </TouchableOpacity>

      {rightIcon}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 5,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Mulish-Bold',
    fontSize: 20,
    marginLeft: 16,
  },
  headerLeft: {flexDirection: 'row', alignItems: 'center'},
  backIcon: {
    height: 16,
    width: 20,
  },
});
