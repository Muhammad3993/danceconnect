import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDCStore } from 'store';
import { DCCountry } from 'data/api/collections/interfaces';
import { theming } from 'common/constants/theming';
import { DCInput } from 'components/shared/input';
import { DCButton } from 'components/shared/button';
import { useSearchCities } from 'data/hooks/collections';
import { useDebounceValue } from 'common/hooks/useDebounceValue';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { DCBottomSheet } from 'components/shared/bottom_sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserLocation } from 'data/api/user/inerfaces';

interface Props {
  value?: string;
  onChange?: (val: UserLocation) => void;
  inputStyle?: ViewStyle;
}

export function LocationSelector({ value = '', onChange, inputStyle }: Props) {
  const { t } = useTranslation();
  const { bottom, top } = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const constants = useDCStore.use.constants();
  const [searchCountryText, setSearchCountryText] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<DCCountry | null>(
    null,
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const snapPoints = useMemo(() => ['100%'], []);

  const countriesSearchValue = useMemo(() => {
    const countries = constants?.countries ?? [];

    if (searchCountryText.trim().length > 0) {
      const search = countries.filter(item => {
        const itemData = `${item.country?.toLowerCase()}`;
        const textData = searchCountryText.toLowerCase();
        return itemData.includes(textData);
      });
      return search;
    } else {
      return [];
    }
  }, [constants?.countries, searchCountryText]);

  const handleSelectCountry = (data: DCCountry) => {
    if (!data.availableSearchString && data.cities) {
      setSelectedCity(
        Array.isArray(data.cities) ? data.cities[0].name : data.cities,
      );
    }

    setSelectedCountry(data);
  };

  const handleSearchCountry = (text: string) => {
    setSelectedCity(null);
    setSelectedCountry(null);
    setSearchCountryText(text);
  };

  const handleSelectLocation = () => {
    bottomSheetModalRef.current?.close();
    onChange?.({
      city: selectedCity!,
      country: selectedCountry!.country,
      countryCode2: selectedCountry!.countryCode,
      countryCode3: selectedCountry!.countryCode,
      location: selectedCountry!.country + ', ' + selectedCity,
    });
  };

  const presentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handle = useCallback(() => {
    return (
      <View style={[styles.headerWrapper, { paddingTop: top + 24 }]}>
        <View style={{ width: 22 }} />
        <View style={{ alignSelf: 'center' }}>
          <Text style={styles.title}>{t('location')}</Text>
        </View>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => bottomSheetModalRef?.current?.close()}>
          {/* <Image source={{ uri: 'close' }} style={styles.backIcon} /> */}
        </TouchableOpacity>
      </View>
    );
  }, [t, top]);

  return (
    <>
      <View style={inputStyle}>
        <TouchableOpacity
          onPress={presentModal}
          style={styles.chooseCountryWrapper}
          activeOpacity={0.7}>
          <Text style={styles.chooseCountryText}>
            {value?.length > 0 ? value : t('location_choose')}
          </Text>
          <View style={styles.justifyCenter}>
            {/* <Image source={{ uri: 'arrowdown' }} style={styles.backIcon} /> */}
          </View>
        </TouchableOpacity>
      </View>
      <DCBottomSheet
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        handleComponent={handle}
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}>
        <BottomSheetView
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingVertical: 16,
            paddingBottom: bottom,
          }}>
          <DCInput
            forBottomSheet
            placeholder="Search Country"
            containerStyle={{ marginBottom: 24 }}
            inputStyle={styles.inputSearch}
            value={
              selectedCountry !== null
                ? selectedCountry.country
                : searchCountryText
            }
            onChangeText={handleSearchCountry}
            placeholderTextColor={theming.colors.darkGray}
          />

          {selectedCountry == null && countriesSearchValue.length > 0 && (
            <BottomSheetFlatList
              showsVerticalScrollIndicator={false}
              style={{ flex: 1, marginBottom: 24 }}
              data={countriesSearchValue}
              keyExtractor={item => item.country}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={styles.searchItemContainer}
                    key={item.countryCode}
                    onPress={() => handleSelectCountry(item)}>
                    <Text style={styles.searchItemText}>{item.country}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          {selectedCountry !== null &&
            selectedCountry.availableSearchString && (
              <CitySearch
                selectedCountry={selectedCountry}
                onSelectCity={setSelectedCity}
                selectedCity={selectedCity}
              />
            )}
          {selectedCountry !== null &&
            !selectedCountry.availableSearchString && (
              <CityPicker
                selectedCountry={selectedCountry}
                onSelectCity={setSelectedCity}
                selectedCity={selectedCity}
              />
            )}

          <DCButton
            onPress={handleSelectLocation}
            disabled={selectedCountry == null && selectedCity == null}
            containerStyle={{ marginTop: 'auto' }}
            title={t('confirm')}
          />
        </BottomSheetView>
      </DCBottomSheet>
    </>
  );
}

