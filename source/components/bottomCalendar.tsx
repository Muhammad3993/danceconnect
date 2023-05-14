import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import {Modalize} from 'react-native-modalize';
import colors from '../utils/colors';
import {Calendar} from 'react-native-calendars';
// import moment from 'moment';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import {TimePicker} from 'react-native-wheel-picker-android';
import {Button} from './Button';
import {isAndroid} from '../utils/constants';
import DateTimePicker from '@react-native-community/datetimepicker';

const moment = extendMoment(Moment);

type props = {
  onClose: () => void;
  start?: any;
  end?: any;
  time?: any;
  setTime?: any;
  setStart?: any;
  setEnd?: any;
};
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
  color: colors.orange,
  textColor: colors.white,
};
const setupBetween = {
  color: colors.orange,
  textColor: colors.white,
};
const setupEnd = {
  selected: true,
  endingDay: true,
  color: colors.orange,
  textColor: colors.white,
};
const BottomCalendar = ({
  onClose,
  start = moment().format('YYYY-MM-DD'),
  end = moment().format('YYYY-MM-DD'),
  setEnd,
  setStart,
  time,
  setTime,
}: props) => {
  const modalizeRef = useRef<Modalize>(null);
  const [openingTime, setOpeningTime] = useState(false);
  const [value, setValue] = useState<RNTimePicker.ValueMap>({
    hours: 0,
    minutes: 0,
  });
  const minDate = new Date().toDateString();
  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClosed = () => {
    onClose();
  };
  useEffect(() => {
    onOpen();
  }, []);

  const onPressSetTime = () => {
    // onTimePicker(time);
    setOpeningTime(v => !v);
  };
  const onTimePicker = (times: any) => {
    console.log(times);
    // const timeSelect = isAndroid ? new Date(times).getTime() : times?.timestamp;
    // setValue(times);
    setTime(times);
  };

  const renderTimePickerIOS = () => {
    return (
      <>
        <DateTimePicker onChange={onTimePicker} />
        <RN.View style={{marginBottom: 18}}>
          <Button
            disabled
            title="Set the time"
            onPress={() => onPressSetTime()}
          />
        </RN.View>
      </>
    );
  };

  const renderTimePicker = () => {
    return (
      <>
        <TimePicker
          onTimeSelected={timeSelect => onTimePicker(timeSelect)}
          initDate={time}
          format24
          minutes={['00', '15', '30', '45']}
        />
        <RN.View style={{marginBottom: 12}}>
          <Button
            disabled
            title="Set the time"
            onPress={() => onPressSetTime()}
          />
        </RN.View>
      </>
    );
  };
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  useEffect(() => {
    setStart({start: startDate !== null ? moment(startDate).toDate() : null});
    setEnd({end: endDate !== null ? moment(endDate).toDate() : null});
  }, [setEnd, setStart, endDate, startDate]);

  const setDateRange = () => {
    if (!endDate) {
      return {
        [startDate]: {
          color: colors.orange,
          textColor: colors.white,
        },
      };
    }
    const range = moment().range(startDate, endDate);
    const days = Array.from(range.by('days'));
    const dayEntries = days.map((d, index) => {
      const date = d.format('YYYY-MM-DD');
      if (index === 0) {
        return [[date], setupStart];
      }
      if (index + 1 < days.length) {
        return [[date], setupBetween];
      }
      return [[date], setupEnd];
    });
    return Object.fromEntries(dayEntries);
  };

  const onSelectDay = (day: DateData) => {
    if (day?.dateString === startDate || day?.dateString === endDate) {
      setStartDate(day?.dateString);
      setStart(day?.dateString);
      setEndDate(null);
      return;
    }
    if (moment(day?.dateString).isAfter(startDate)) {
      setEndDate(day?.dateString);
      setEnd(day?.dateString);
    } else {
      if (!endDate) {
        setEndDate(startDate);
        setEnd(startDate);
        setStartDate(day?.dateString);
        setStart(day?.dateString);
        return;
      }
      setStartDate(day?.dateString);
      setStart(day?.dateString);
    }

    // console.log(day);
  };

  const onPressFinished = () => {
    setStart(startDate);
    setEnd(endDate);
    onClosed();
  };
  const renderHeader = () => {
    return (
      <RN.View
        style={{
          padding: 25,
          paddingBottom: 14,
          paddingTop: 35,
        }}>
        <RN.View style={{alignSelf: 'center'}}>
          <RN.Text style={styles.filtersText}>Select Date and Time</RN.Text>
        </RN.View>
        <RN.TouchableOpacity
          style={{alignSelf: 'flex-end', marginTop: -25}}
          onPress={() => modalizeRef?.current?.close('default')}>
          <RN.Image source={{uri: 'close'}} style={{height: 24, width: 24}} />
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  return (
    <>
      <Modalize
        ref={modalizeRef}
        onClose={onClosed}
        handlePosition="inside"
        scrollViewProps={{scrollEnabled: !openingTime && true}}
        modalStyle={styles.container}
        disableScrollIfPossible={false}
        adjustToContentHeight>
        <RN.View>
          {renderHeader()}
          <RN.View style={styles.nameTitle}>
            <RN.View>
              <RN.Text style={styles.title}>
                Selected date:
                <RN.Text style={{color: colors.darkGray}}>
                  {` ${moment(startDate).format('MMMM Do')}${
                    endDate !== null
                      ? ' - ' + moment(endDate).format('MMMM Do')
                      : ''
                  }`}
                </RN.Text>
              </RN.Text>
            </RN.View>
            <RN.TouchableOpacity
              style={{justifyContent: 'center'}}
              onPress={() => setOpeningTime(v => !v)}>
              <RN.Text style={[styles.title, {color: colors.darkGray}]}>
                {moment(time).format('HH:mm')}
              </RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
          {openingTime ? (
            isAndroid ? (
              renderTimePicker()
            ) : (
              renderTimePickerIOS()
            )
          ) : (
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
              // markedDates={markedDate}
              markingType={'period'}
              theme={{
                selectedDayBackgroundColor: colors.purple,
                selectedDayTextColor: colors.white,
                todayTextColor: colors.orange,
                dayTextColor: colors.textPrimary,
                monthTextColor: colors.textPrimary,
                textMonthFontWeight: '700',
              }}
              minDate={minDate}
              onDayPress={onSelectDay}
              markedDates={setDateRange()}
            />
          )}
          {!openingTime && (
            <RN.View style={{marginVertical: 12, marginBottom: 18}}>
              <Button disabled title="Set the date" onPress={onPressFinished} />
            </RN.View>
          )}
        </RN.View>
      </Modalize>
    </>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 16,
    lineHeight: 22.4,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  nameTitle: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    // alignItems: 'center',
    // paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filtersText: {
    color: colors.textPrimary,
    fontWeight: '500',
    lineHeight: 28.8,
    fontSize: 24,
  },
});

export default BottomCalendar;
