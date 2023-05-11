import React, {useEffect, useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';

//arrowdown
enum Item {
  id = 0,
  country = '',
  cities = '',
  places = '',
}
type selectionProps = {
  onChooseCity: (value: string) => void;
  selectedCity: string;
  onChooseCountry: (value: string) => void;
  selectedCountry: string;
  onChoosePlace: (value: string) => void;
  selectedPlace: string;
  data: string[keyof Item];
  isEvent?: boolean;
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
}: selectionProps) => {
  const [currentCounty, setCurrentCountry] = useState(
    data[0]?.country ?? selectedCountry,
  );
  const [isOpenedCountry, setIsOpenedCountry] = useState(false);
  const [isOpenedCities, setIsOpenedCities] = useState(false);
  const [isOpenedPlaces, setIsOpenedPlaces] = useState(false);
  const [currentCity, setCurrentCity] = useState(selectedCity);
  const [currentPlace, setCurrentPlace] = useState(
    data[0]?.places[0] ?? selectedPlace,
  );

  const onPressCountry = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setIsOpenedCountry(false);
    setCurrentCountry(value);
    onChooseCountry(value);
    onPressCity(
      data?.filter((item: typeof Item) => item.country === value)[0]?.cities[0],
    );
  };

  useEffect(() => {
    onPressCity(
      data?.filter((item: typeof Item) => item.country === currentCounty)[0]
        ?.cities,
    );
  }, []);
  const onPressCity = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setIsOpenedCities(false);
    setCurrentCity(value);
    onChooseCity(value);
  };
  const onPressPlace = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setIsOpenedPlaces(false);
    onChoosePlace(value);
    setCurrentPlace(value);
  };
  const renderCountry = () => {
    return (
      <>
        <RN.Text style={styles.title}>Choose Location</RN.Text>
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
  const cities = data?.find(
    (item: typeof Item) => item?.country === currentCounty,
  )?.cities;
  const places = data?.find(
    (item: typeof Item) => item?.country === currentCounty,
  )?.places;

  const renderCity = () => {
    return (
      <>
        <RN.Text style={styles.title}>City / Province</RN.Text>
        <RN.TouchableOpacity
          style={[
            styles.selectContainer,
            {
              borderBottomLeftRadius: isOpenedCities ? 0 : 8,
              borderBottomRightRadius: isOpenedCities ? 0 : 8,
            },
          ]}
          onPress={() => setIsOpenedCities(val => !val)}>
          <RN.Text style={styles.selectItemText}>{currentCity}</RN.Text>
          <RN.Image
            source={{uri: 'arrowdown'}}
            style={{height: 20, width: 20}}
          />
        </RN.TouchableOpacity>
        {isOpenedCities && (
          <RN.View>
            {cities.map((item: string, index: number) => {
              const isLastItem = cities[cities.length - 1];
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
                  <RN.Text style={styles.selectItemText}>{item}</RN.Text>
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
        <RN.TouchableOpacity
          style={[
            styles.selectContainer,
            {
              borderBottomLeftRadius: isOpenedPlaces ? 0 : 8,
              borderBottomRightRadius: isOpenedPlaces ? 0 : 8,
            },
          ]}
          onPress={() => setIsOpenedPlaces(val => !val)}>
          <RN.Text style={styles.selectItemText}>{currentPlace}</RN.Text>
          <RN.Image
            source={{uri: 'arrowdown'}}
            style={{height: 20, width: 20}}
          />
        </RN.TouchableOpacity>
        {isOpenedPlaces && (
          <RN.View>
            {places.map((item: string, index: number) => {
              const isLastItem = places[places.length - 1];
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
                  <RN.Text style={styles.selectItemText}>{item}</RN.Text>
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
      {renderCountry()}
      {renderCity()}
      {isEvent && currentCounty === 'Indonesia' && renderPlace()}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  title: {
    fontFamily: 'Mulish-Regular',
    paddingVertical: 8,
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: colors.textPrimary,
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
  },
  selectContainerIsOpened: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderRadius: 0,
  },
  selectItemText: {
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '400',
    color: colors.darkGray,
  },
});

export default LocationSelection;