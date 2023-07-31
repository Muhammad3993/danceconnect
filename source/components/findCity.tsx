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

interface city {
  structured_formatting: {
    main_text: '';
  };
  terms: [{offset: 0; value: ''}, {offset: 1; value: ''}];
}
type props = {
  setSelectedLocation: (value: city) => void;
  selectedLocation?: city;
  onClosed: (val: boolean) => void;
  communityScreen?: boolean;
  boardScreen?: boolean;
  countryCode?: string;
};
const FindCity = ({
  setSelectedLocation,
  selectedLocation,
  onClosed,
  communityScreen = false,
  boardScreen = false,
  countryCode = '',
}: props) => {
  const modalizeRef = useRef<Modalize>(null);
  const {userLocation, getCurrentUser} = useProfile();
  const {countries} = useAppStateHook();
  const [openCountry, setOpenCountry] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [country, setCountry] = useState(
    countries.find(c => c.country === userLocation),
  );
  const [crntLocation, setCrntLocation] = useState<string | string[]>();

  useEffect(() => {
    if (!userLocation) {
      setCountry(countries[0]);
    }
  }, []);
  useEffect(() => {
    if (country?.cities instanceof Array) {
      setCrntLocation(country?.cities[0]?.name);
    } else {
      setCrntLocation(country?.cities);
    }
  }, []);
  // console.log('selectedLocation', crntLocation, country?.cities);
  const [searchValue, setSearchValue] = useState<string>();
  const [findCity, setFindCity] = useState([]);
  const handleStyle = {height: 3, width: 38};

  useEffect(() => {
    modalizeRef?.current?.open();
  }, []);

  const onClose = () => {
    modalizeRef?.current?.close();
    onClosed(false);
    if (!country?.availableSearchString) {
      if (country?.cities instanceof Array) {
        setSelectedLocation(country?.country + ', ' + crntLocation);
      } else {
        setSelectedLocation(country?.country + ', ' + country?.cities);
      }
    }
    // getCurrentUser();
  };
  const onChangeTextSearch = (value: string) => {
    setSearchValue(value);
    if (countryCode?.length > 0) {
      searchCity(searchValue, countryCode).then((places: any) => {
        setFindCity(places);
      });
    } else {
      searchCity(searchValue, country?.countryCode).then((places: any) => {
        // RN.LayoutAnimation.configureNext(
        //   RN.LayoutAnimation.Presets.easeInEaseOut,
        // );
        setFindCity(places);
      });
    }

    if (value?.length > 0) {
      setFindCity([]);
    }
  };
  // searchPlaces
  const onPressLocate = (item: any) => {
    // console.log(item);
    if (boardScreen) {
      setSelectedLocation(item);
      modalizeRef?.current?.close();
      onClosed(false);
    } else {
      setSelectedLocation(
        item?.structured_formatting?.main_text + ', ' + item?.terms[1].value,
      );
    }

    RN.Keyboard.dismiss();
    setFindCity([]);
    setSearchValue(item?.structured_formatting?.main_text);
  };
  const onCancel = () => {
    onClosed(false);
    modalizeRef?.current?.close();
  };
  const headerLocation = () => {
    return (
      <>
        <RN.View style={styles.headerDanceStyle}>
          <RN.TouchableOpacity onPress={onCancel}>
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
            <RN.Text style={styles.selectorTitle}>Location</RN.Text>
          </RN.View>
          <RN.TouchableOpacity onPress={onCancel}>
            <RN.Image source={{uri: 'close'}} style={{height: 24, width: 24}} />
          </RN.TouchableOpacity>
        </RN.View>
        {/* {line()} */}
      </>
    );
  };
  if (boardScreen) {
    return (
      <Modalize
        handlePosition="inside"
        handleStyle={handleStyle}
        ref={modalizeRef}
        onClosed={onCancel}
        HeaderComponent={headerLocation()}>
        <RN.View style={{paddingHorizontal: 20}}>
          <Search
            autoFocus
            onSearch={onChangeTextSearch}
            searchValue={searchValue}
            placeholder="Search location"
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
        </RN.View>
      </Modalize>
    );
  }
  return (
    <Modalize
      handlePosition="inside"
      handleStyle={handleStyle}
      ref={modalizeRef}
      onClosed={onCancel}
      HeaderComponent={headerLocation()}>
      <RN.View style={{paddingHorizontal: 20}}>
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
            {country?.country ? country?.country : country}
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
        </RN.View>
        {!openCountry && country?.availableSearchString && (
          <>
            <Search
              autoFocus
              onSearch={onChangeTextSearch}
              searchValue={searchValue}
              placeholder="Search location"
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
        {!openCountry && !country?.availableSearchString && (
          <>
            <RN.Text style={styles.placeholderTitle}>Location</RN.Text>
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
        <Button title="Confirm" onPress={onClose} disabled />
      </RN.View>
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
});

export default FindCity;
