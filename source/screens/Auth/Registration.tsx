import React from 'react';
import * as RN from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigationParamList} from '../../navigation/types';

const RegistraionScreen = (): JSX.Element => {
  const navigation = useNavigation<AuthStackNavigationParamList>();

  const goToAuth = () => {
    navigation.navigate('AUTH');
  };
  return (
    <RN.View style={styles.container}>
      <RN.Text>RegistrationScreen</RN.Text>
      <RN.TouchableOpacity style={styles.btn} onPress={goToAuth}>
        <RN.Text>go to auth screen</RN.Text>
      </RN.TouchableOpacity>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 14,
  },
  btn: {
    margin: 14,
    backgroundColor: 'lightgray',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
});
export default RegistraionScreen;
