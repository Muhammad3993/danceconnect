import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theming } from 'common/constants/theming';
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import { DCButton } from 'components/shared/button';
import { DCInput } from 'components/shared/input';
import { t } from 'i18next';
import { LittleCalendarIcon } from 'components/icons/calendarIcon';

export default function CreateTicket() {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.createTicketTop}>
        <ArrowLeftIcon fill={theming.colors.textPrimary} />
        <Text style={styles.createTicketTopTitle}>Create Ticket</Text>
      </View>
      <ScrollView style={styles.container}>
        {/* Toggle */}
        <View style={styles.createTicket}>
          <TouchableOpacity
            style={styles.createTicketToggle}
            onPress={handleToggle}>
            <View
              style={
                !toggle
                  ? styles.createTicketToggleBox
                  : styles.createTicketToggleBoxEnable
              }></View>
          </TouchableOpacity>
          <Text style={styles.createTicketTitle}>Enable Ticket</Text>
        </View>
        {/* Name */}
        <View style={styles.inputName}>
          <View style={styles.inputNameTop}>
            <Text style={styles.inputNameTopTitle}>{t('ticket_name')}</Text>
            <Text style={styles.inputNameTopLimit}>0/100</Text>
          </View>
          <DCInput placeholder={t('name')} inputStyle={styles.inputNameStyle} />
        </View>
        {/* Price */}
        <View style={styles.inputName}>
          <View>
            <Text style={styles.inputNameTopTitle}>Set Ticket Price</Text>
            <Text style={styles.inputNameTopText}>
              If event is free leave 0
            </Text>
          </View>
          <DCInput
            placeholder={t('0')}
            inputStyle={styles.inputNameStyle}
            keyboardType="numeric"
            rightIcon={
              <Text style={{ color: theming.colors.textPrimary }}>USD</Text>
            }
          />
        </View>
        {/* Date */}
        <View style={styles.dateBoxes}>
          <View style={styles.date}>
            <Text style={styles.dateTitle}>Set Start Sale Date</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateBoxTitle}>03-01-2022 </Text>
              <LittleCalendarIcon stroke={theming.colors.darkGray} />
            </View>
          </View>
          <View style={styles.date}>
            <Text style={styles.dateTitle}>Set End Sale Date</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateBoxTitle}>03-01-2022 </Text>
              <LittleCalendarIcon stroke={theming.colors.darkGray} />
            </View>
          </View>
        </View>
        {/* Quantity */}
        <View style={styles.inputName}>
          <View style={styles.inputNameTop}>
            <Text style={styles.inputNameTopTitle}>
              {t('quantity_availalbe')}{' '}
              <Text style={styles.bodyTitle}>{t('optional')}</Text>
            </Text>
          </View>
          <DCInput
            placeholder={t('0')}
            inputStyle={styles.inputNameStyle}
            keyboardType="numeric"
          />
        </View>
        {/* Description */}
        <View style={styles.inputName}>
          <View style={styles.inputNameTop}>
            <Text style={styles.inputNameTopTitle}>
              {t('description_title')} {" "}
              <Text style={styles.bodyTitle}>{t('optional')}</Text>
            </Text>
            <Text style={styles.inputNameTopLimit}>0/350</Text>
          </View>
          <DCInput
            placeholder={t('description')}
            inputStyle={styles.inputNameStyle}
          />
        </View>
      </ScrollView>
      <View style={styles.createTicketBottom}>
        <DCButton
          children="Cancel"
          containerStyle={{
            width: '50%',
            height: 58,
            flex: 1,
            borderWidth: 1,
            borderColor: theming.colors.purple,
            backgroundColor: theming.colors.white,
          }}
          textStyle={{
            color: theming.colors.purple,
          }}
        />
        <DCButton
          children="Create Ticket"
          containerStyle={{
            width: '50%',
            height: 58,
            flex: 1,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  createTicketTop: {
    height: 48,
    paddingHorizontal: theming.spacing.LG,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theming.spacing.MD,
  },
  createTicketTopTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theming.colors.textPrimary,
  },
  createTicketTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: theming.colors.black,
  },
  container: {
    paddingHorizontal: theming.spacing.LG,
  },
  createTicket: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theming.spacing.MD,
    marginTop: 15,
  },
  createTicketToggle: {
    width: 44,
    height: 24,
    backgroundColor: theming.colors.orange,
    borderRadius: 100,
    position: 'relative',
  },
  createTicketToggleBox: {
    width: 22,
    height: 22,
    backgroundColor: theming.colors.white,
    borderRadius: 50,
    position: 'absolute',
    top: 1,
    left: 1,
  },
  createTicketToggleBoxEnable: {
    width: 22,
    height: 22,
    backgroundColor: theming.colors.white,
    borderRadius: 50,
    position: 'absolute',
    top: 1,
    right: 1,
  },
  inputName: {
    marginTop: theming.spacing.LG,
  },
  inputNameTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputNameTopTitle: {
    color: theming.colors.black,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
  },
  inputNameTopLimit: {
    color: theming.colors.darkGray,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: theming.fonts.latoRegular,
  },
  inputNameStyle: {
    padding: 0,
    paddingHorizontal: 16,
    height: 56,
    borderColor: theming.colors.gray50,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  inputNameTopText: {
    color: theming.colors.gray700,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: theming.fonts.latoRegular,
    marginTop: 5,
    marginBottom: 12,
  },
  dateBoxes: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  date: {
    width: '48%',
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theming.colors.black,
    fontFamily: theming.fonts.latoRegular,
  },
  dateBox: {
    width: '100%',
    backgroundColor: theming.colors.lightGray,
    borderWidth: 1,
    borderColor: theming.colors.gray50,
    borderRadius: theming.spacing.SM,
    paddingVertical: 17,
    paddingHorizontal: theming.spacing.MD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateBoxTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
  },
  bodyTitle: {
    fontWeight: '400',
    fontSize: 16,
    color: theming.colors.darkGray,
    fontFamily: theming.fonts.latoRegular,
  },
  createTicketBottom: {
    width: '100%',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: theming.colors.gray75,
    paddingHorizontal: theming.spacing.LG,
    paddingVertical: theming.spacing.MD,
    gap: 10,
  },
});
