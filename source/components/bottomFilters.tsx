import React, {useEffect, useRef} from 'react';
import * as RN from 'react-native';
import {Modalize} from 'react-native-modalize';
import CategorySelector from './catregorySelector';
import {dataDanceCategory} from '../utils/constants';
import colors from '../utils/colors';
import {Button} from './Button';

type props = {
  onClose: () => void;
  selectedStyles: string[];
  setSelectedStyles: () => void;
  onClear: () => void;
  onFilter: () => void;
};
const FiltersBottom = ({
  onClose,
  selectedStyles,
  setSelectedStyles,
  onClear,
  onFilter,
}: props) => {
  const modalizeRef = useRef<Modalize>(null);

  const onChoosheDanceStyle = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const isAvailable = selectedStyles?.includes(value);
    if (isAvailable) {
      onPressDeleteItem(value);
    } else {
      setSelectedStyles([...selectedStyles, value]);
    }
  };
  const onPressDeleteItem = (value: string) => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    const filter = selectedStyles.filter(item => item !== value);
    setSelectedStyles(filter);
  };

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const onClosed = () => {
    // modalizeRef?.current?.close();
    onClose();
  };
  useEffect(() => {
    onOpen();
  }, []);

  const onPressFilter = () => {
    onFilter();
    onClose();
  }
  const renderHeader = () => {
    return (
      <RN.View
        style={{
          padding: 25,
          paddingTop: 35,
        }}>
        <RN.View style={{alignSelf: 'center'}}>
          <RN.Text style={styles.filtersText}>Filters</RN.Text>
        </RN.View>
        <RN.TouchableOpacity
          style={{alignSelf: 'flex-end', marginTop: -25}}
          onPress={() => modalizeRef?.current?.close('default')}>
          <RN.Image source={{uri: 'close'}} style={{height: 24, width: 24}} />
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const renderFooter = () => {
    return (
      <RN.View style={styles.footerWrapper}>
        <Button
          title="Clear All"
          disabled
          buttonStyle={styles.clearBtn}
          onPress={onClear}
        />
        <Button
          title="Show Results"
          disabled
          buttonStyle={styles.createBtn}
          onPress={onPressFilter}
          // isLoading={isLoading}
        />
      </RN.View>
    );
  };
  const line = () => {
    return (
      <RN.View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.gray,
          marginHorizontal: 20,
        }}
      />
    );
  };
  return (
    <>
      <Modalize
        ref={modalizeRef}
        onClose={onClosed}
        handlePosition="inside"
        scrollViewProps={{scrollEnabled: true}}
        modalStyle={styles.container}
        disableScrollIfPossible={false}
        adjustToContentHeight>
        <RN.View>
          {renderHeader()}
          {line()}
          <RN.View style={styles.nameTitle}>
            <RN.Text style={styles.title}>Choose Dance Style</RN.Text>
          </RN.View>
          {selectedStyles?.length > 0 && (
            <RN.View style={styles.danceStyleContainer}>
              {selectedStyles?.map(item => {
                return (
                  <RN.TouchableOpacity
                    style={styles.addedDanceStyleItem}
                    activeOpacity={0.7}
                    onPress={() => onPressDeleteItem(item)}>
                    <RN.Text style={styles.addedDanceStyleText}>{item}</RN.Text>
                    <RN.View style={{justifyContent: 'center', marginTop: 2}}>
                      <RN.Image
                        style={{
                          height: 14,
                          width: 14,
                          tintColor: colors.orange,
                        }}
                        source={{uri: 'close'}}
                      />
                    </RN.View>
                  </RN.TouchableOpacity>
                );
              })}
            </RN.View>
          )}
          <CategorySelector
            data={dataDanceCategory}
            onChoosheDanceStyle={onChoosheDanceStyle}
            addedStyles={selectedStyles}
          />
          {line()}
          {renderFooter()}
        </RN.View>
      </Modalize>
    </>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  addedDanceStyleItem: {
    borderWidth: 1,
    borderColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    marginRight: 4,
    marginBottom: 8,
  },
  addedDanceStyleText: {
    color: colors.orange,
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 19.6,
    marginRight: 6,
    fontWeight: '600',
  },
  danceStyleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: {
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  nameTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 24,
  },
  clearBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.purple,
    color: colors.purple,
    paddingHorizontal: 44,
    marginVertical: 14,
    // width: '40%',
  },
  createBtn: {
    marginVertical: 14,
    paddingHorizontal: 44,
  },
  footerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // paddingHorizontal: 14,
    backgroundColor: colors.white,
    marginHorizontal: 14,
  },
  filtersText: {
    color: colors.textPrimary,
    fontWeight: '500',
    lineHeight: 28.8,
    fontSize: 24,
  },
});

export default FiltersBottom;
