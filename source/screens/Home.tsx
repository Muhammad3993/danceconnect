import React from 'react';
import * as RN from 'react-native';
import useRegistration from '../hooks/useRegistration';
import {Button} from '../components/Button';

const HomeScreen = () => {
  const {logout, userName} = useRegistration();

  return (
    <RN.View>
      <RN.Text>{`welcome back, ${userName}`}</RN.Text>
      <Button title="Logout" onPress={logout} disabled={true} />
    </RN.View>
  );
};

export default HomeScreen;
