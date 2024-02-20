import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import useRegistration from '../../hooks/useRegistration';
import {AuthStackNavigationParamList} from '../../navigation/types';
import {useNavigation, useRoute} from '@react-navigation/native';
import {genders, isAndroid, roles} from '../../utils/constants';
import {Input} from '../../components/input';
import {Button} from '../../components/Button';
import FindCity from '../../components/findCity';
import CategorySelector from '../../components/catregorySelector';
import useAppStateHook from '../../hooks/useAppState';
import {removeAccount} from '../../api/authSocial';
import {logoutSuccess} from '../../store/actions/authorizationActions';
import {useDispatch} from 'react-redux';
import {Portal} from 'react-native-portalize';
import LocationSelector from '../../components/locationSelector.tsx';
import {useTranslation} from 'react-i18next';
// import { createUser } from '../../api/serverRequests';

interface city {
  structured_formatting: {
    main_text: '';
  };
  terms: [{offset: 0; value: ''}, {offset: 1; value: ''}];
}
const Board = () => {
  const [crntSlide, setCrntSlide] = useState(0);
  const routeProps = useRoute();
  const dispatch = useDispatch();
  const {userName, saveEmail, isRegistrationsSuccess, registration, userUid} =
    useRegistration();
  const {onChoosedCity, getDanceStyles, countries} = useAppStateHook();
  const [name, setName] = useState<string>(userName);
  const [gender, setGender] = useState();
  const [role, setRole] = useState<string[]>(new Array(0).fill(''));
  const [addedStyles, setAddedStyles] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<city>(Object);
  const navigation = useNavigation<AuthStackNavigationParamList>();
  const {t} = useTranslation();

  useEffect(() => {
    getDanceStyles();
  }, []);
  const onPressRole = (item: any) => {
    const filter = role.filter(itm => itm !== item);
    if (role?.includes(item)) {
      setRole(filter);
    } else {
      setRole([...role, item]);
    }
  };
  useEffect(() => {
    if (userName === 'null null') {
      setName('');
    }
  }, [userName]);

  const onPressFinish = () => {
    onChoosedCity(selectedLocation);
    const email = routeProps?.params?.email;
    const password = routeProps?.params?.password;

    const data = {
      email: email,
      password: password,
      userName: name,
      userGender: gender?.title,
      userCountry: selectedLocation,
      userRole: role,
      individualStyles: addedStyles,
      userImage: null,
      customer: null,
      myCommunities: [],
      joinedCommunities: [],
      events: [],
      goingEvent: [],
      paidEvents: [],
    };
    // createUser(data);
    registration(data);
  };

  const onChangeSlide = (value: number) => {
    setCrntSlide(value);
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  };
  const onPressBack = () => {
    if (crntSlide === 1) {
      setCrntSlide(0);
      RN.LayoutAnimation.configureNext(
        RN.LayoutAnimation.Presets.easeInEaseOut,
      );
    } else {
      navigation.navigate('WELCOME');
      removeAccount();
      dispatch(logoutSuccess());
    }
  };

  const onChooseDanceStyles = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const isAvailable = addedStyles?.includes(value);
    if (isAvailable) {
      onPressDeleteItem(value);
    } else {
      setAddedStyles([...addedStyles, value]);
    }
  };
  const onPressDeleteItem = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const filter = addedStyles.filter(item => item !== value);
    setAddedStyles(filter);
  };

  const header = () => {
    return (
      <RN.View style={styles.headerWrapper}>
        <RN.TouchableOpacity onPress={onPressBack}>
          <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        </RN.TouchableOpacity>
        <RN.View style={{alignSelf: 'center', flexDirection: 'row'}}>
          <RN.View
            style={crntSlide === 0 ? styles.activeDot : styles.inActiveDot}
          />
          <RN.View
            style={crntSlide !== 0 ? styles.activeDot : styles.inActiveDot}
          />
        </RN.View>
      </RN.View>
    );
  };

  const fieldsSlide = () => {
    return (
      <RN.ScrollView style={styles.container}>
        <RN.Text style={styles.title}>{t('yourself')}</RN.Text>
        <RN.Text style={styles.description}>{t('yourself_desc')}</RN.Text>
        <RN.Text style={styles.placeholderTitle}>{t('name')}</RN.Text>
        <RN.View style={styles.inputWrapper}>
          <Input
            value={name}
            onChange={(v: string) => setName(v)}
            placeholder="ex. Eric"
            keyboardType="default"
          />
        </RN.View>
        <RN.Text style={[styles.placeholderTitle, {marginTop: -24}]}>
          {t('gender')}
        </RN.Text>
        <RN.ScrollView
          style={styles.choiseWrapper}
          showsHorizontalScrollIndicator={false}
          horizontal>
          {genders.map(item => {
            if (!item.title.length) {
              return null;
            }
            return (
              <RN.TouchableOpacity
                onPress={() => setGender(item)}
                style={[
                  styles.choiseItemContainer,
                  {
                    borderColor:
                      item.id === gender?.id ? colors.orange : colors.gray,
                  },
                ]}>
                <RN.Text
                  style={[
                    styles.choiseItemText,
                    {
                      color:
                        item.id === gender?.id
                          ? colors.orange
                          : colors.darkGray,
                    },
                  ]}>
                  {item?.title}
                </RN.Text>
              </RN.TouchableOpacity>
            );
          })}
        </RN.ScrollView>
        <LocationSelector
          isProfileScreen={false}
          setSelectedLocation={(value) => {
            onChoosedCity(selectedLocation);
            setSelectedLocation(value);
          }}
        />
        <RN.Text style={[styles.placeholderTitle, {marginTop: -4}]}>
          {`${t('role')}, ${t('few')}`}
        </RN.Text>
        <RN.ScrollView
          style={styles.choiseWrapper}
          showsHorizontalScrollIndicator={false}
          horizontal>
          {roles.map(item => {
            const crntIdx =
              role.find((idx: any) => idx?.id === item.id)?.id === item.id;

            return (
              <RN.TouchableOpacity
                onPress={() => onPressRole(item)}
                style={[
                  styles.choiseItemContainer,
                  {
                    borderColor: crntIdx ? colors.orange : colors.gray,
                  },
                ]}>
                <RN.Text
                  style={[
                    styles.choiseItemText,
                    {
                      color: crntIdx ? colors.orange : colors.darkGray,
                    },
                  ]}>
                  {item?.title}
                </RN.Text>
              </RN.TouchableOpacity>
            );
          })}
          <RN.View style={{paddingHorizontal: 14}} />
        </RN.ScrollView>
        <RN.View style={styles.finishBtn}>
          <Button
            title={t('next')}
            onPress={() => onChangeSlide(1)}
            disabled={
              name?.length > 0 &&
              // selectedLocation?.structured_formatting?.main_text?.length > 0 &&
              // country?.country?.length > 0 &&
              role?.length > 0 &&
              gender?.title?.length > 0
            }
          />
        </RN.View>
      </RN.ScrollView>
    );
  };
  const stylesSlide = () => {
    return (
      <>
        <RN.ScrollView>
          <RN.Text style={[styles.title, {paddingBottom: 20}]}>
            {t('select_dc')}
          </RN.Text>
          {addedStyles?.length > 0 && (
            <RN.View style={styles.danceStyleContainer}>
              {addedStyles?.map(item => {
                return (
                  <RN.TouchableOpacity
                    style={styles.addedDanceStyleItem}
                    activeOpacity={0.7}
                    onPress={() => onPressDeleteItem(item)}>
                    <RN.Text style={styles.addedDanceStyleText}>{item}</RN.Text>
                    <RN.View style={{justifyContent: 'center', marginTop: 2}}>
                      <RN.Image
                        style={{
                          height: 14,
                          width: 14,
                          tintColor: colors.orange,
                        }}
                        source={{uri: 'close'}}
                      />
                    </RN.View>
                  </RN.TouchableOpacity>
                );
              })}
            </RN.View>
          )}
          <CategorySelector
            addedStyles={addedStyles}
            onChoosheDanceStyle={onChooseDanceStyles}
          />
          <RN.View style={[styles.finishBtn, {marginTop: -24}]}>
            <Button
              title={t('lets_start')}
              onPress={onPressFinish}
              disabled={addedStyles.length > 0}
            />
          </RN.View>
        </RN.ScrollView>
      </>
    );
  };

  return (
    <RN.SafeAreaView style={styles.container}>
      {header()}
      {crntSlide === 0 ? fieldsSlide() : stylesSlide()}
    </RN.SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },

  addedDanceStyleItem: {
    borderWidth: 1,
    borderColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    marginRight: 4,
    marginBottom: 8,
  },
  addedDanceStyleText: {
    color: colors.orange,
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 19.6,
    marginRight: 6,
    fontWeight: '600',
  },
  danceStyleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  activeDot: {
    backgroundColor: colors.purple,
    height: 8,
    width: 32,
    borderRadius: 100,
    marginTop: -14,
  },
  inActiveDot: {
    backgroundColor: '#E0E0E0',
    height: 8,
    width: 8,
    marginHorizontal: 4,
    borderRadius: 100,
    marginTop: -14,
  },
  headerWrapper: {
    marginHorizontal: 24,
    paddingBottom: 12,
    paddingTop: isAndroid ? 14 : 0,
  },
  selectLocationBtn: {
    marginHorizontal: 20,
    marginVertical: 14,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.grayTransparent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  locationText: {
    paddingVertical: 16,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  backIcon: {
    height: 26,
    width: 30,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38.4,
    paddingHorizontal: 24,
    paddingTop: 18,
    fontFamily: 'Lato-Regular',
  },
  description: {
    fontSize: 18,
    color: colors.textPrimary,
    paddingHorizontal: 24,
    fontWeight: '500',
    lineHeight: 25.2,
    letterSpacing: 0.2,
    paddingTop: 12,
    fontFamily: 'Lato-Regular',
  },
  inputWrapper: {
    marginHorizontal: 10,
    paddingTop: 8,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    paddingTop: 28,
    paddingHorizontal: 24,
    color: colors.textPrimary,
  },
  choiseWrapper: {
    // flexDirection: 'row',
    padding: 12,
    paddingHorizontal: 24,
  },
  choiseItemContainer: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 4,
  },
  choiseItemText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  finishBtn: {
    paddingVertical: 28,
  },
});
export default Board;
