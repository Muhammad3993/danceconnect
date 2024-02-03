import {useNavigation} from '@react-navigation/native';
import React = require('react');
import * as RN from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from './colors';

type props = {
  information: string;
};
export const Unavailable = ({information}: props) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <RN.View>
        <RN.Text style={styles.infoText}>{information}</RN.Text>
      </RN.View>

      <RN.TouchableOpacity onPress={() => navigation.goBack()}>
        <RN.Text style={styles.backText}>Go back</RN.Text>
      </RN.TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 24,
    color: colors.textPrimary,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
  backText: {
    color: colors.orange,
    fontSize: 22,
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
});
export default Unavailable;
