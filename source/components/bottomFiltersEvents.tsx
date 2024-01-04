import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import {Modalize} from 'react-native-modalize';
import CategorySelector from './catregorySelector';
import {dataDanceCategory} from '../utils/constants';
import colors from '../utils/colors';
import {Button} from './Button';
import moment from 'moment';
import BottomCalendarForEvents from './bottomCalendarForEvents';
import {Portal} from 'react-native-portalize';
import useAppStateHook from '../hooks/useAppState';
import {useTranslation} from 'react-i18next';

type props = {
  onClose: () => void;
  selectedStyles: string[];
  setSelectedStyles: () => void;
  onClear: () => void;
  onFilter: () => void;
  currentTab?: string;
  showPassed?: boolean;
  setShowPassed?: () => void;
  eventType: string;
  setEventType?: () => {};
  eventDate?: object;
  setEventDate?: () => {};
  onOpening?: boolean;
  currentCity: string;
};
const FiltersBottomForEvents = ({
  onClose,
  selectedStyles,
  setSelectedStyles,
  onClear,
  onFilter,
  currentTab,
  showPassed,
  setShowPassed = () => {},
  eventDate = {start: null, end: null},
  eventType,
  setEventType = () => {},
  setEventDate = () => {},
  onOpening,
  currentCity,
}: props) => {
  const modalizeRef = useRef<Modalize>(null);
  const danceStyleModalizeRef = useRef<Modalize>(null);
  const dateModalizeRef = useRef<Modalize>(null);
  const {eventTypes} = useAppStateHook();
  const {t} = useTranslation();

  const typesEventData = ['All', ...eventTypes];
  const [choosedType, setChoosedType] = useState(eventType ?? 'All');
  const [startDate, setStartDate] = useState(eventDate?.start ?? null);
  const [endDate, setEndDate] = useState(eventDate?.end ?? null);
  const handleStyle = {height: 3, width: 38};

  useEffect(() => {
    setChoosedType('All');
  }, []);
  useEffect(() => {
    setEventDate();
    setStartDate(null);
    setEndDate(null);
  }, [currentCity]);

  useEffect(() => {
    setChoosedType(eventType);
  }, [eventType]);

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

  const onClosed = () => {
    // modalizeRef?.current?.close();
    onClose();
  };
  useEffect(() => {
    if (onOpening) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [onOpening]);

  const onPressClear = () => {
    setChoosedType('All');
    setEndDate(null);
    setStartDate(null);
    setSelectedStyles([]);
    setEventDate();
    onClear();
  };

  const onPressFilter = () => {
    modalizeRef.current?.close();
    if (
      selectedStyles.length > 0 ||
      choosedType !== 'All' ||
      startDate !== null ||
      endDate !== null
    ) {
      onFilter();
    } else {
      onPressClear();
      return null;
    }
  };
  const renderHeader = () => {
    const pressClose = () => modalizeRef?.current?.close();
    return (
      <RN.View
        style={{
          padding: 25,
          paddingTop: 35,
        }}>
        <RN.View style={{alignSelf: 'center'}}>
          <RN.Text style={styles.filtersText}>{t('filters')}</RN.Text>
        </RN.View>
        <RN.TouchableOpacity
          style={{alignSelf: 'flex-end', marginTop: -25}}
          onPress={() => modalizeRef?.current?.close()}>
          <RN.Image source={{uri: 'close'}} style={{height: 24, width: 24}} />
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const renderFooter = () => {
    return (
      <RN.View style={styles.footerWrapper}>
        <Button
          title={t('clear')}
          disabled
          buttonStyle={styles.clearBtn}
          onPress={onPressClear}
        />
        <Button
          title={t('results')}
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
  const renderSelectedDanceStyle = () => {
    return (
      <>
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
      </>
    );
  };
  const renderSelectStyle = () => {
    const onPressBack = () => danceStyleModalizeRef?.current?.close();
    const onCancel = () => {
      setSelectedStyles([]);
      onPressBack();
    };
    const headerStyle = () => {
      return (
        <>
          <RN.View style={styles.headerDanceStyle}>
            <RN.TouchableOpacity onPress={onPressBack}>
              <RN.Image
                source={{uri: 'backicon'}}
                style={{height: 20, width: 24}}
              />
            </RN.TouchableOpacity>
            <RN.Text style={styles.selectorTitle}>{t('dance_styles')}</RN.Text>
            <RN.TouchableOpacity onPress={onCancel}>
              <RN.Image
                source={{uri: 'close'}}
                style={{height: 24, width: 24}}
              />
            </RN.TouchableOpacity>
          </RN.View>
          {line()}
          <RN.View style={{paddingHorizontal: 20}}>
            {renderSelectedDanceStyle()}
          </RN.View>
        </>
      );
    };
    const bottom = () => {
      return (
        <RN.View style={{paddingBottom: 14}}>
          <Button
            title={t('apply')}
            onPress={onPressBack}
            disabled={selectedStyles?.length}
          />
        </RN.View>
      );
    };
    return (
      <Modalize
        handleStyle={handleStyle}
        adjustToContentHeight
        handlePosition="inside"
        ref={danceStyleModalizeRef}
        FooterComponent={bottom()}
        HeaderComponent={headerStyle()}>
        <CategorySelector
          data={dataDanceCategory}
          onChoosheDanceStyle={onChoosheDanceStyle}
          addedStyles={selectedStyles}
        />
      </Modalize>
    );
  };
  const renderTypes = () => {
    return (
      <RN.View style={styles.typesContainer}>
        {typesEventData?.map(item => {
          return (
            <RN.TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setChoosedType(item);
                setEventType(item);
              }}
              style={[
                styles.typesItem,
                {
                  borderColor:
                    item === choosedType ? colors.orange : colors.darkGray,
                },
              ]}>
              <RN.Text
                style={[
                  styles.typesItemText,
                  {
                    color:
                      item === choosedType ? colors.orange : colors.darkGray,
                  },
                ]}>
                {item}
              </RN.Text>
            </RN.TouchableOpacity>
          );
        })}
        {/* <RN.View style={{marginRight: 40}} /> */}
      </RN.View>
    );
  };

  useEffect(() => {
    if (startDate?.start !== null) {
      setEventDate({start: startDate, end: endDate});
    } else {
      setEventDate();
      setStartDate(null);
      setEndDate(null);
    }
    // console.log('useEffect', startDate, endDate, endDate?.end);
  }, [startDate, endDate]);

  const renderCalendar = () => {
    const onPressBack = () => {
      setStartDate(null);
      setEndDate(null);
      setEventDate();
      dateModalizeRef?.current?.close();
    };
    const onCancel = () => {
      // setSelectedStyles([]);
      setStartDate(null);
      setEndDate(null);
      onPressBack();
    };
    const headerDate = () => {
      return (
        <RN.View
          style={{
            padding: 25,
          }}>
          <RN.View style={{alignSelf: 'center', marginBottom: -24}}>
            <RN.Text style={styles.filtersText}>{t('date')}</RN.Text>
          </RN.View>
          <RN.TouchableOpacity
            style={{alignSelf: 'flex-end', marginBottom: 24}}
            onPress={onCancel}>
            <RN.Image source={{uri: 'close'}} style={{height: 24, width: 24}} />
          </RN.TouchableOpacity>
          {line()}
        </RN.View>
      );
    };
    return (
      <Modalize
        handlePosition="inside"
        handleStyle={handleStyle}
        ref={dateModalizeRef}
        closeOnOverlayTap={false}
        adjustToContentHeight
        HeaderComponent={headerDate()}>
        <BottomCalendarForEvents
          onClose={() => dateModalizeRef?.current?.close()}
          end={endDate}
          start={startDate}
          setStart={setStartDate}
          setEnd={setEndDate}
        />
      </Modalize>
    );
  };

  const onPressClearDate = () => {
    RN.LayoutAnimation.configureNext(RN.LayoutAnimation.Presets.easeInEaseOut);
    setStartDate(null);
    setEndDate(null);
    setEventDate();
  };

  return (
    <>
      <Portal>
        <Modalize
          ref={modalizeRef}
          avoidKeyboardLikeIOS={false}
          onClose={onClosed}
          handleStyle={handleStyle}
          handlePosition="inside"
          scrollViewProps={{scrollEnabled: true}}
          modalStyle={styles.container}
          // disableScrollIfPossible={false}
          adjustToContentHeight>
          <RN.View>
            {renderHeader()}
            {line()}
            {/* {currentTab === 'Managing' && (
              <>
                <RN.View style={styles.showPassedEventsContainer}>
                  <RN.Text style={styles.showPassedText}>
                    Show passed event's
                  </RN.Text>
                  <RN.TouchableOpacity
                    style={[
                      styles.tickContainer,
                      {
                        borderColor: showPassed
                          ? colors.orange
                          : colors.darkGray,
                      },
                    ]}
                    onPress={() => setShowPassed(v => !v)}>
                    <RN.Image
                      source={{uri: 'tick'}}
                      style={{
                        height: 18,
                        width: 18,
                        tintColor: showPassed ? colors.orange : colors.darkGray,
                      }}
                    />
                  </RN.TouchableOpacity>
                </RN.View>
                {line()}
              </>
            )} */}
            <RN.View style={styles.selectorContainer}>
              <RN.View>
                <RN.Text style={[styles.selectorTitle, {marginBottom: -8}]}>
                  {t('ev_type')}
                </RN.Text>
              </RN.View>
            </RN.View>
            {renderTypes()}
            {line()}
            <RN.TouchableOpacity
              style={styles.selectorContainer}
              onPress={() => dateModalizeRef?.current?.open()}>
              <RN.View>
                <RN.Text style={styles.selectorTitle}>{t('date')}</RN.Text>
                {startDate !== null && startDate?.start !== null && (
                  <RN.TouchableOpacity
                    style={styles.selectedDateWrapper}
                    onPress={onPressClearDate}>
                    <RN.Text
                      style={[styles.userLocationText, {color: colors.orange}]}>
                      {`${
                        startDate !== null &&
                        moment(startDate).format('DD.MM.YYYY')
                      }${
                        endDate !== null
                          ? '-' + moment(endDate).format('DD.MM.YYYY')
                          : endDate?.end !== undefined
                          ? '-' + moment(endDate).format('DD.MM.YYYY')
                          : ''
                      }`}
                    </RN.Text>
                    <RN.View style={{justifyContent: 'center'}}>
                      <RN.Image
                        source={{uri: 'close'}}
                        style={{
                          height: 16,
                          width: 16,
                          tintColor: colors.orange,
                          marginLeft: 4,
                        }}
                      />
                    </RN.View>
                  </RN.TouchableOpacity>
                )}
              </RN.View>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'arrowright'}}
                  style={{height: 16, width: 16, tintColor: colors.black}}
                />
              </RN.View>
            </RN.TouchableOpacity>
            {line()}
            <RN.TouchableOpacity
              style={styles.selectorContainer}
              onPress={() => danceStyleModalizeRef?.current?.open()}>
              <RN.View>
                <RN.Text style={styles.selectorTitle}>
                  {t('dance_styles')}
                </RN.Text>
                <RN.View style={{marginTop: selectedStyles?.length && -16}}>
                  {renderSelectedDanceStyle()}
                </RN.View>
              </RN.View>
              <RN.View style={{justifyContent: 'center'}}>
                <RN.Image
                  source={{uri: 'arrowright'}}
                  style={{height: 16, width: 16, tintColor: colors.black}}
                />
              </RN.View>
            </RN.TouchableOpacity>
            {line()}
            {renderFooter()}
          </RN.View>
        </Modalize>
        {renderSelectStyle()}
        {renderCalendar()}
      </Portal>
    </>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  selectorTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  userLocationWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
  },
  selectedDateWrapper: {
    flexDirection: 'row',
    // justifyContent: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.orange,
    paddingVertical: 4,
    paddingRight: 8,
    borderRadius: 12,
  },
  userLocationText: {
    paddingLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  typesItemText: {
    fontSize: 14,
    lineHeight: 14.9,
    letterSpacing: 0.2,
    fontWeight: '600',
  },
  typesItem: {
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 6,
    marginTop: 8,
  },
  typesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexWrap: 'wrap',
  },
  headerDanceStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 34,
  },
  selectorContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  showPassedEventsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  showPassedText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  tickContainer: {
    padding: 2,
    borderWidth: 1,
    borderRadius: 4,
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
    // paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: -8,
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
    paddingBottom: 24,
  },
  filtersText: {
    color: colors.textPrimary,
    fontWeight: '500',
    lineHeight: 28.8,
    fontSize: 24,
  },
});

export default FiltersBottomForEvents;
{
  /* {currentTab === 'Managing' && (
            <>
              <RN.View style={styles.showPassedEventsContainer}>
                <RN.Text style={styles.showPassedText}>
                  Show passed event's
                </RN.Text>
                <RN.TouchableOpacity
                  style={[
                    styles.tickContainer,
                    {borderColor: showPassed ? colors.orange : colors.darkGray},
                  ]}
                  onPress={() => setShowPassed(v => !v)}>
                  <RN.Image
                    source={{uri: 'tick'}}
                    style={{
                      height: 18,
                      width: 18,
                      tintColor: showPassed ? colors.orange : colors.darkGray,
                    }}
                  />
                </RN.TouchableOpacity>
              </RN.View>
              {line()}
            </>
          )}
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
          {line()} */
}
