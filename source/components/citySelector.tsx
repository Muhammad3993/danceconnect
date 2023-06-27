import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import Search from './search';
import {searchCity} from '../api/cities';
import colors from '../utils/colors';

type modalProps = {
  opening: boolean;
  onClose: () => void;
  onChoosedCity: (value: string) => void;
};
const CitySelector = ({onClose, opening, onChoosedCity}: modalProps) => {
  const modalizeRef = useRef<Modalize>(null);
  const handleStyle = {height: 3, width: 38};
  const [searchValue, setSearchValue] = useState<string>('');
  const [findCity, setFindCity] = useState([]);
  const onOpen = () => {
    modalizeRef?.current?.open();
  };

  useEffect(() => {
    if (opening) {
      onOpen();
    }
  }, [opening]);
  const onChangeTextSearch = (value: string) => {
    setSearchValue(value);
    searchCity(searchValue).then((places: any) => setFindCity(places));
    if (value?.length > 0) {
      setFindCity([]);
    }
  };
  const onPressLocate = (item: any) => {
    onChoosedCity(item);
    const value = item?.structured_formatting?.main_text;
    setSearchValue(value);
    modalizeRef?.current?.close();
    onClose();
  };
  const onCancel = () => {
    onClose();
    modalizeRef?.current?.close();
  };
  const headerLocation = () => {
    return (
      <>
        <RN.View style={styles.headerLocation}>
          <RN.View style={{alignSelf: 'center'}}>
            <RN.Text style={styles.selectorTitle}>Location</RN.Text>
          </RN.View>
          <RN.TouchableOpacity
            onPress={onCancel}
            style={{alignSelf: 'flex-end', marginTop: -24}}>
            <RN.Image source={{uri: 'close'}} style={{height: 24, width: 24}} />
          </RN.TouchableOpacity>
        </RN.View>
      </>
    );
  };

  return (
    <Portal>
      <Modalize
        handlePosition="inside"
        onClosed={onClose}
        handleStyle={handleStyle}
        ref={modalizeRef}
        rootStyle={styles.container}
        HeaderComponent={headerLocation()}>
        <RN.View style={{paddingHorizontal: 20}}>
          <Search
            autoFocus
            onSearch={onChangeTextSearch}
            searchValue={searchValue}
            placeholder="Search location"
            visibleAddBtn={false}
          />
          {findCity?.map((item: any) => {
            return (
              <RN.TouchableOpacity
                style={{paddingVertical: 8}}
                onPress={() => onPressLocate(item)}>
                <RN.Text style={styles.itemText}>
                  {item?.structured_formatting?.main_text +
                    ', ' +
                    item?.terms[1]?.value}
                </RN.Text>
              </RN.TouchableOpacity>
            );
          })}
        </RN.View>
      </Modalize>
    </Portal>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  headerLocation: {
    padding: 24,
    paddingTop: 34,
  },
  selectorTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  itemText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22.4,
  },
});
export default CitySelector;
