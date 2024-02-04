import React from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {SCREEN_WIDTH} from '../utils/constants';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type props = {
  onPress?: () => void;
};

const CreateCommunityButton = ({onPress}: props) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {t} = useTranslation();
  const onPressBtn = () => {
    navigation.push('CreateCommunity');
  };
  return (
    <RN.TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress ?? onPressBtn}>
      <RN.View style={{justifyContent: 'center'}}>
        <RN.View style={styles.circleWrapper}>
          <RN.Image source={{uri: 'comfull'}} style={styles.communityIcon} />
          <RN.View style={styles.circlePlus}>
            <RN.Image source={{uri: 'plus'}} style={styles.plusIcon} />
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.View style={{marginLeft: -10, justifyContent: 'center'}}>
        <RN.Text numberOfLines={2} style={styles.title}>
          {t('create_community_first')}
        </RN.Text>
        <RN.Text numberOfLines={3} style={styles.description}>
          {t('create_community_second')}
        </RN.Text>
      </RN.View>
      <RN.View style={{justifyContent: 'center'}}>
        <RN.Image source={{uri: 'arrowright'}} style={styles.rightArrowIcon} />
      </RN.View>
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: colors.lightPurple,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    lineHeight: 21.8,
    fontWeight: '700',
    fontFamily: 'Lato-Regular',
  },
  circleWrapper: {
    backgroundColor: colors.purple,
    borderRadius: 40,
    justifyContent: 'center',
  },
  communityIcon: {
    height: 26,
    width: 26,
    tintColor: colors.white,
    margin: 10,
  },
  rightArrowIcon: {
    height: 18,
    width: 18,
  },
  description: {
    fontSize: 12,
    lineHeight: 19.6,
    fontWeight: '400',
    color: colors.darkGray,
    fontFamily: 'Lato-Regular',
    whiteSpace: 'pre-wrap',
    maxWidth: SCREEN_WIDTH - 140,
  },
  circlePlus: {
    position: 'absolute',
    top: -4,
    right: 0,
    borderWidth: 3,
    borderRadius: 100,
    backgroundColor: colors.white,
    borderColor: colors.purple,
    padding: 2,
  },
  plusIcon: {
    height: 12,
    width: 12,
    tintColor: colors.purple,
  },
});
export default CreateCommunityButton;
