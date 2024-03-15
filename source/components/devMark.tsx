import React from 'react';
import * as RN from 'react-native';
import {statusBarHeight} from '../utils/constants';
import colors from '../utils/colors';

const DevMark = () => {
  return (
    <RN.View style={styles.container}>
      <RN.Text style={styles.text}>dev mode</RN.Text>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    zIndex: 99,
    position: 'absolute',
    top: statusBarHeight - 14,
    backgroundColor: colors.orange,
    borderRadius: 4,
    left: 14,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
export default DevMark;
