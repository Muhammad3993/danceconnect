import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import {Modalize} from 'react-native-modalize';
import Search from './search';
import {searchCity} from '../api/cities';
import colors from '../utils/colors';
import {useProfile} from '../hooks/useProfile';
import {countries} from '../utils/constants';
import {Button} from './Button';

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
};
const FindCity = ({
  setSelectedLocation,
  selectedLocation,
  onClosed,
  communityScreen = false,
  boardScreen = false,
}: props) => {
  const modalizeRef = useRef<Modalize>(null);
  const {userLocation, getCurrentUser} = useProfile();
  const [openCountry, setOpenCountry] = useState(false);
  const [country, setCountry] = useState(
    countries.find(c => c.country === userLocation),
  );
  const [visibleBtn, setVisibleBtn] = useState(
    userLocation !== 'USA' ? true : false,
  );

  useEffect(() => {
    if (!userLocation) {
      setCountry(countries[0]);
    }
  }, []);
  // console.log('selectedLocation', selectedLocation);
  const [searchValue, setSearchValue] = useState<string>();
  const [findCity, setFindCity] = useState([]);
  const handleStyle = {height: 3, width: 38};

  useEffect(() => {
    modalizeRef?.current?.open();
  }, []);

  const onClose = () => {
    modalizeRef?.current?.close();
    onClosed(false);
    if (country?.countryCode !== 'USA') {
      setSelectedLocation(country?.country + ', ' + country?.cities);
    }
    getCurrentUser();
  };
  const onChangeTextSearch = (value: string) => {
    setVisibleBtn(false);
    setSearchValue(value);
    searchCity(searchValue).then((places: any) => {
      RN.LayoutAnimation.configureNext(
        RN.LayoutAnimation.Presets.easeInEaseOut,
      );
      setFindCity(places);
    });
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
    setVisibleBtn(true);
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
        {country?.countryCode === 'USA' && (
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
        {country?.countryCode !== 'USA' && (
          <>
            <RN.Text style={styles.placeholderTitle}>Location</RN.Text>
            <RN.View style={styles.selectLocationBtn}>
              <RN.Text style={styles.locationText}>
                {country?.cities ? country?.cities : country}
              </RN.Text>
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
