import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

interface Props {
  canGoBack: boolean;
}

export function BackIcon({canGoBack}: Props) {
  const nanvigation = useNavigation();

  const goBack = () => {
    if (canGoBack) {
      nanvigation.goBack();
    } else {
      nanvigation.navigate('TABS');
    }
  };

  return (
    <TouchableOpacity onPress={goBack}>
      <Image source={{uri: 'backicon'}} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {height: 16, width: 19},
});
