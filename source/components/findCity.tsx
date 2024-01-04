import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import {Modalize} from 'react-native-modalize';
import Search from './search';
import {searchCity} from '../api/cities';
import colors from '../utils/colors';
import {useProfile} from '../hooks/useProfile';
// import {countries} from '../utils/constants';
import {Button} from './Button';
import useAppStateHook from '../hooks/useAppState';
import {statusBarHeight} from '../utils/constants';
import {useTranslation} from 'react-i18next';

interface city {
  structured_formatting: {
    main_text: '';
  };
  terms: [{offset: 0; value: ''}, {offset: 1; value: ''}];
}
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
const FindCity = ({
  setSelectedLocation,
  selectedLocation,
  onClosed,
  communityScreen = false,
  isTabScreen = false,
  countryCode = '',
  setCurrentCountry,
}: props) => {
  const modalizeRef = useRef<Modalize>(null);
  const {userCountry} = useProfile();
  const {t} = useTranslation();
  const {countries, regions} = useAppStateHook();
  const [openCountry, setOpenCountry] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [country, setCountry] = useState();
  const [crntLocation, setCrntLocation] = useState<string | string[]>();
  const [searchCountryValue, setSearchCountryValue] = useState<string>();
  const [countriesSearch, setCountriesSearch] = useState([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [findCity, setFindCity] = useState([]);
  const handleStyle = {height: 3, width: 38};
  const [isVisibleSearchCity, setIsVisibleSearchCity] = useState(false);

  // useEffect(() => {
  //   const c = countries.find(
  //     (c: {country: string}) => c.country === userCountry?.split(', ')[0],
  //   );
  //   if (c !== undefined) {
  //     setCountry(c);
  //   } else {
  //     setCountry(
  //       countries.find(
  //         (c: {country: string}) => c.country === userCountry?.split(', ')[1],
  //       ),
  //     );
  //   }
  // }, []);
  useEffect(() => {
    const isCountry = countries.find(
      (c: {country: string}) =>
        c.country ===
        selectedLocation?.split(', ')[
          selectedLocation.replace(/[^,]/g, '').length
        ],
    );
    if (isCountry) {
      setSearchValue(selectedLocation?.split(', ')[0]);
      setIsVisibleSearchCity(true);
      setCountry(isCountry);
      setSearchCountryValue(
        selectedLocation?.split(', ')[
          selectedLocation.replace(/[^,]/g, '').length
        ],
      );
    }
  }, []);

  // useEffect(() => {
  //   if (country?.cities instanceof Array) {
  //     setCrntLocation(country?.cities[0]?.name);
  //   } else {
  //     setCrntLocation(country?.cities);
  //   }
  // }, [country]);
  // console.log(
  //   'selectedLocation',
  //   selectedLocation,
  //   crntLocation,
  //   country?.cities,
  // );

  useEffect(() => {
    modalizeRef?.current?.open();
    const isCountryAsia = countries.find((c: {country: string}) =>
      c.country?.includes(selectedLocation?.split(', ')[0]),
    );
    if (isCountryAsia) {
      setSearchCountryValue(isCountryAsia.country);
      setCountry(isCountryAsia);
      setCrntLocation(selectedLocation?.split(', ')[1]);
    }
  }, []);
  const onClose = () => {
    if (!country?.availableSearchString) {
      if (country?.cities instanceof Array) {
        setSelectedLocation(country?.country + ', ' + crntLocation);
      } else {
        setSelectedLocation(country?.country + ', ' + country?.cities);
      }
    }
    if (country?.availableSearchString && !searchValue?.length) {
      return;
    } else {
      onClosed && onClosed(false);
      modalizeRef?.current?.close();
    }
  };
  const onChangeTextSearch = (value: string) => {
    setSearchValue(value);
    if (countryCode?.length > 0) {
      searchCity(searchValue, countryCode).then((places: any) => {
        setFindCity(places);
      });
    } else {
      searchCity(searchValue, country?.countryCode).then((places: any) => {
        setFindCity(places);
      });
    }

    if (value?.length > 0) {
      setFindCity([]);
    }
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
  // searchPlaces
  const onPressLocate = (item: any) => {
    setSelectedLocation(
      item?.structured_formatting?.main_text +
        ', ' +
        item?.terms[item?.terms.length - 1].value,
    );
    // modalizeRef?.current?.close();
    setCurrentCountry(item.description);
    RN.Keyboard.dismiss();
    setFindCity([]);
    setSearchValue(item?.structured_formatting?.main_text);
  };
  const onCancel = () => {
    // if (!searchValue?.length) {
    //   console.log('onclose, ', searchValue, searchValue.length);
    //   modalizeRef.current?.open();
    //   onClosed && onClosed(true);
    // } else {
    // onClosed && onClosed(false);
    //   modalizeRef?.current?.close();
    // }
    // if (onClosed) {
    //   onClosed(false);
    // }
    console.log('oncancel', searchValue.length);
    // if (searchValue.length <= 0) {
    //   modalizeRef?.current?.open();
    //   // onClosed && onClosed(true);
    //   return;
    // } else {
      onClosed && onClosed(false);
      modalizeRef?.current?.close();
    // }
    // onClosed && onClosed(false);
  };
  const headerLocation = () => {
    return (
      <>
        <RN.View style={styles.headerDanceStyle}>
          <RN.TouchableOpacity onPress={onClose} disabled={communityScreen}>
            <RN.Image
              source={{uri: 'backicon'}}
              style={{
                height: 20,
                width: 24,
                tintColor: communityScreen ? 'white' : 'black',
              }}
            />
          </RN.TouchableOpacity>
          <RN.View style={{alignSelf: 'center'}}>
            <RN.Text style={styles.selectorTitle}>{t('location')}</RN.Text>
          </RN.View>
          <RN.TouchableOpacity onPress={onClose}>
            <RN.Image source={{uri: 'close'}} style={{height: 24, width: 24}} />
          </RN.TouchableOpacity>
        </RN.View>
        {/* {line()} */}
      </>
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
          setSearchValue('');
          if (item?.cities instanceof Array) {
            setCrntLocation(item.cities[0]?.name);
          }
          RN.LayoutAnimation.configureNext(
            RN.LayoutAnimation.Presets.easeInEaseOut,
          );
          setIsVisibleSearchCity(true);
          setFindCity([]);
        }}>
        <RN.Text style={styles.searchItemText}>{item.country}</RN.Text>
      </RN.TouchableOpacity>
    );
  };

  return (
    <Modalize
      handlePosition="inside"
      handleStyle={handleStyle}
      ref={modalizeRef}
      modalStyle={{marginTop: statusBarHeight}}
      onClosed={onCancel}
      panGestureEnabled={false}
      tapGestureEnabled={false}
      // onClose={() => {
      //   console.log('close', searchValue, searchValue.length);
      //   if (!searchValue.length) {
      //     // onClosed && onClosed(true);
      //     modalizeRef?.current?.close();
      //   }
      // }}
      // onClosed={() => {
      //   console.log('closed', searchValue, searchValue.length);
      //   // modalizeRef?.current?.close();
      //   if (!searchValue.length) {
      //     // onClosed && onClosed(true);
      //     // modalizeRef?.current?.open('default');
      //   }
      // }}
      HeaderComponent={headerLocation()}>
      <RN.View style={{paddingHorizontal: 20}}>
        {isTabScreen ? (
          <RN.Text style={styles.placeholderTitle}>{`${t('region')} / ${t(
            'country',
          )}`}</RN.Text>
        ) : (
          <RN.Text style={styles.placeholderTitle}>{t('country')}</RN.Text>
        )}
        {/* <RN.TouchableOpacity
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
            {country?.country ? country?.country : country?.name ?? country}
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
        </RN.TouchableOpacity> */}
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
        {/* <RN.View style={{marginTop: -12}}>
          {openCountry && (
            <>
              {countries.map((c: any) => {
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
                      // console.log(c);
                      if (c?.cities instanceof Array) {
                        setCrntLocation(c.cities[0]?.name);
                      }
                      setOpenCountry(v => !v);
                      RN.LayoutAnimation.configureNext(
                        RN.LayoutAnimation.Presets.easeInEaseOut,
                      );
                    }}>
                    <RN.Text style={styles.locationText}>{c.country}</RN.Text>
                  </RN.TouchableOpacity>
                );
              })}
            </>
          )}
        </RN.View> */}
        {isVisibleSearchCity &&
          !openCountry &&
          country?.availableSearchString && (
            <>
              <Search
                autoFocus
                onSearch={onChangeTextSearch}
                searchValue={searchValue}
                placeholder={t('search_city')}
                visibleAddBtn={false}
              />
              {findCity?.map((item: city) => {
                return (
                  <RN.TouchableOpacity
                    style={{paddingVertical: 8}}
                    onPress={() => onPressLocate(item)}>
                    <RN.Text
                      style={{
                        fontSize: 16,
                        color: colors.textPrimary,
                        lineHeight: 22.4,
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
        {!country?.name && !openCountry && !country?.availableSearchString && (
          <>
            <RN.Text style={styles.placeholderTitle}>{t('location')}</RN.Text>
            {country?.cities instanceof Array ? (
              <RN.TouchableOpacity
                style={[
                  styles.selectLocationBtn,
                  {
                    borderBottomLeftRadius: openLocation ? 0 : 8,
                    borderBottomRightRadius: openLocation ? 0 : 8,
                  },
                ]}
                onPress={() => {
                  setOpenLocation(v => !v);
                  RN.LayoutAnimation.configureNext(
                    RN.LayoutAnimation.Presets.easeInEaseOut,
                  );
                }}>
                <RN.Text style={styles.locationText}>{crntLocation}</RN.Text>
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
            <RN.View style={{marginTop: -12}}>
              {openLocation &&
                country?.cities instanceof Array &&
                country?.cities?.map(c => {
                  const isLast =
                    country?.cities[country?.cities.length - 1]?.key;
                  return (
                    <RN.TouchableOpacity
                      style={[
                        styles.selectLocationBtn,
                        {
                          marginVertical: 0,
                          borderRadius: 0,
                          borderBottomLeftRadius: isLast === c?.key ? 8 : 0,
                          borderBottomRightRadius: isLast === c?.key ? 8 : 0,
                        },
                      ]}
                      onPress={() => {
                        setCrntLocation(c?.name);
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
      </RN.View>
      {/* {visibleBtn && ( */}
      <RN.View style={{paddingTop: 44}}>
        <Button title={t('confirm')} onPress={onClose} disabled />
      </RN.View>
      <RN.View style={{paddingBottom: 60}} />
      {/* // )} */}
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
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    paddingTop: 28,
    // paddingHorizontal: 24,
    color: colors.textPrimary,
  },
  selectLocationBtn: {
    // marginHorizontal: 20,
    marginVertical: 14,
    // backgroundColor: colors.lightGray,
    borderRadius: 8,
    borderBottomWidth: 0.5,
    borderColor: colors.grayTransparent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 14,
  },
  locationText: {
    paddingVertical: 16,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    // marginHorizontal: 20,
  },
  inputSearch: {
    // marginHorizontal: 20,
    marginVertical: 6,
    paddingVertical: 16,
    fontSize: 18,
    lineHeight: 22.4,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  searchItemContainer: {
    // marginHorizontal: 20,
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
});

export default FindCity;
