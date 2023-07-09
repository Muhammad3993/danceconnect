import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import {Modalize} from 'react-native-modalize';
import Search from './search';
import {searchPlacesInEvent} from '../api/cities';
import colors from '../utils/colors';

interface city {
  structured_formatting: {
    main_text: '';
  };
  terms: [{offset: 0; value: ''}, {offset: 1; value: ''}];
}
type props = {
  setSelectedPlace: (value: string) => void;
  selectedPlace?: string;
  onClosed: (val: boolean) => void;
  crntCity: city;
};
const FindPlace = ({
  setSelectedPlace,
  selectedPlace,
  onClosed,
  crntCity,
}: props) => {
  const modalizeRef = useRef<Modalize>(null);
  const [searchValue, setSearchValue] = useState<string>(selectedPlace ?? '');
  const [findPlace, setFindPlices] = useState([]);
  const handleStyle = {height: 3, width: 38};

  console.log(crntCity?.structured_formatting?.main_text);
  useEffect(() => {
    modalizeRef?.current?.open();
  }, []);

  const onChangeTextSearch = (value: string) => {
    setSearchValue(value);
    const city = crntCity?.structured_formatting?.main_text ?? crntCity;
    searchPlacesInEvent(city, searchValue).then((places: any) => {
      // console.log(places);
      setFindPlices(places);
    });
    if (value?.length > 0) {
      setFindPlices([]);
    }
  };
  // searchPlaces
  const onPressLocate = (item: any) => {
    // setSelectedPlace(item);
    setSelectedPlace(item?.structured_formatting?.main_text);
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
          <RN.Text style={styles.selectorTitle}>Choose Place</RN.Text>
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
          placeholder="Search place"
          visibleAddBtn={false}
        />
        {findPlace?.map((item: city) => {
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

export default FindPlace;