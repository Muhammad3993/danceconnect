import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import {Modalize} from 'react-native-modalize';
import Search from './search';
import {searchCity} from '../api/cities';
import colors from '../utils/colors';
import {Button} from './Button';
import useAppStateHook from '../hooks/useAppState';
import {statusBarHeight} from '../utils/constants';
import {useTranslation} from 'react-i18next';

type props = {
  setSelectedLocation: (value: any) => void;
  selectedLocation?: any;
  onClosed?: (val: boolean) => void;
  communityScreen?: boolean;
  isEventScreen?: boolean;
  countryCode?: string;
  setCurrentCountry: (value: any) => void;
  isTabScreen?: boolean;
};

enum WRAPPERS {
  MAIN,
  REGIONS,
  COUNTRIES,
}
const FindCity = ({
  setSelectedLocation,
  selectedLocation,
  onClosed,
  communityScreen = false,
  countryCode = '',
  setCurrentCountry,
}: props) => {
  const modalizeRef = useRef<Modalize>(null);
  const {t} = useTranslation();
  const {countries, regions} = useAppStateHook();
  const [country, setCountry] = useState<any>();
  const [crntLocation, setCrntLocation] = useState<string | string[]>();
  const [openLocation, setOpenLocation] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState('');

  const [searchValue, setSearchValue] = useState<string>();
  const [findCity, setFindCity] = useState([]);
  const [currentWrapper, setSurrentWrapper] = useState(WRAPPERS.MAIN);
  const [searchCountryValue, setSearchCountryValue] = useState<string>();
  const [countriesSearch, setCountriesSearch] = useState([]);

  const [isVisibleSearchCity, setIsVisibleSearchCity] = useState(false);

  const handleStyle = {height: 3, width: 38};

  useEffect(() => {
    const isRegion = regions.find(
      (region: {name: string}) => region.name === selectedLocation,
    );
    const isCountry = countries.find(
      (c: {country: string}) => c.country === selectedLocation?.split(', ')[1],
    );
    if (isRegion) {
      setSelectedRegion(selectedLocation as string);
      setCountry('');
    }
    if (isCountry) {
      setSearchCountryValue(selectedLocation as string);
      setIsVisibleSearchCity(true);
      setCountry(isCountry);
      setSearchCountryValue(selectedLocation?.split(', ')[1]);
    }
  }, [countries, regions, selectedLocation]);

  useEffect(() => {
    modalizeRef?.current?.open();
    const isCountryAsia = countries.find((c: {country: string}) =>
      c.country?.includes(selectedLocation?.split(', ')[0]),
    );
    if (isCountryAsia && !isCountryAsia.availableSearchString) {
      setSearchCountryValue(isCountryAsia.country);
      setCountry(isCountryAsia);
      setCrntLocation(selectedLocation?.split(', ')[1]);
    }
  }, []);
  const onClose = () => {
    modalizeRef?.current?.close();
    if (onClosed) {
      onClosed(false);
    }
  };
  const onChangeTextSearch = (value: string) => {
    setSearchValue(value);
    if (!value?.length) {
      setFindCity([]);
    }
    if (countryCode?.length > 0) {
      searchCity(searchValue, countryCode).then((places: any) => {
        setFindCity(places);
      });
    } else {
      searchCity(searchValue, country?.countryCode).then((places: any) => {
        setFindCity(places);
      });
    }
  };
  // searchPlaces
  const onPressLocate = (item: any) => {
    setSelectedLocation(
      item?.structured_formatting?.main_text + ', ' + item?.terms[1].value,
    );

    // modalizeRef?.current?.close();
    // setCurrentCountry(item.description);
    RN.Keyboard.dismiss();
    setFindCity([]);
    setSearchValue(item?.structured_formatting?.main_text);
  };
  const onCancel = () => {
    if (
      currentWrapper === WRAPPERS.REGIONS ||
      currentWrapper === WRAPPERS.COUNTRIES
    ) {
      setSurrentWrapper(WRAPPERS.MAIN);
    } else {
      if (onClosed) {
        onClosed(false);
      }
      modalizeRef?.current?.close();
    }
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
  };
  const onSearchCountry = (value: string) => {
    setSearchCountryValue(value);
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
  const headerLocation = () => {
    return (
      <>
        <RN.View style={styles.headerDanceStyle}>
          <RN.TouchableOpacity
            onPress={onCancel}
            style={{justifyContent: 'center'}}
            disabled={
              currentWrapper === WRAPPERS.REGIONS ||
              currentWrapper === WRAPPERS.COUNTRIES
                ? false
                : communityScreen
            }>
            <RN.Image
              source={{uri: 'backicon'}}
              style={[
                styles.backIcon,
                {
                  tintColor: communityScreen
                    ? currentWrapper === WRAPPERS.REGIONS ||
                      currentWrapper === WRAPPERS.COUNTRIES
                      ? 'black'
                      : 'white'
                    : 'black',
                },
              ]}
            />
          </RN.TouchableOpacity>
          <RN.View style={{alignSelf: 'center'}}>
            <RN.Text style={styles.selectorTitle}>
              {currentWrapper === WRAPPERS.REGIONS
                ? 'Regions'
                : currentWrapper === WRAPPERS.COUNTRIES
                ? 'Countries'
                : t('location')}
            </RN.Text>
          </RN.View>
          <RN.TouchableOpacity onPress={onClose}>
            <RN.Image source={{uri: 'close'}} style={{height: 24, width: 24}} />
          </RN.TouchableOpacity>
        </RN.View>
      </>
    );
  };
  const line = () => {
    return <RN.View style={styles.line} />;
  };

  const renderRegions = () => {
    return (
      <RN.View>
        {regions?.map((r: any) => {
          return (
            <RN.TouchableOpacity
              style={styles.selectLocationBtn}
              onPress={() => {
                setCountry(r);
                setSelectedLocation(r.name);
                modalizeRef?.current?.close();
                if (onClosed) {
                  onClosed(false);
                }
                // setSurrentWrapper(WRAPPERS.MAIN)
                setSelectedRegion(r.name);
              }}>
              <RN.Text style={styles.locationText}>{r.name}</RN.Text>
            </RN.TouchableOpacity>
          );
        })}
      </RN.View>
    );
  };
  const renderCountriesItem = ({item}: any) => {
    return (
      <RN.TouchableOpacity
        style={styles.searchItemContainer}
        onPress={() => {
          setCountriesSearch([]);
          setCountry(item);
          setSelectedLocation(item.country);
          setSearchCountryValue(item.country);
          if (!item?.availableSearchString) {
            if (item?.cities instanceof Array) {
              setCrntLocation(item.cities[0]?.name);
              setSelectedLocation(item?.country + ', ' + item.cities[0]?.name);
            } else {
              setCrntLocation(item.cities);
              setSelectedLocation(item?.country + ', ' + item?.cities);
            }
          }
          RN.LayoutAnimation.configureNext(
            RN.LayoutAnimation.Presets.easeInEaseOut,
          );
          setIsVisibleSearchCity(true);
          setFindCity([]);
          setSelectedRegion('');
        }}>
        <RN.Text style={styles.searchItemText}>{item.country}</RN.Text>
      </RN.TouchableOpacity>
    );
  };
  const renderCountries = () => {
    return (
      <>
        <RN.TextInput
          placeholder="Search by Country"
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
          country?.availableSearchString &&
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
              {findCity?.map((item: any) => {
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
        {searchCountryValue?.length > 0 &&
          !countriesSearch.length &&
          !country?.availableSearchString && (
            <>
              {country?.cities instanceof Array ? (
                <RN.TouchableOpacity
                  style={[styles.selectLocationBtn]}
                  onPress={() => {
                    setOpenLocation(v => !v);
                    RN.LayoutAnimation.configureNext(
                      RN.LayoutAnimation.Presets.easeInEaseOut,
                    );
                  }}>
                  <RN.Text style={[styles.locationText]}>
                    {crntLocation}
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
              ) : (
                <RN.View style={styles.selectLocationBtn}>
                  <RN.Text style={styles.locationText}>
                    {country?.cities ? country?.cities : country}
                  </RN.Text>
                </RN.View>
              )}
              <RN.View>
                {openLocation &&
                  country?.cities instanceof Array &&
                  country?.cities?.map(c => {
                    return (
                      <RN.TouchableOpacity
                        style={[styles.selectLocationBtn]}
                        onPress={() => {
                          setCrntLocation(c?.name);
                          setSelectedLocation(
                            country?.country + ', ' + c?.name,
                          );
                          setOpenLocation(v => !v);
                          RN.LayoutAnimation.configureNext(
                            RN.LayoutAnimation.Presets.easeInEaseOut,
                          );
                        }}>
                        <RN.Text style={styles.locationText}>{c?.name}</RN.Text>
                      </RN.TouchableOpacity>
                    );
                  })}
              </RN.View>
            </>
          )}
      </>
    );
  };
  return (
    <Modalize
      handlePosition="inside"
      handleStyle={handleStyle}
      ref={modalizeRef}
      modalStyle={{marginTop: statusBarHeight * 2}}
      onClosed={onCancel}
      HeaderComponent={headerLocation()}>
      <RN.View>
        {currentWrapper === WRAPPERS.MAIN && (
          <RN.View>
            <RN.TouchableOpacity
              style={styles.selectorContainer}
              onPress={() => {
                RN.LayoutAnimation.configureNext(
                  RN.LayoutAnimation.Presets.easeInEaseOut,
                );
                setSurrentWrapper(WRAPPERS.REGIONS);
                setCountriesSearch([]);
                setSearchCountryValue('');
                setFindCity([]);
              }}>
              <RN.View>
                <RN.Text style={[styles.selectorTitle]}>
                  {'Search by Region'}
                  {selectedRegion?.length > 0 && (
                    <RN.Text style={{fontSize: 14, color: colors.darkGray}}>
                      {` (${selectedRegion})`}
                    </RN.Text>
                  )}
                </RN.Text>
              </RN.View>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'arrowright'}}
                  style={{height: 16, width: 16, tintColor: colors.black}}
                />
              </RN.View>
            </RN.TouchableOpacity>
            {line()}
            <RN.TouchableOpacity
              style={styles.selectorContainer}
              onPress={() => {
                RN.LayoutAnimation.configureNext(
                  RN.LayoutAnimation.Presets.easeInEaseOut,
                );
                setSurrentWrapper(WRAPPERS.COUNTRIES);
                setCountriesSearch([]);
                setFindCity([]);
              }}>
              <RN.View>
                <RN.Text style={[styles.selectorTitle]}>
                  {'Search by Country'}
                  {country?.country?.length > 0 && (
                    <RN.Text style={{fontSize: 14, color: colors.darkGray}}>
                      {` (${country?.country})`}
                    </RN.Text>
                  )}
                </RN.Text>
              </RN.View>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'arrowright'}}
                  style={{height: 16, width: 16, tintColor: colors.black}}
                />
              </RN.View>
            </RN.TouchableOpacity>
            {line()}
          </RN.View>
        )}
        {currentWrapper === WRAPPERS.REGIONS && renderRegions()}
        {currentWrapper === WRAPPERS.COUNTRIES && renderCountries()}
      </RN.View>
      {currentWrapper === WRAPPERS.MAIN && (
        <RN.View style={{paddingTop: 44}}>
          <Button title={t('confirm')} onPress={onClose} disabled />
        </RN.View>
      )}
      {currentWrapper === WRAPPERS.COUNTRIES && (
        <RN.View style={{paddingTop: 44}}>
          <Button title={t('confirm')} onPress={onClose} disabled />
        </RN.View>
      )}
      <RN.View style={{paddingBottom: 60}} />
    </Modalize>
  );
};
const styles = RN.StyleSheet.create({
  headerDanceStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 34,
  },
  selectorTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  selectorContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
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
  },
  locationText: {
    paddingVertical: 16,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  backIcon: {
    height: 18,
    width: 22,
    marginTop: 4,
  },
});

export default FindCity;
