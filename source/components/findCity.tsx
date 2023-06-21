import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import {Modalize} from 'react-native-modalize';
import Search from './search';
import {searchCity} from '../api/cities';
import colors from '../utils/colors';

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
};
const FindCity = ({setSelectedLocation, selectedLocation, onClosed}: props) => {
  const modalizeRef = useRef<Modalize>(null);
  const [searchValue, setSearchValue] = useState<string>(
    selectedLocation?.structured_formatting?.main_text ?? '',
  );
  const [findCity, setFindCity] = useState([]);
  const handleStyle = {height: 3, width: 38};

  useEffect(() => {
    modalizeRef?.current?.open();
  }, []);

  const onChangeTextSearch = (value: string) => {
    setSearchValue(value);
    searchCity(searchValue).then((places: any) => setFindCity(places));
    if (value?.length > 0) {
      setFindCity([]);
    }
  };
  // searchPlaces
  const onPressLocate = (item: any) => {
    setSelectedLocation(item);
    // setSelectedLocation(item?.structured_formatting?.main_text);
    modalizeRef?.current?.close();
    onClosed(false);
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
              style={{height: 20, width: 24}}
            />
          </RN.TouchableOpacity>
          <RN.Text style={styles.selectorTitle}>Location</RN.Text>
          <RN.TouchableOpacity onPress={onCancel}>
            <RN.Image source={{uri: 'close'}} style={{height: 24, width: 24}} />
          </RN.TouchableOpacity>
        </RN.View>
        {/* {line()} */}
      </>
    );
  };
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
});

export default FindCity;
