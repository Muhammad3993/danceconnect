import React, {useEffect, useRef, useState} from 'react';
import * as RN from 'react-native';
import colors from '../utils/colors';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import {Button} from './Button';
import {useTranslation} from 'react-i18next';

const moment = extendMoment(Moment);

type props = {
  onClose: () => void;
  start?: any;
  end?: any;
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
const BottomCalendarForEvents = ({
  onClose,
  start = moment().format('YYYY-MM-DD'),
  end = moment().format('YYYY-MM-DD'),
  setEnd,
  setStart,
}: props) => {
  const minDate = new Date().toDateString();
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const {t} = useTranslation();

  const onClosed = () => {
    setStart(null);
    setEnd(null);
    setStartDate(null);
    setEndDate(null);
    onClose();
  };

  // console.log('calendar', startDate, start);
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
  };

  const onPressFinished = () => {
    setStart(startDate);
    setStartDate(startDate);
    setEnd(endDate);
    setEndDate(endDate);
    onClose();
    // onClosed();
  };
  return (
    <RN.View>
      {startDate !== null && (
        <RN.View style={styles.nameTitle}>
          <RN.View>
            <RN.Text style={styles.title}>
              {t('selected_date.title')}:
              <RN.Text style={{color: colors.darkGray}}>
                {` ${moment(startDate).format('MMMM Do')}${
                  endDate !== null
                    ? ' - ' + moment(endDate).format('MMMM Do')
                    : ''
                }`}
              </RN.Text>
            </RN.Text>
          </RN.View>
        </RN.View>
      )}
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
        hideExtraDays
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
      <RN.View style={{marginVertical: 12, marginBottom: 18}}>
        <Button
          disabled={startDate !== null}
          title={t('selected_date.choosed')}
          onPress={onPressFinished}
        />
      </RN.View>
    </RN.View>
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
    padding: 20,
    paddingTop: 0,
    alignSelf: 'center',
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

export default BottomCalendarForEvents;
