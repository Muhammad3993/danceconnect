import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from '@components/icons/arrowLeft';
import { DCButton } from '@components/shared/button';
import { DCInput } from '@components/shared/input';
import { t } from 'i18next';
import { LittleCalendarIcon } from '@components/icons/calendarIcon';
import { useTranslation } from 'react-i18next';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function CreateTicket() {
  const { styles, theme } = useStyles(styleSheet);

  const [toggle, setToggle] = useState(false);
  const { t } = useTranslation();
  const handleToggle = () => {
    setToggle(!toggle);
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.createTicketTop}>
        <ArrowLeftIcon fill={theme.colors.textPrimary} />
        <Text style={styles.createTicketTopTitle}>{t('create_ticket')}</Text>
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
          <Text style={styles.createTicketTitle}>{t('enable_ticket')}</Text>
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
            <Text style={styles.inputNameTopTitle}>{t('tt_set_title')}</Text>
            <Text style={styles.inputNameTopText}>{t('tt_set_desc')} 0</Text>
          </View>
          <DCInput
            placeholder={t('0')}
            inputStyle={styles.inputNameStyle}
            keyboardType="numeric"
            rightIcon={
              <Text style={{ color: theme.colors.textPrimary }}>USD</Text>
            }
          />
        </View>
        {/* Date */}
        <View style={styles.dateBoxes}>
          <View style={styles.date}>
            <Text style={styles.dateTitle}>{t('start_sale_date')}</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateBoxTitle}>03-01-2022 </Text>
              <LittleCalendarIcon stroke={theme.colors.darkGray} />
            </View>
          </View>
          <View style={styles.date}>
            <Text style={styles.dateTitle}>{t('end_sale_date')}</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateBoxTitle}>03-01-2022 </Text>
              <LittleCalendarIcon stroke={theme.colors.darkGray} />
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
              {t('description_title')}{' '}
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
          children={t('cancel')}
          containerStyle={{
            width: '50%',
            height: 58,
            flex: 1,
            borderWidth: 1,
            borderColor: theme.colors.secondary500,
            backgroundColor: theme.colors.white,
          }}
          textStyle={{
            color: theme.colors.secondary500,
          }}
        />
        <DCButton
          children={t('create_ticket')}
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

const styleSheet = createStyleSheet(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  createTicketTop: {
    height: 48,
    paddingHorizontal: theme.spacing.LG,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.MD,
  },
  createTicketTopTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  createTicketTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: theme.colors.black,
  },
  container: {
    paddingHorizontal: theme.spacing.LG,
  },
  createTicket: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.MD,
    marginTop: 15,
  },
  createTicketToggle: {
    width: 44,
    height: 24,
    backgroundColor: theme.colors.orange,
    borderRadius: 100,
    position: 'relative',
  },
  createTicketToggleBox: {
    width: 22,
    height: 22,
    backgroundColor: theme.colors.white,
    borderRadius: 50,
    position: 'absolute',
    top: 1,
    left: 1,
  },
  createTicketToggleBoxEnable: {
    width: 22,
    height: 22,
    backgroundColor: theme.colors.white,
    borderRadius: 50,
    position: 'absolute',
    top: 1,
    right: 1,
  },
  inputName: {
    marginTop: theme.spacing.LG,
  },
  inputNameTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputNameTopTitle: {
    color: theme.colors.black,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theme.fonts.latoRegular,
  },
  inputNameTopLimit: {
    color: theme.colors.darkGray,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: theme.fonts.latoRegular,
  },
  inputNameStyle: {
    padding: 0,
    paddingHorizontal: 16,
    height: 56,
    borderColor: theme.colors.gray50,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  inputNameTopText: {
    color: theme.colors.gray700,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: theme.fonts.latoRegular,
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
    color: theme.colors.black,
    fontFamily: theme.fonts.latoRegular,
  },
  dateBox: {
    width: '100%',
    backgroundColor: theme.colors.lightGray,
    borderWidth: 1,
    borderColor: theme.colors.gray50,
    borderRadius: theme.spacing.XS,
    paddingVertical: 17,
    paddingHorizontal: theme.spacing.MD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateBoxTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.latoRegular,
  },
  bodyTitle: {
    fontWeight: '400',
    fontSize: 16,
    color: theme.colors.darkGray,
    fontFamily: theme.fonts.latoRegular,
  },
  createTicketBottom: {
    width: '100%',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: theme.colors.gray75,
    paddingHorizontal: theme.spacing.LG,
    paddingVertical: theme.spacing.MD,
    gap: 10,
  },
}));
