import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import * as RN from 'react-native';
import colors from '../utils/colors';
import {statusBarHeight} from '../utils/constants';
import useAppStateHook from '../hooks/useAppState';
import {useNavigation} from '@react-navigation/native';

const ChangeLanguage = () => {
  const {t, i18n} = useTranslation();
  const {changeLanguage} = useAppStateHook();
  const navigation = useNavigation();
  const languages = Object.values(i18n.store.data);

  //   console.log(i18n)
  const onPressChange = (lg: string) => {
    changeLanguage(lg);
    // console.log(lg);
    // navigation.goBack();
  };
  useEffect(() => {
    i18n.on('languageChanged', () => {
      navigation.navigate('LANGUAGE');
    });
  }, [i18n, navigation]);
  const header = () => {
    return (
      <RN.TouchableOpacity
        style={styles.headerWrapper}
        onPress={() => navigation.goBack()}>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.View>
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text style={styles.backTitle}>{t('language')}</RN.Text>
        </RN.View>
      </RN.TouchableOpacity>
    );
  };
  return (
    <RN.View style={styles.container}>
      {header()}
      {languages.map(item => {
        const tr: {languageName: string} = item.translation;
        return (
          <RN.TouchableOpacity
            onPress={() => onPressChange(tr.languageCode)}
            style={styles.languageWrapper}>
            <RN.Text style={styles.language}>{tr?.languageName}</RN.Text>
          </RN.TouchableOpacity>
        );
      })}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: statusBarHeight,
  },
  backIcon: {
    height: 16,
    width: 19,
  },
  headerWrapper: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  language: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  languageWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    paddingVertical: 14,
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.5,
  },
  backTitle: {
    fontSize: 22,
    color: colors.textPrimary,
    lineHeight: 24.4,
    fontWeight: '600',
    paddingLeft: 24,
    fontFamily: 'Mulish-Regular',
  },
});
export default ChangeLanguage;
