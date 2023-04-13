import React from 'react';
import * as RN from 'react-native';
import useRegistration from '../hooks/useRegistration';
import {Button} from '../components/Button';

const HomeScreen = () => {
  const {logout} = useRegistration();

  return (
    <RN.View>
      <RN.Text>home screen</RN.Text>
      <Button title="Logout" onPress={logout} disabled={true} />
    </RN.View>
  );
};

export default HomeScreen;
