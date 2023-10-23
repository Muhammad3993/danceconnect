import React = require('react');
import * as RN from 'react-native';
import {SCREEN_WIDTH, statusBarHeight} from '../utils/constants';
import colors from '../utils/colors';
import useAppStateHook from '../hooks/useAppState';

export const Notice = () => {
  const {errorMessage, isVisible, setMessageNotice, setVisibleNotice} =
    useAppStateHook();
  RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  React.useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setVisibleNotice(false);
        setMessageNotice('');
      }, 5000);
    }
  }, [isVisible]);

  if (isVisible) {
    return (
      <RN.View style={styles.container}>
        <RN.Text style={styles.title}>
          {`${errorMessage}\nPlease try again later`}
        </RN.Text>
      </RN.View>
    );
  }

  return null;
};

const styles = RN.StyleSheet.create({
  container: {
    zIndex: 1,
    position: 'absolute',
    top: statusBarHeight,
    paddingVertical: 14,
    backgroundColor: '#f75555f7',
    // height: 40,
    width: SCREEN_WIDTH,
  },
  title: {
    fontSize: 18,
    color: colors.white,
    lineHeight: 20.4,
    textAlign: 'center',
  },
});
