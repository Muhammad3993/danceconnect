import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export function NavigationBackIcon() {
  const navigation = useNavigation();

  if (navigation.canGoBack()) {
    return (
      <TouchableOpacity onPress={navigation.goBack}>
        <ArrowLeftIcon />
      </TouchableOpacity>
    );
  }

  return null;
}
