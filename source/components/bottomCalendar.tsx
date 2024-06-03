import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {useTranslation} from 'react-i18next';

const moment = extendMoment(Moment);
let minWeekDay = moment.updateLocale('en', {
  weekdaysMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
});

type props = {
  onClose: () => void;
  start?: any;
  end?: any;
  time?: any;
  setTime?: any;
  setStart?: any;
  setEnd?: any;
  isRecurring?: boolean;
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
  time = new Date().getTime(),
  setTime,
  isRecurring,
}: props) => {
  const modalizeRef = useRef<Modalize>(null);
  const {t} = useTranslation();
  const [openingTime, setOpeningTime] = useState(false);
  const [value, setValue] = useState<RNTimePicker.ValueMap>({
    hours: 0,
    minutes: 0,
  });
  const [onPressedTime, setOnPressedTime] = useState(false);
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
    setOpeningTime(v => !v);
  };
  const onTimePicker = (times: any) => {
    if (isAndroid) {
      setTime(times?.getTime());
    } else {
      const timeSting = moment(times?.nativeEvent?.timestamp).format('HH:mm');
      const hours = Number(timeSting?.slice(0, 2));
      const minutes = Number(timeSting?.slice(3, 5));
      const endTime = new Date(startDate).setHours(hours, minutes);
      setTime(endTime);
    }
  };

  const renderTimePickerIOS = () => {
    return (
      <>
        <DateTimePicker
          value={new Date(time)}
          onChange={onTimePicker}
          mode="time"
          display="spinner"
          locale="en-ES"
          minuteInterval={15}
          textColor={colors.textPrimary}
        />
        <RN.View style={{marginBottom: 18}}>
          <Button
            disabled
            title={t('set_time')}
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
            title={t('set_time')}
            onPress={() => onPressSetTime()}
          />
        </RN.View>
      </>
    );
  };
  const [startDate, setStartDate] = useState(
    moment().format('YYYY-MM-DD') === moment(start).format('YYYY-MM-DD')
      ? null
      : start,
  );
  const [endDate, setEndDate] = useState(
    moment().format('YYYY-MM-DD') === moment(end).format('YYYY-MM-DD')
      ? null
      : end,
  );

  const dateEvent = `${String(
    minWeekDay.weekdaysMin(moment(startDate)),
  ).toUpperCase()}, ${String(
    moment(startDate).format('MMM Do'),
  ).toUpperCase()}${
    endDate !== null
      ? ' - ' +
        String(minWeekDay.weekdaysMin(moment(endDate))).toUpperCase() +
        ',' +
        String(moment(endDate).format('MMM Do')).toUpperCase()
      : ''
  }`;

  useEffect(() => {
    setStart({start: startDate !== null ? moment(startDate).toDate() : null});
    setEnd({
      end: isRecurring
        ? null
        : endDate !== null
        ? moment(endDate).toDate()
        : null,
    });
  }, [setEnd, setStart, endDate, startDate, isRecurring]);
  const marked = useMemo(() => {
    return {
      [startDate]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: colors.orange,
        selectedTextColor: colors.white,
      },
    };
  }, [startDate]);
  const setDateRange = () => {
    // if (startDate === moment(new Date().toDateString()).format('YYYY-MM-DD')) {
    //   return;
    // }
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
    if (isRecurring) {
      setStartDate(day?.dateString);
      setStart(day?.dateString);
      setEndDate(null);
      return;
    } else {
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
    }
    // console.log(day);
  };

  const onPressFinished = () => {
    if (!onPressedTime) {
      const nowTime = moment(new Date(time).getTime()).format('HH:mm');
      const hours = Number(nowTime?.slice(0, 2));
      const minutes = Number(nowTime?.slice(3, 5));
      const endTime = new Date(startDate).setHours(hours, minutes);
      setTime(endTime);
    }
    setStart(startDate);
    setEnd(endDate);
    if (endDate?.end === null) {
      setEndDate(startDate);
      setEnd(startDate);
    }
    onClosed();
  };
  const onPressClose = () => {
    setStart(startDate);
    setEnd(endDate);
    if (endDate?.end === null) {
      setEndDate(startDate);
      setEnd(startDate);
    }
    modalizeRef?.current?.close('default');
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
          <RN.Text style={styles.filtersText}>{t('date_time')}</RN.Text>
        </RN.View>
        <RN.TouchableOpacity
          style={{alignSelf: 'flex-end', marginTop: -25}}
          onPress={onPressClose}>
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
        closeOnOverlayTap={false}
        handlePosition="inside"
        scrollViewProps={{scrollEnabled: !openingTime && true}}
        modalStyle={styles.container}
        disableScrollIfPossible={false}
        adjustToContentHeight>
        <RN.View>
          {renderHeader()}
          <RN.View style={styles.nameTitle}>
            <RN.View style={{justifyContent: 'center'}}>
              {startDate !== null && (
                <RN.Text style={[styles.title, {fontSize: 15}]}>
                  {dateEvent}
                </RN.Text>
              )}
            </RN.View>
            <RN.TouchableOpacity
              style={styles.timeContainer}
              onPress={() => {
                setOnPressedTime(v => !v);
                setOpeningTime(v => !v);
              }}>
              <RN.Text style={styles.timeText}>
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
              markingType={!isRecurring ? 'period' : 'dot'}
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
              markedDates={isRecurring ? marked : setDateRange()}
            />
          )}
          {!openingTime && (
            <RN.View style={{marginVertical: 12, marginBottom: 18}}>
              <Button
                disabled
                title={t('selected_date.choosed')}
                onPress={onPressFinished}
              />
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
  timeContainer: {
    justifyContent: 'center',
    backgroundColor: colors.grayTransparent,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'lightgray',
  },
  timeText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 21,
    letterSpacing: 0.3,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
});

export default BottomCalendar;
