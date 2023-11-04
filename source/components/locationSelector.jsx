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

const LocationSelector = ({setSelectedLocation, isProfileScreen}) => {
  const modalizeRef = useRef();
  const {countries, onChoosedCity} = useAppStateHook();
  const {onChangeUserCountry} = useProfile();
  const {isAuthorized, currentUser} = useRegistration();
  const handleStyle = {height: 3, width: 38};
  const [currentCity, setCurrentCity] = useState('');
  const [searchValue, setSearchValue] = useState();
  const [searchCities, setSearchCities] = useState([]);

  const [currentCountry, setCurrentCountry] = useState({
    country: 'Choose country',
    availableSearchString: false,
    // cities: [],
    countryCode: '',
  });
  // isAuthorized ? currentUser?.userCountry : 'Choose country', //TODO
  const [openCountry, setOpenCountry] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const onOpen = () => modalizeRef?.current?.open();
  const onPressCountry = c => {
    if (currentCountry.countryCode !== c.countryCode) {
      setSearchValue('');
      setCurrentCountry({});
      setCurrentCity('');
      if (c.cities instanceof Array) {
        setCurrentCity(c.country + ', ' + c.cities[0].name);
        setSelectedLocation(c.country + ', ' + c.cities[0].name);
      }
      if (typeof c.cities === 'string') {
        setCurrentCity(c.country + ', ' + c.cities);
        setSelectedLocation(c.country + ', ' + c.cities);
      }
    }
    setCurrentCountry(c);
    setOpenCountry(v => !v);
  };
  useEffect(() => {
    if (currentCity) {
      setSearchValue(currentCity.split(', ')[0]);
    }
  }, [currentCity]);
  const onChangeTextSearch = value => {
    setSearchValue(value);

    if (value?.length <= 1) {
      setSearchCities([]);
    } else {
      searchCity(searchValue, currentCountry.countryCode).then(places => {
        setSearchCities(places);
      });
    }
  };
  const onPressLocate = item => {
    const city =
      item?.structured_formatting?.main_text + ', ' + item?.terms[1].value;
    setCurrentCity(city);
    setSelectedLocation(city);
    setSearchCities([]);
  };
  const onPressConfirm = () => {
    if (currentCity) {
      modalizeRef?.current?.close();
    } else {
      return;
    }
    if (isProfileScreen) {
      onChoosedCity(currentCity);
      onChangeUserCountry(currentCity);
    }
  };

  const renderHeader = () => {
    return (
      <RN.View style={styles.headerWrapper}>
        <RN.View style={{width: 22}} />
        <RN.View style={{alignSelf: 'center'}}>
          <RN.Text style={styles.title}>Location</RN.Text>
        </RN.View>
        <RN.TouchableOpacity
          onPress={() => modalizeRef?.current?.close()}
          style={styles.justifyCenter}>
          <RN.Image source={{uri: 'close'}} style={styles.backIcon} />
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  return (
    <>
      {!isProfileScreen && (
        <>
          <RN.Text style={styles.placeholderTitle}>Location</RN.Text>
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
              {currentCity?.length > 0 ? currentCity : 'Choose Location'}
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
              <RN.Text style={styles.listItemText}>Location</RN.Text>
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
          <RN.Text style={styles.placeholderTitle}>{'Country'}</RN.Text>
          <RN.TouchableOpacity
            onPress={() => {
              setOpenCountry(v => !v);
              setSearchCities([]);
            }}
            style={[
              styles.chooseCountryWrapper,
              {
                borderBottomLeftRadius: openCountry ? 0 : 8,
                borderBottomRightRadius: openCountry ? 0 : 8,
              },
            ]}
            activeOpacity={0.7}>
            <RN.Text style={styles.chooseCountryText}>
              {currentCountry?.country}
            </RN.Text>
            <RN.View style={styles.justifyCenter}>
              <RN.Image source={{uri: 'arrowdown'}} style={styles.backIcon} />
            </RN.View>
          </RN.TouchableOpacity>
          {openCountry && (
            <RN.View style={{marginTop: -14}}>
              {countries.map(c => {
                const isLast = countries[countries.length - 1].id;
                return (
                  <RN.TouchableOpacity
                    onPress={() => onPressCountry(c)}
                    style={[
                      styles.chooseCountryWrapperOpened,
                      {
                        borderBottomLeftRadius: isLast === c.id ? 8 : 0,
                        borderBottomRightRadius: isLast === c.id ? 8 : 0,
                      },
                    ]}>
                    <RN.Text style={styles.chooseCountryTextOpened}>
                      {c.country}
                    </RN.Text>
                  </RN.TouchableOpacity>
                );
              })}
            </RN.View>
          )}
          {!openCountry && currentCountry.availableSearchString && (
            <RN.View style={{paddingHorizontal: 24}}>
              <Search
                onSearch={onChangeTextSearch}
                searchValue={searchValue}
                placeholder="Search place"
                visibleAddBtn={false}
              />
              {searchCities?.map(item => {
                return (
                  <RN.TouchableOpacity onPress={() => onPressLocate(item)}>
                    <RN.Text
                      style={{
                        fontSize: 16,
                        color: colors.textPrimary,
                        lineHeight: 22.4,
                        padding: 8,
                      }}>
                      {item?.structured_formatting?.main_text +
                        ', ' +
                        item?.terms[1]?.value}
                    </RN.Text>
                  </RN.TouchableOpacity>
                );
              })}
            </RN.View>
          )}
          {!openCountry && !currentCountry.availableSearchString && (
            <RN.View>
              {currentCountry?.cities instanceof Array && (
                <>
                  <RN.Text style={styles.placeholderTitle}>
                    {'Location'}
                  </RN.Text>
                  <RN.TouchableOpacity
                    onPress={() => {
                      setOpenCity(v => !v);
                    }}
                    style={[
                      styles.chooseCountryWrapper,
                      {
                        borderBottomLeftRadius: openCity ? 0 : 8,
                        borderBottomRightRadius: openCity ? 0 : 8,
                        marginTop: 2,
                      },
                    ]}
                    activeOpacity={0.7}>
                    <RN.Text style={styles.chooseCountryText}>
                      {currentCity
                        ? currentCity?.split(', ')[1]
                        : currentCountry?.cities[0].name}
                    </RN.Text>
                    <RN.View style={styles.justifyCenter}>
                      <RN.Image
                        source={{uri: 'arrowdown'}}
                        style={styles.backIcon}
                      />
                    </RN.View>
                  </RN.TouchableOpacity>
                  <RN.View style={{marginTop: openCity ? -14 : 0}}>
                    {openCity &&
                      currentCountry?.cities.map(i => {
                        const isLast =
                          currentCountry?.cities[
                            currentCountry?.cities.length - 1
                          ]?.key;
                        return (
                          <RN.TouchableOpacity
                            onPress={() => {
                              setOpenCity(v => !v);
                              setCurrentCity(
                                currentCountry.country + ', ' + i.name,
                              );
                              setSelectedLocation(
                                currentCountry.country + ', ' + i.name,
                              );
                            }}
                            style={[
                              styles.chooseCountryWrapperOpened,
                              {
                                borderBottomLeftRadius:
                                  isLast === i.key ? 8 : 0,
                                borderBottomRightRadius:
                                  isLast === i.key ? 8 : 0,
                              },
                            ]}
                            activeOpacity={0.7}>
                            <RN.Text style={styles.chooseCountryTextOpened}>
                              {i.name}
                            </RN.Text>
                          </RN.TouchableOpacity>
                        );
                      })}
                  </RN.View>
                </>
              )}
              {typeof currentCountry?.cities === 'string' && (
                <>
                  <RN.Text style={styles.placeholderTitle}>
                    {'Location'}
                  </RN.Text>
                  <RN.View style={styles.chooseCountryWrapper}>
                    <RN.Text style={styles.chooseCountryText}>
                      {currentCountry?.cities}
                    </RN.Text>
                  </RN.View>
                </>
              )}
            </RN.View>
          )}
          <RN.View style={{paddingTop: 44, marginHorizontal: 14}}>
            <Button title="Confirm" onPress={onPressConfirm} disabled />
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
    marginHorizontal: 24,
    backgroundColor: colors.lightGray,
    borderColor: colors.grayTransparent,
    borderWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  chooseCountryText: {
    paddingVertical: 18,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  chooseCountryTextOpened: {
    paddingVertical: 18,
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
    color: colors.darkGray,
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
});
export default LocationSelector;
