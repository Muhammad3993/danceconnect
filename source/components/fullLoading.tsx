import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import useAppStateHook from '../hooks/useAppState';

const FullLoading = () => {
  const {onLoading} = useAppStateHook();
  const [loading, setLoading] = useState(onLoading);
  useEffect(() => {
    setLoading(onLoading);
    // console.log('FullLoading', onLoading);
  }, [onLoading]);

  if (loading) {
    return (
      <RN.View style={styles.container}>
        <RN.ActivityIndicator size={'large'} color={colors.orange} />
      </RN.View>
    );
  }
  return null;
};

const styles = RN.StyleSheet.create({
  container: {
    zIndex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
export default FullLoading;
