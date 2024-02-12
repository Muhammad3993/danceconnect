/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import {Modalize} from 'react-native-modalize';
import colors from '../utils/colors';
import useAppStateHook from '../hooks/useAppState';
import useRegistration from '../hooks/useRegistration';
import {Portal} from 'react-native-portalize';
import {statusBarHeight} from '../utils/constants';
import Search from './search';
import {searchCity} from '../api/cities';
import {Button} from './Button';
import {useProfile} from '../hooks/useProfile';
import {useTranslation} from 'react-i18next';

interface Props {
  setSelectedLocation?: (value: string | undefined) => void;
  isProfileScreen?: boolean;
}

const LocationSelector = ({
  setSelectedLocation,
  isProfileScreen = false,
}: Props) => {
  const modalizeRef = useRef();
  const {countries, onChoosedCity, currentCity} = useAppStateHook();
  const {onChangeUserCountry, userCountry} = useProfile();
  const {currentUser} = useRegistration();
  const handleStyle = {height: 3, width: 38};
  const [currentCityValue, setCurrentCity] = useState<string | undefined>('');
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [searchCities, setSearchCities] = useState([]);
  const [searchCountryValue, setSearchCountryValue] = useState('');
  const [countriesSearch, setCountriesSearch] = useState([]);
  const [isVisibleSearchCity, setIsVisibleSearchCity] = useState(false);
  const [isVisibleCities, setIsVisibleSearchCities] = useState(false);
  const [openCities, setOpenCities] = useState(false);

  const {t} = useTranslation();

  const [currentCountry, setCurrentCountry] = useState();
  const [openCountry, setOpenCountry] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const onOpen = () => modalizeRef?.current?.open();
  const onPressCountry = c => {
    if (currentCountry?.countryCode !== c.countryCode) {
      setSearchValue('');
      setCurrentCountry({});
      setCurrentCity('');
      if (c.cities instanceof Array) {
        setCurrentCity(c.country + ', ' + c.cities[0].name);
        if (setSelectedLocation) {
          setSelectedLocation(c.country + ', ' + c.cities[0].name);
        }
      }
      if (typeof c.cities === 'string') {
        setCurrentCity(c.country + ', ' + c.cities);
        if (setSelectedLocation) {
          setSelectedLocation(c.country + ', ' + c.cities);
        }
      }
    }
    setCurrentCountry(c);
    setOpenCountry(v => !v);
  };
  useEffect(() => {
    if (currentCityValue) {
      setSearchValue(currentCityValue.split(', ')[0]);
    }
    const isCountry = countries.find((c: {country: string}) =>
      c.country?.includes(userCountry?.split(', ')[0]),
    );
    if (isCountry && !isCountry?.availableSearchString) {
      if (setSelectedLocation) {
        setSelectedLocation(
          isCountry.country + ', ' + isCountry.cities[0].name,
        );
      }

      setCurrentCountry(isCountry);
      setSearchCountryValue(isCountry.country);
    }
    if (isCountry && isCountry?.availableSearchString) {
      if (setSelectedLocation) {
        setSelectedLocation(isCountry.country);
      }
      setCurrentCountry(isCountry);
      setSearchCountryValue(isCountry.country);
    }
  }, []);

  const onChangeTextSearch = (value: string) => {
    setSearchValue(value);

    if (value?.length <= 1) {
      setSearchCities([]);
    } else {
      searchCity(searchValue, currentCountry?.countryCode).then(places => {
        setSearchCities(places);
      });
    }
  };

  const onSearchCountry = (value: string) => {
    setSearchCountryValue(value);
    setIsVisibleSearchCities(false);
    if (value.trim().length > 1) {
      const search = countries.filter((item: {country: string}) => {
        const itemData = `${item.country?.toLowerCase()}`;
        const textData = value.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setCountriesSearch(search);
    } else {
      setCountriesSearch([]);
      setIsVisibleSearchCity(false);
    }
  };
  const onPressLocate = (item: {
    structured_formatting: {main_text: string};
    terms: {value: string}[];
  }) => {
    const city =
      item?.structured_formatting?.main_text + ', ' + item?.terms[1].value;
    setCurrentCity(city);
    if (setSelectedLocation) {
      setSelectedLocation(city);
    }
    setSearchCities([]);
    setSearchValue(item?.structured_formatting?.main_text);
  };
  const onPressConfirm = () => {
    if (currentCityValue) {
      modalizeRef?.current?.close();
      onChoosedCity(currentCityValue);
    } else {
      return;
    }
    if (isProfileScreen) {
      onChoosedCity(currentCityValue);
      onChangeUserCountry(currentCityValue);
    }
  };

  const renderHeader = () => {
    return (
      <RN.View style={styles.headerWrapper}>
        <RN.View style={{width: 22}} />
        <RN.View style={{alignSelf: 'center'}}>
          <RN.Text style={styles.title}>{t('location')}</RN.Text>
        </RN.View>
        <RN.TouchableOpacity
          onPress={() => modalizeRef?.current?.close()}
          style={styles.justifyCenter}>
          <RN.Image source={{uri: 'close'}} style={styles.backIcon} />
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const renderCountriesItem = ({item}: any) => {
    return (
      <RN.TouchableOpacity
        style={styles.searchItemContainer}
        key={item.countryCode}
        onPress={() => {
          setCountriesSearch([]);
          // setSelectedLocation(item.country);
          setSearchCountryValue(item.country);
          if (!item?.availableSearchString) {
            if (item?.cities instanceof Array) {
              setCurrentCity(item.cities[0]?.name);
              onChoosedCity(item.cities[0]?.name);
            } else {
              onChoosedCity(item.cities);
              setCurrentCity(item.cities);
              if (setSelectedLocation) {
                setSelectedLocation(item.country + ', ' + item.cities);
              }
            }
          }
          RN.LayoutAnimation.configureNext(
            RN.LayoutAnimation.Presets.easeInEaseOut,
          );
          setIsVisibleSearchCity(true);
          setIsVisibleSearchCities(true);
          setCurrentCountry(item);
          setSearchCities([]);
          setSearchValue('');
        }}>
        <RN.Text style={styles.searchItemText}>{item.country}</RN.Text>
      </RN.TouchableOpacity>
    );
  };
  return (
    <>
      {!isProfileScreen && (
        <>
          <RN.Text style={styles.placeholderTitle}>{t('location')}</RN.Text>
          <RN.TouchableOpacity
            onPress={onOpen}
            style={[
              styles.chooseCountryWrapper,
              {
                borderBottomLeftRadius: openCountry ? 0 : 8,
                borderBottomRightRadius: openCountry ? 0 : 8,
              },
            ]}
            activeOpacity={0.7}>
            <RN.Text style={styles.chooseCountryText}>
              {currentCity?.length > 0 ? currentCity : t('location_choose')}
            </RN.Text>
            <RN.View style={styles.justifyCenter}>
              <RN.Image source={{uri: 'arrowdown'}} style={styles.backIcon} />
            </RN.View>
          </RN.TouchableOpacity>
        </>
      )}
      {isProfileScreen && (
        <RN.TouchableOpacity style={styles.listItemWrapper} onPress={onOpen}>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.Image source={{uri: 'locateoutline'}} style={styles.icon} />
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.listItemText}>{t('location')}</RN.Text>
            </RN.View>
          </RN.View>
          <RN.View style={{flexDirection: 'row'}}>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Text style={styles.locationText}>
                {currentUser?.userCountry}
              </RN.Text>
            </RN.View>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image source={{uri: 'arrowright'}} style={styles.iconRight} />
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>
      )}
      <Portal>
        <Modalize
          handlePosition="inside"
          handleStyle={handleStyle}
          ref={modalizeRef}
          modalStyle={{marginTop: statusBarHeight}}
          HeaderComponent={renderHeader()}>
          <RN.TextInput
            placeholder="Search Country"
            style={[styles.inputSearch, styles.line]}
            value={searchCountryValue}
            onChangeText={onSearchCountry}
            placeholderTextColor={colors.darkGray}
          />
          {countriesSearch.length > 0 && (
            <RN.FlatList
              data={countriesSearch}
              keyExtractor={(item: {country: string}) => item.country}
              renderItem={renderCountriesItem}
            />
          )}
          {!countriesSearch.length &&
            currentCountry?.availableSearchString &&
            isVisibleSearchCity && (
              <>
                <RN.View style={{paddingHorizontal: 20}}>
                  <Search
                    onSearch={onChangeTextSearch}
                    searchValue={searchValue}
                    placeholder={t('search_city')}
                    visibleAddBtn={false}
                  />
                </RN.View>
                {searchCities?.map((item: any) => {
                  return (
                    <RN.TouchableOpacity
                      style={{paddingVertical: 8}}
                      onPress={() => onPressLocate(item)}>
                      <RN.Text
                        style={{
                          fontSize: 16,
                          color: colors.textPrimary,
                          lineHeight: 22.4,
                          paddingHorizontal: 20,
                        }}>
                        {item?.structured_formatting?.main_text +
                          ', ' +
                          item?.terms[1]?.value}
                      </RN.Text>
                    </RN.TouchableOpacity>
                  );
                })}
              </>
            )}
          {isVisibleCities &&
            searchCountryValue?.length > 0 &&
            !currentCountry?.availableSearchString && (
              <>
                {currentCountry?.cities instanceof Array ? (
                  <RN.TouchableOpacity
                    style={styles.selectLocationBtn}
                    onPress={() => setOpenCities(v => !v)}>
                    <RN.Text style={styles.locationText}>
                      {currentCityValue
                        ? currentCityValue?.split(', ')[1]
                        : currentCountry?.cities[0].name}
                    </RN.Text>
                    <RN.View style={styles.justifyCenter}>
                      <RN.Image
                        source={{uri: 'arrowdown'}}
                        style={styles.backIcon}
                      />
                    </RN.View>
                  </RN.TouchableOpacity>
                ) : (
                  <RN.View style={styles.selectLocationBtn}>
                    <RN.Text style={styles.locationText}>
                      {currentCountry?.cities
                        ? currentCountry?.cities
                        : currentCountry}
                    </RN.Text>
                  </RN.View>
                )}
                {openCities &&
                  currentCountry?.cities instanceof Array &&
                  currentCountry?.cities.map(i => {
                    const isLast =
                      currentCountry?.cities[currentCountry?.cities.length - 1]
                        ?.key;
                    return (
                      <RN.TouchableOpacity
                        onPress={() => {
                          setOpenCities(v => !v);
                          setCurrentCity(
                            currentCountry.country + ', ' + i.name,
                          );
                          if (setSelectedLocation) {
                            setSelectedLocation(
                              currentCountry.country + ', ' + i.name,
                            );
                          }
                        }}
                        style={[
                          styles.chooseCountryWrapperOpened,
                          {
                            borderBottomLeftRadius: isLast === i.key ? 8 : 0,
                            borderBottomRightRadius: isLast === i.key ? 8 : 0,
                          },
                        ]}
                        activeOpacity={0.7}>
                        <RN.Text style={styles.chooseCountryTextOpened}>
                          {i.name}
                        </RN.Text>
                      </RN.TouchableOpacity>
                    );
                  })}
              </>
            )}
          <RN.View style={{paddingTop: 44, marginHorizontal: 14}}>
            <Button title={t('confirm')} onPress={onPressConfirm} disabled />
          </RN.View>
        </Modalize>
      </Portal>
    </>
  );
};

const styles = RN.StyleSheet.create({
  justifyCenter: {
    justifyContent: 'center',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 34,
  },
  backIcon: {
    height: 20,
    width: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    paddingTop: 8,
    paddingHorizontal: 24,
    color: colors.textPrimary,
  },
  chooseCountryWrapper: {
    marginHorizontal: 24,
    marginVertical: 14,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.grayTransparent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  chooseCountryWrapperOpened: {
    // marginHorizontal: 24,
    // backgroundColor: colors.lightGray,
    borderColor: colors.grayTransparent,
    borderBottomWidth: 0.5,
    marginHorizontal: 20,
  },
  chooseCountryText: {
    paddingVertical: 18,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  chooseCountryTextOpened: {
    paddingVertical: 8,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  listItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  listItemText: {
    fontSize: 18,
    lineHeight: 25.2,
    paddingLeft: 20,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  locationText: {
    fontSize: 16,
    lineHeight: 22.4,
    paddingRight: 20,
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  iconRight: {
    height: 14,
    width: 14,
    tintColor: colors.textPrimary,
  },
  icon: {
    height: 28,
    width: 28,
    tintColor: '#424242',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    marginHorizontal: 20,
  },
  inputSearch: {
    marginHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    lineHeight: 22.4,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  searchItemContainer: {
    marginHorizontal: 20,
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.5,
  },
  searchItemText: {
    fontSize: 16,
    lineHeight: 22.4,
    color: colors.textPrimary,
    marginVertical: 12,
    fontWeight: '500',
  },
  selectLocationBtn: {
    borderBottomWidth: 0.5,
    borderColor: colors.grayTransparent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingVertical: 12,
  },
});
export default LocationSelector;
