import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import {
  searchCities,
  searchPlaces,
  searchPlacesInEvent,
  searchStateOfUSA,
} from '../api/cities';
import {Input} from './input';
enum Item {
  id = 0,
  country = '',
  cities = '',
  places = '',
  countryCode = '',
}
type selectionProps = {
  onChooseCity: (value: string) => void;
  selectedCity: string;
  onChooseCountry: (value: string) => void;
  selectedCountry: string;
  onChoosePlace: (value: string) => void;
  selectedPlace: any;
  data: string[keyof Item];
  isEvent?: boolean;
  isErrors?: boolean;
};
const LocationSelection = ({
  data,
  onChooseCountry,
  selectedCountry,
  onChooseCity,
  selectedCity,
  onChoosePlace,
  selectedPlace,
  isEvent = false,
  isErrors = false,
}: selectionProps) => {
  const [currentCounty, setCurrentCountry] = useState(selectedCountry ?? '');
  const [isOpenedCountry, setIsOpenedCountry] = useState(false);
  const [currentCity, setCurrentCity] = useState(selectedCity ?? '');
  const [currentPlace, setCurrentPlace] = useState('');

  const countryCode = data?.find(
    (it: typeof Item) => it.country === currentCounty,
  )?.countryCode;

  const [citiesGeocode, setCitiesGeocode] = useState([]);
  const [placesGeocode, setPlacesGeocode] = useState([]);
  const [placesInEventGeocode, setPlacesInEventGeocode] = useState([]);
  const [searchValue, setSearchValue] = useState(selectedCity ?? '');
  const [searchPlace, setSearchPlace] = useState(selectedCountry ?? '');
  const [searchPlaceInEvent, setSearchPlaceInEvent] = useState(
    selectedPlace ?? '',
  );

  const onPressCountry = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setIsOpenedCountry(false);
    setCurrentCountry(value);
    onChooseCountry(value);
    setSearchValue('');
    // onPressState(citiesGeocode[0] ?? '');
  };
  const onSearchPlace = (value: string) => {
    setSearchPlaceInEvent(value);
    searchPlacesInEvent(currentCounty, currentCity, value).then((cities: any) =>
      setPlacesInEventGeocode(
        cities?.map((city: any) => city?.structured_formatting),
      ),
    );
  };
  const onSearchState = (value: string) => {
    setSearchValue(value);
    searchStateOfUSA(value).then((cities: any) =>
      setCitiesGeocode(cities?.map((city: any) => city?.structured_formatting)),
    );
  };
  const onSearchCity = (value: string) => {
    setSearchPlace(value);
    // console.log('onsearch', currentCity);
    searchPlaces(searchValue, currentCity, value).then((places: any) =>
      setPlacesGeocode(
        places?.map((place: any) => place?.structured_formatting),
      ),
    );
  };

  const onPressState = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setCurrentCity(value?.main_text);
    onChooseCountry(value?.main_text);
    setCitiesGeocode([]);
    setSearchValue(value?.main_text);
  };
  const onPressCity = (value: string) => {
    // console.log(value);
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    // setCurrentPlace(value?.main_text);
    onChooseCity(value?.main_text);
    setPlacesGeocode([]);
    setSearchPlace(value?.main_text);
  };
  const onPressPlace = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setCurrentPlace(value?.main_text);
    setSearchPlaceInEvent(value?.main_text);
    onChoosePlace(value?.main_text);
    setPlacesInEventGeocode([]);
  };

  const renderCountry = () => {
    return (
      <>
        <RN.Text style={styles.title}>Country</RN.Text>
        <RN.TouchableOpacity
          style={[
            styles.selectContainer,
            {
              borderBottomLeftRadius: isOpenedCountry ? 0 : 8,
              borderBottomRightRadius: isOpenedCountry ? 0 : 8,
            },
          ]}
          onPress={() => setIsOpenedCountry(val => !val)}>
          <RN.Text style={styles.selectItemText}>{currentCounty}</RN.Text>
          <RN.Animated.Image
            source={{uri: 'arrowdown'}}
            style={{height: 20, width: 20}}
          />
        </RN.TouchableOpacity>
        {isOpenedCountry && (
          <RN.View>
            {data?.map((item: typeof Item) => {
              const isLastItem = data[data.length - 1];
              return (
                <RN.TouchableOpacity
                  key={item?.id}
                  style={[
                    styles.selectContainerIsOpened,
                    {
                      borderBottomLeftRadius: item === isLastItem ? 8 : 0,
                      borderBottomRightRadius: item === isLastItem ? 8 : 0,
                    },
                  ]}
                  onPress={() => onPressCountry(item?.country)}>
                  <RN.Text style={styles.selectItemText}>
                    {item?.country}
                  </RN.Text>
                </RN.TouchableOpacity>
              );
            })}
          </RN.View>
        )}
      </>
    );
  };

  const renderState = () => {
    return (
      <>
        <RN.Text style={styles.title}>State</RN.Text>
        <Input
          value={searchValue}
          onChange={onSearchState}
          isErrorBorder={isErrors}
          placeholder="Search state"
        />
        {citiesGeocode?.length > 0 && (
          <RN.View style={{marginTop: -24}}>
            {citiesGeocode.map((item: string, index: number) => {
              const isLastItem = citiesGeocode[citiesGeocode.length - 1];
              return (
                <RN.TouchableOpacity
                  key={index}
                  style={[
                    styles.selectContainerIsOpened,
                    {
                      borderBottomLeftRadius: item === isLastItem ? 8 : 0,
                      borderBottomRightRadius: item === isLastItem ? 8 : 0,
                    },
                  ]}
                  onPress={() => onPressState(item)}>
                  <RN.Text style={styles.selectItemText}>
                    {item?.main_text}
                  </RN.Text>
                  <RN.Text style={{color: colors.darkGray}}>
                    {item?.secondary_text}
                  </RN.Text>
                </RN.TouchableOpacity>
              );
            })}
          </RN.View>
        )}
      </>
    );
  };
  // если 1 строкой = city
  const renderCity = () => {
    return (
      <>
        <RN.Text style={styles.title}>City</RN.Text>
        <Input
          value={searchPlace}
          onChange={onSearchCity}
          placeholder="Search city"
          isErrorBorder={isErrors}
        />
        {placesGeocode?.length > 0 && (
          <RN.View style={{marginTop: -24}}>
            {placesGeocode.map((item: string, index: number) => {
              const isLastItem = placesGeocode[placesGeocode.length - 1];
              return (
                <RN.TouchableOpacity
                  key={index}
                  style={[
                    styles.selectContainerIsOpened,
                    {
                      borderBottomLeftRadius: item === isLastItem ? 8 : 0,
                      borderBottomRightRadius: item === isLastItem ? 8 : 0,
                    },
                  ]}
                  onPress={() => onPressCity(item)}>
                  <RN.Text style={styles.selectItemText}>
                    {item?.main_text}
                  </RN.Text>
                  <RN.Text style={{color: colors.darkGray}}>
                    {item?.secondary_text}
                  </RN.Text>
                </RN.TouchableOpacity>
              );
            })}
          </RN.View>
        )}
      </>
    );
  };
  const renderPlace = () => {
    return (
      <>
        <RN.Text style={styles.title}>Place</RN.Text>
        <Input
          value={searchPlaceInEvent}
          onChange={onSearchPlace}
          isErrorBorder={isErrors}
          placeholder="Search place"
        />
        {placesInEventGeocode?.length > 0 && (
          <RN.View style={{marginTop: -24}}>
            {placesInEventGeocode.map((item: string, index: number) => {
              const isLastItem =
                placesInEventGeocode[placesInEventGeocode.length - 1];
              return (
                <RN.TouchableOpacity
                  key={index}
                  style={[
                    styles.selectContainerIsOpened,
                    {
                      borderBottomLeftRadius: item === isLastItem ? 8 : 0,
                      borderBottomRightRadius: item === isLastItem ? 8 : 0,
                    },
                  ]}
                  onPress={() => onPressPlace(item)}>
                  <RN.Text style={styles.selectItemText}>
                    {item?.main_text}
                  </RN.Text>
                  <RN.Text style={{color: colors.darkGray}}>
                    {item?.secondary_text}
                  </RN.Text>
                </RN.TouchableOpacity>
              );
            })}
          </RN.View>
        )}
      </>
    );
  };
  return (
    <RN.View style={styles.container}>
      {/* {renderCountry()} */}
      {renderState()}
      {renderCity()}
      {isEvent && renderPlace()}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    marginHorizontal: 6,
  },
  title: {
    fontFamily: 'Mulish-Regular',
    paddingVertical: 8,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: colors.textPrimary,
    marginHorizontal: 14,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  selectContainerIsOpened: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderRadius: 0,
    marginHorizontal: 16,
  },
  selectItemText: {
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '400',
    color: colors.textPrimary,
  },
});

export default LocationSelection;
