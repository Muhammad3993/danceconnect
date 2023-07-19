import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../utils/colors';
import useRegistration from '../../hooks/useRegistration';
import {AuthStackNavigationParamList} from '../../navigation/types';
import {useNavigation} from '@react-navigation/native';
import {countries, genders, isAndroid, roles} from '../../utils/constants';
import {Input} from '../../components/input';
import {Button} from '../../components/Button';
import FindCity from '../../components/findCity';
import CategorySelector from '../../components/catregorySelector';
import useAppStateHook from '../../hooks/useAppState';
// import { createUser } from '../../api/serverRequests';

interface city {
  structured_formatting: {
    main_text: '';
  };
  terms: [{offset: 0; value: ''}, {offset: 1; value: ''}];
}
const Board = () => {
  const [crntSlide, setCrntSlide] = useState(0);
  const {userName, isRegistrationsSuccess, setUserData} = useRegistration();
  const {onChoosedCity, getDanceStyles} = useAppStateHook();
  const [name, setName] = useState<string>(userName);
  const [gender, setGender] = useState();
  const [country, setCountry] = useState();
  const [openCountry, setOpenCountry] = useState(false);
  const [role, setRole] = useState<string[]>(new Array(0).fill(''));
  const [addedStyles, setAddedStyles] = useState<string[]>([]);
  const [openLocation, setOpenLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<city>(Object);
  const navigation = useNavigation<AuthStackNavigationParamList>();

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
    if (isRegistrationsSuccess) {
      navigation.navigate('HOME');
    }
  }, [isRegistrationsSuccess, navigation]);

  const onPressFinish = () => {
    let location = '';
    // const location =
    //   selectedLocation?.structured_formatting?.main_text +
    //   ', ' +
    //   selectedLocation?.terms[1].value;
    if (country?.countryCode !== 'USA') {
      location = country?.country + ', ' + country?.cities;
    } else {
      location =
        selectedLocation?.structured_formatting?.main_text +
        ', ' +
        selectedLocation?.terms[1].value;
    }
    onChoosedCity(location);
    // const data = {
    //   email: 'y.balaev@yandex.com',
    //   password: 'qwerty123',
    //   userName: name,
    //   userGender: gender?.title,
    //   userCountry: location,
    //   userRole: role,
    //   individualStyles: addedStyles,
    // };
    // createUser(data);
    setUserData(
      name,
      gender?.title,
      location,
      country?.country ?? 'USA',
      role,
      addedStyles,
    );
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
      return null;
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
// console.log('selectedLocation', selectedLocation);
  const fieldsSlide = () => {
    return (
      <RN.ScrollView style={styles.container}>
        <RN.Text style={styles.title}>
          Tell us a bit more about yourself
        </RN.Text>
        <RN.Text style={styles.description}>
          So we can offer you better communities and events near you
        </RN.Text>
        <RN.Text style={styles.placeholderTitle}>Name</RN.Text>
        <RN.View style={styles.inputWrapper}>
          <Input
            value={name}
            onChange={(v: string) => setName(v)}
            placeholder="ex. Eric"
            keyboardType="default"
          />
        </RN.View>
        <RN.Text style={[styles.placeholderTitle, {marginTop: -24}]}>
          Gender
        </RN.Text>
        <RN.ScrollView
          style={styles.choiseWrapper}
          showsHorizontalScrollIndicator={false}
          horizontal>
          {genders.map(item => {
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
        <RN.Text style={styles.placeholderTitle}>Country</RN.Text>
        <RN.TouchableOpacity
          style={[
            styles.selectLocationBtn,
            {
              borderBottomLeftRadius: openCountry ? 0 : 8,
              borderBottomRightRadius: openCountry ? 0 : 8,
            },
          ]}
          onPress={() => {
            setOpenCountry(v => !v);
            RN.LayoutAnimation.configureNext(
              RN.LayoutAnimation.Presets.easeInEaseOut,
            );
          }}>
          <RN.Text style={styles.locationText}>
            {country?.country ?? 'Choose country'}
          </RN.Text>
          <RN.View
            style={{
              justifyContent: 'center',
            }}>
            <RN.Image
              source={{uri: 'arrowdown'}}
              style={{height: 20, width: 20}}
            />
          </RN.View>
        </RN.TouchableOpacity>
        <RN.View style={{marginTop: -12}}>
          {openCountry &&
            countries.map(c => {
              const isLast = countries[countries.length - 1].id;
              return (
                <RN.TouchableOpacity
                  style={[
                    styles.selectLocationBtn,
                    {
                      marginVertical: 0,
                      borderRadius: 0,
                      borderBottomLeftRadius: isLast === c.id ? 8 : 0,
                      borderBottomRightRadius: isLast === c.id ? 8 : 0,
                    },
                  ]}
                  onPress={() => {
                    setCountry(c);
                    setOpenCountry(v => !v);
                    RN.LayoutAnimation.configureNext(
                      RN.LayoutAnimation.Presets.easeInEaseOut,
                    );
                  }}>
                  <RN.Text style={styles.locationText}>{c.country}</RN.Text>
                </RN.TouchableOpacity>
              );
            })}
        </RN.View>

        {/* {country?.countryCode !== 'USA' && ()} */}
        {country?.countryCode === 'USA' ? (
          <>
            <RN.Text style={styles.placeholderTitle}>Location</RN.Text>
            <RN.TouchableOpacity
              onPress={() => setOpenLocation(true)}
              style={styles.selectLocationBtn}>
              {selectedLocation?.structured_formatting?.main_text?.length >
              0 ? (
                <RN.Text style={styles.locationText}>{`${
                  selectedLocation?.structured_formatting?.main_text +
                    ', ' +
                    selectedLocation?.terms[1]?.value ?? ''
                }`}</RN.Text>
              ) : (
                <RN.Text style={styles.locationText}>Choose location</RN.Text>
              )}
              <RN.View
                style={{
                  justifyContent: 'center',
                }}>
                <RN.Image
                  source={{uri: 'arrowdown'}}
                  style={{height: 20, width: 20}}
                />
              </RN.View>
            </RN.TouchableOpacity>
          </>
        ) : (
          <>
            {country && (
              <>
                <RN.Text style={styles.placeholderTitle}>Location</RN.Text>
                <RN.View style={styles.selectLocationBtn}>
                  <RN.Text style={styles.locationText}>
                    {country?.cities}
                  </RN.Text>
                </RN.View>
              </>
            )}
          </>
        )}
        <RN.Text style={[styles.placeholderTitle, {marginTop: -4}]}>
          Define yourself can select few
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
            title="Next"
            onPress={() => onChangeSlide(1)}
            disabled={
              name.length > 0 &&
              // selectedLocation?.structured_formatting?.main_text?.length > 0 &&
              country?.country?.length > 0 &&
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
            What dance style do you prefer?
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
              title="Let’s Start"
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
      {openLocation && (
        <FindCity
          boardScreen
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onClosed={() => setOpenLocation(false)}
        />
      )}
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
    fontFamily: 'Mulish',
  },
  description: {
    fontSize: 18,
    color: colors.textPrimary,
    paddingHorizontal: 24,
    fontWeight: '500',
    lineHeight: 25.2,
    letterSpacing: 0.2,
    paddingTop: 12,
    fontFamily: 'Mulish',
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
