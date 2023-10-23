import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import colors from '../../../utils/colors';
import {Input} from '../../../components/input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SCREEN_WIDTH, isAndroid} from '../../../utils/constants';
import Moment from 'moment';
import {Button} from '../../../components/Button';
import useTickets from '../../../hooks/useTickets';
import {Modalize} from 'react-native-modalize';
import {Calendar} from 'react-native-calendars';
import {extendMoment} from 'moment-range';

const moment = extendMoment(Moment);

type DateData = {
  year: number;
  month: number;
  day: number;
  timestamp: number;
  dateString: string;
};
const setupStart = {
  selected: true,
  startingDay: true,
  selectedColor: colors.orange,
  textColor: colors.white,
};

const setupEnd = {
  selected: true,
  endingDay: true,
  selectedColor: colors.orange,
  textColor: colors.white,
};
const EditTicket = () => {
  const navigation = useNavigation();
  const routeProps = useRoute();
  const {changeTicket} = useTickets();
  const calendarModalizeRef = useRef<Modalize>(null);

  const ticketProps = routeProps?.params;
  const onPressBack = () => navigation.goBack();
  const [enableTicket, setEnableTicket] = useState(ticketProps?.enabled);
  const [nameTicket, setNameTicket] = useState(ticketProps?.name);
  const [descriptionTicket, setDescriptionTicket] = useState(
    ticketProps?.description,
  );
  const [priceTicket, setPriceTicket] = useState(
    ticketProps?.initialPrice?.toString(),
  );
  const [quantityTicket, setQuantityTicket] = useState(
    ticketProps?.quantity?.toString(),
  );
  const [countNameSymbols, setCountNameSymbols] = useState({
    current: nameTicket?.length,
    maxSymbols: 100,
  });
  const [countDescSymbols, setCountDescSymbols] = useState({
    current: descriptionTicket?.length,
    maxSymbols: 350,
  });

  const [startSaleDate, setStartSaleDate] = useState(
    moment(ticketProps?.startDate).format('DD-MM-YYYY'),
  );
  const [endSaleDate, setEndSaleDate] = useState(
    moment(ticketProps?.endDate).format('DD-MM-YYYY'),
  );
  const [openStartSaleDate, setOpenStartSaleDate] = useState(false);
  const [openEndSaleDate, setOpenEndSaleDate] = useState(false);

  const [quantityError, setQuantityError] = useState(false);
  useEffect(() => {
    setEndSaleDate(moment(Date.now()).add(10, 'days').toISOString());
    setStartSaleDate(moment(Date.now()).toISOString());
  }, []);

  const onOpenCalendar = () => {
    calendarModalizeRef.current?.open();
  };

  console.log('ticketProps', ticketProps);
  const onSelectDay = (day: DateData) => {
    if (openStartSaleDate) {
      setStartSaleDate(day?.dateString);
      setOpenStartSaleDate(false);
      calendarModalizeRef.current?.close();
    }
    if (openEndSaleDate) {
      setEndSaleDate(day?.dateString);
      setOpenEndSaleDate(false);
      calendarModalizeRef.current?.close();
    }
  };

  const onPressCreate = () => {
    const ticket = {
      name: nameTicket,
      description: descriptionTicket,
      startDate: startSaleDate,
      endDate: endSaleDate,
      price: Number(priceTicket),
      quantity: Number(quantityTicket),
      enabled: enableTicket,
      eventUid: ticketProps?.eventUid,
      timezone: ticketProps?.timezone,
      id: ticketProps?.id,
    };
    if (quantityTicket?.length <= 0) {
      setQuantityError(true);
    } else {
      changeTicket(ticket);
      navigation.goBack();
    }
  };
  const onChangeValueName = (value: string) => {
    setNameTicket(value);
    setCountNameSymbols({
      current: value.length,
      maxSymbols: 100,
    });
  };
  const onChangeValueDescription = (value: string) => {
    setDescriptionTicket(value);
    setCountDescSymbols({
      current: value.length,
      maxSymbols: 350,
    });
  };
  const renderHeader = () => {
    return (
      <RN.TouchableOpacity style={styles.headerContainer} onPress={onPressBack}>
        <RN.Image source={{uri: 'backicon'}} style={styles.backIcon} />
        <RN.Text style={styles.headerTitle}>Create Ticket</RN.Text>
      </RN.TouchableOpacity>
    );
  };
  const toggleEnableTicket = () => {
    return (
      <RN.View style={styles.toggleContainer}>
        <RN.Switch
          trackColor={{false: colors.gray, true: colors.orange}}
          thumbColor={enableTicket ? colors.white : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setEnableTicket}
          value={enableTicket}
        />
        <RN.View style={{justifyContent: 'center'}}>
          <RN.Text style={styles.toggleText}>Enable Ticket</RN.Text>
        </RN.View>
      </RN.View>
    );
  };
  const renderNameTicket = () => {
    return (
      <RN.View style={{marginTop: 30}}>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Create Ticket Name</RN.Text>
          <RN.Text style={styles.countMaxSymbols}>
            <RN.Text
              style={[
                styles.countCurrentSymbols,
                {
                  color:
                    countNameSymbols.current > 0
                      ? colors.textPrimary
                      : colors.darkGray,
                },
              ]}>
              {countNameSymbols.current}
            </RN.Text>
            {'/' + countNameSymbols.maxSymbols}
          </RN.Text>
        </RN.View>
        <RN.View style={{marginHorizontal: 4}}>
          <Input
            value={nameTicket}
            onChange={onChangeValueName}
            placeholder="Name"
            maxLength={countNameSymbols.maxSymbols}
          />
        </RN.View>
      </RN.View>
    );
  };
  const renderPriceTicket = () => {
    return (
      <RN.View style={{marginHorizontal: 4}}>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>
            Set Event Price{' '}
            <RN.Text style={styles.countMaxSymbols}>
              {' '}
              (10% fee will be added)
            </RN.Text>
          </RN.Text>
        </RN.View>
        <RN.View>
          <Input
            value={priceTicket}
            maxLength={10}
            onChange={setPriceTicket}
            placeholder="0"
            keyboardType={'numeric'}
            // onFocusInput={() => setPriceTicket(0)}
          />
          <RN.Text style={styles.usd}>USD</RN.Text>
        </RN.View>
      </RN.View>
    );
  };
  const renderQuantityTicket = () => {
    return (
      <RN.View style={{marginHorizontal: 4}}>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>Quantity Available</RN.Text>
        </RN.View>
        <Input
          value={quantityTicket}
          maxLength={10}
          onChange={(value: string) => {
            setQuantityTicket(value);
            setQuantityError(false);
          }}
          placeholder="0"
          keyboardType={'numeric'}
          isErrorBorder={quantityError}
        />
      </RN.View>
    );
  };
  const renderDescriptionTicket = () => {
    return (
      <RN.View style={{marginHorizontal: 4}}>
        <RN.View style={styles.nameTitle}>
          <RN.Text style={styles.title}>
            Add Description
            <RN.Text style={styles.countMaxSymbols}> (Optional)</RN.Text>
          </RN.Text>
          <RN.Text style={styles.countMaxSymbols}>
            <RN.Text
              style={[
                styles.countCurrentSymbols,
                {
                  color:
                    countDescSymbols.current > 0
                      ? colors.textPrimary
                      : colors.darkGray,
                },
              ]}>
              {countDescSymbols.current}
            </RN.Text>
            {'/' + countDescSymbols.maxSymbols}
          </RN.Text>
        </RN.View>
        <Input
          value={descriptionTicket}
          onChange={onChangeValueDescription}
          placeholder="Description"
          maxLength={countDescSymbols.maxSymbols}
          multiLine
        />
      </RN.View>
    );
  };
  const renderFooter = () => {
    return (
      <RN.View style={styles.footerWrapper}>
        <Button title="Save Changes" disabled onPress={onPressCreate} />
      </RN.View>
    );
  };
  const renderSaleDates = () => {
    return (
      <RN.View style={styles.saleDatesContainer}>
        <RN.View>
          <RN.Text style={styles.saleDatesTitle}>Set Start Sale Date</RN.Text>
          <RN.TouchableOpacity
            style={styles.saleDatesBtn}
            onPress={() => {
              onOpenCalendar();
              setOpenStartSaleDate(true);
            }}>
            <RN.Text style={styles.saleDatesText}>
              {`${
                startSaleDate === null
                  ? moment(Date.now()).format('DD-MM-YYYY')
                  : moment(startSaleDate).format('DD-MM-YYYY')
              }`}
            </RN.Text>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'calendaroutline'}}
                style={styles.calendarIcon}
              />
            </RN.View>
          </RN.TouchableOpacity>
        </RN.View>
        <RN.View>
          <RN.Text style={styles.saleDatesTitle}>Set End Sale Date</RN.Text>
          <RN.TouchableOpacity
            style={styles.saleDatesBtn}
            onPress={() => {
              onOpenCalendar();
              setOpenEndSaleDate(true);
            }}>
            <RN.Text style={styles.saleDatesText}>{`${
              endSaleDate === null
                ? moment(Date.now()).add(10, 'days').format('DD-MM-YYYY')
                : moment(endSaleDate).format('DD-MM-YYYY')
            }`}</RN.Text>
            <RN.View style={{justifyContent: 'center'}}>
              <RN.Image
                source={{uri: 'calendaroutline'}}
                style={styles.calendarIcon}
              />
            </RN.View>
          </RN.TouchableOpacity>
        </RN.View>
      </RN.View>
    );
  };
  return (
    <>
      <RN.SafeAreaView style={styles.container}>
        {renderHeader()}
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          style={{backgroundColor: colors.white}}
          extraScrollHeight={isAndroid ? 0 : 90}
          showsVerticalScrollIndicator={false}>
          {toggleEnableTicket()}
          {renderNameTicket()}
          {renderPriceTicket()}
          {renderSaleDates()}
          {renderQuantityTicket()}
          {renderDescriptionTicket()}
        </KeyboardAwareScrollView>
      </RN.SafeAreaView>
      {renderFooter()}
      <Modalize
        ref={calendarModalizeRef}
        // onClose={onCloseCalendar}
        // closeOnOverlayTap={false}
        handlePosition="inside"
        scrollViewProps={{scrollEnabled: false}}
        // modalStyle={styles.container}
        disableScrollIfPossible={false}
        adjustToContentHeight>
        <RN.View style={{marginVertical: 26}}>
          <Calendar
            renderArrow={direction => {
              if (direction === 'right') {
                return (
                  <RN.Image
                    source={{uri: 'arrowright'}}
                    style={{
                      height: 20,
                      width: 17,
                      tintColor: colors.textPrimary,
                    }}
                  />
                );
              } else {
                return (
                  <RN.Image
                    source={{uri: 'arrowright'}}
                    style={{
                      height: 20,
                      width: 17,
                      tintColor: colors.textPrimary,
                      transform: [{rotate: '180deg'}],
                    }}
                  />
                );
              }
            }}
            // current={currentDate.dateString}
            hideExtraDays
            minDate={new Date().toDateString()}
            // markingType={'period'}
            markedDates={{
              [startSaleDate]: setupStart,
              [endSaleDate]: setupEnd,
            }}
            theme={{
              selectedDayBackgroundColor: colors.purple,
              selectedDayTextColor: colors.white,
              todayTextColor: colors.orange,
              dayTextColor: colors.textPrimary,
              monthTextColor: colors.textPrimary,
              textMonthFontWeight: '700',
            }}
            onDayPress={onSelectDay}
            // markedDates={setDateRange()}
          />
        </RN.View>
      </Modalize>
    </>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    marginVertical: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingLeft: 18,
    lineHeight: 22.4,
  },
  backIcon: {
    height: 20,
    width: 24,
  },
  calendarIcon: {
    height: 20,
    width: 20,
    tintColor: colors.darkGray,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
  },
  toggleText: {
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '700',
    paddingLeft: 16,
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
  },
  countMaxSymbols: {
    fontSize: 14,
    lineHeight: 19.6,
    fontWeight: '400',
    color: colors.darkGray,
  },
  countCurrentSymbols: {
    fontSize: 14,
    lineHeight: 19.6,
    fontWeight: '400',
  },
  usd: {
    right: 26,
    top: 18,
    fontSize: 16,
    lineHeight: 22.4,
    color: colors.textPrimary,
    position: 'absolute',
  },
  definition: {
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '400',
    color: colors.darkGray,
    paddingHorizontal: 20,
  },
  saleDatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  saleDatesTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  saleDatesBtn: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 18,
    flexDirection: 'row',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    minWidth: SCREEN_WIDTH / 2.34,
    maxWidth: SCREEN_WIDTH / 2.34,
    justifyContent: 'space-between',
  },
  saleDatesText: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    fontWeight: '400',
  },
  footerWrapper: {
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingBottom: 24,
  },
});
export default EditTicket;