interface CityPickerProps {
  selectedCountry: DCCountry;
  onSelectCity: (city: string | null) => void;
  selectedCity: string | null;
}

const CitySearch = ({
  selectedCountry,
  onSelectCity,
  selectedCity,
}: CityPickerProps) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [debounceText] = useDebounceValue(searchText);
  const { data } = useSearchCities(debounceText, selectedCountry);

  const searchCities = data?.predictions ?? [];

  const handleSearch = (text: string) => {
    onSelectCity(null);
    setSearchText(text);
  };
  const onPickCity = (city: string) => {
    onSelectCity(city);
    setSearchText(city);
  };

  return (
    <>
      <DCInput
        onChangeText={handleSearch}
        value={selectedCity ?? searchText}
        placeholder={t('search_city')}
      />
      {selectedCity == null &&
        searchCities.map(item => {
          const mainText = item.structured_formatting.main_text;
          const cityName = mainText + ', ' + item.terms[0].value;
          return (
            <TouchableOpacity
              style={{ paddingVertical: 8 }}
              onPress={() => onPickCity(mainText)}>
              <Text
                style={{
                  fontSize: 16,
                  color: theming.colors.textPrimary,
                  lineHeight: 22.4,
                }}>
                {cityName}
              </Text>
            </TouchableOpacity>
          );
        })}
    </>
  );
};

const CityPicker = ({
  selectedCountry,
  onSelectCity,
  selectedCity,
}: CityPickerProps) => {
  const [openList, setOpenList] = useState(false);

  const cities = Array.isArray(selectedCountry.cities)
    ? selectedCountry.cities
    : [{ key: 0, name: selectedCountry.cities! }];

  const isMultipleSelect = Array.isArray(selectedCountry.cities);

  return (
    <>
      <TouchableOpacity
        disabled={!isMultipleSelect}
        style={styles.selectLocationBtn}
        onPress={() => setOpenList(true)}>
        <Text style={styles.locationText}>{selectedCity}</Text>
        {isMultipleSelect && (
          <View style={styles.justifyCenter}>
            {/* <Image source={{ uri: 'arrowdown' }} style={styles.backIcon} /> */}
          </View>
        )}
      </TouchableOpacity>

      {openList &&
        cities.map((city, idx) => {
          const isLast = idx === cities.length - 1;
          return (
            <TouchableOpacity
              onPress={() => {
                onSelectCity(city.name);
                setOpenList(false);
              }}
              style={[
                styles.chooseCountryWrapperOpened,
                {
                  borderBottomLeftRadius: isLast ? 8 : 0,
                  borderBottomRightRadius: isLast ? 8 : 0,
                },
              ]}
              activeOpacity={0.7}>
              <Text style={styles.chooseCountryTextOpened}>{city.name}</Text>
            </TouchableOpacity>
          );
        })}
    </>
  );
};

const styles = StyleSheet.create({
  justifyCenter: {
    justifyContent: 'center',
    height: 15,
    width: 15,
    backgroundColor: 'red',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
  },
  backIcon: {
    height: 20,
    width: 20,
    backgroundColor: 'red',
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    color: theming.colors.textPrimary,
  },
  chooseCountryWrapper: {
    backgroundColor: theming.colors.lightGray,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: theming.colors.grayTransparent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  chooseCountryWrapperOpened: {
    borderColor: theming.colors.grayTransparent,
    borderBottomWidth: 0.5,
    marginHorizontal: 6,
  },
  chooseCountryText: {
    paddingVertical: 18,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: theming.colors.textPrimary,
  },
  chooseCountryTextOpened: {
    paddingVertical: 8,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: theming.colors.textPrimary,
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
    color: theming.colors.textPrimary,
    fontWeight: '500',
  },
  locationText: {
    fontSize: 16,
    lineHeight: 22.4,
    paddingRight: 20,
    letterSpacing: 0.2,
    color: theming.colors.textPrimary,
  },
  iconRight: {
    height: 14,
    width: 14,
    tintColor: theming.colors.textPrimary,
  },
  icon: {
    height: 28,
    width: 28,
    tintColor: '#424242',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: theming.colors.gray,
    marginHorizontal: 20,
  },
  inputSearch: {
    fontSize: 18,
    fontWeight: '500',
    color: theming.colors.textPrimary,
  },
  searchItemContainer: {
    borderBottomColor: theming.colors.gray,
    borderBottomWidth: 0.5,
  },
  searchItemText: {
    fontSize: 16,
    lineHeight: 22.4,
    color: theming.colors.textPrimary,
    marginVertical: 12,
    fontWeight: '500',
  },
  selectLocationBtn: {
    borderBottomWidth: 0.5,
    borderColor: theming.colors.grayTransparent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
});
export default LocationSelector;
