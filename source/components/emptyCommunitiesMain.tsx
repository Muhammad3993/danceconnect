import React from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';

type props = {
  onPressButton: () => void;
};
const EmptyContainer = ({onPressButton}: props) => {
  return (
    <RN.View style={styles.container}>
      <RN.View style={styles.imageCircle}>
        <RN.Image source={{uri: 'comfull'}} style={styles.image} />
      </RN.View>
      <RN.Text style={styles.joinText}>Join a community</RN.Text>
      <RN.Text style={styles.joinDesc}>
        to see and attend upcoming events that you interested in
      </RN.Text>
      <RN.TouchableOpacity
        style={styles.joinBtn}
        activeOpacity={0.8}
        onPress={onPressButton}>
        <RN.Text style={styles.joinBtnText}>Search for a community</RN.Text>
      </RN.TouchableOpacity>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: 12,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 8,
  },
  image: {
    height: 26,
    width: 26,
    tintColor: colors.white,
  },
  imageCircle: {
    backgroundColor: colors.purple,
    marginTop: 26,
    padding: 10,
    borderRadius: 50,
  },
  joinText: {
    fontSize: 18,
    lineHeight: 21.6,
    fontWeight: '700',
    paddingTop: 4,
    letterSpacing: 0.4,
    color: colors.textPrimary,
  },
  joinDesc: {
    fontSize: 14,
    lineHeight: 18.9,
    textAlign: 'center',
    color: '#616161',
    paddingTop: 4,
    marginHorizontal: 30,
  },
  joinBtn: {
    marginTop: 16,
    marginBottom: 32,
    backgroundColor: colors.orange,
    borderRadius: 100,
  },
  joinBtnText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    paddingVertical: 14,
    fontWeight: '700',
    paddingHorizontal: 20,
  },
});
export default EmptyContainer;
