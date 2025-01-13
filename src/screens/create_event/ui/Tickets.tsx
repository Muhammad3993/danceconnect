import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Header } from './Header';
import { CloseIcon } from 'components/icons/close';
import { Status } from './Status';
import { t } from 'i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DCButton } from 'components/shared/button';
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import { CustomCheckBox } from './check';
import { TicketFillIcon } from 'components/icons/ticketFill';
import { EditIconSvg } from 'components/icons/editIcon';
import { TrashIcon } from 'components/icons/trash';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function Tickets() {
  const { styles, theme } = useStyles(styleSheet);
  const [selectedBox, setSelectedBox] = useState(null);

  const navigation = useNavigation();

  const handleBoxPress = boxNumber => {
    setSelectedBox(boxNumber);
  };
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.root}>
      <Header
        rightIcon={<CloseIcon />}
        leftIcon={<ArrowLeftIcon fill={theme.colors.textPrimary} />}
      />
      <Status
        statusStyle1={{
          opacity: 1,
        }}
        statusStyle2={{
          opacity: 1,
        }}
        statusStyle3={{
          opacity: 1,
        }}
        statusColorStyle1={{
          backgroundColor: theme.colors.green,
        }}
        statusColorStyle2={{
          backgroundColor: theme.colors.green,
        }}
        statusColorStyle3={{
          backgroundColor: theme.colors.secondary500,
        }}
        titleStyle1={{
          fontWeight: '400',
          color: theme.colors.textPrimary,
        }}
        titleStyle2={{
          fontWeight: '400',
          color: theme.colors.textPrimary,
        }}
        titleStyle3={{
          fontWeight: '700',
          color: theme.colors.gray800,
        }}
      />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{t('ticket_type')}</Text>
          <TouchableOpacity
            style={selectedBox !== 1 ? styles.box : styles.boxActive}
            onPress={() => handleBoxPress(1)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.boxTitle}>{t('tt_free_title')}</Text>
              <Text style={styles.boxSubTitle}>{t('tt_free_desc')}</Text>
            </View>
            <CustomCheckBox
              value={selectedBox === 1}
              onValueChange={() => handleBoxPress(1)}
              containerStyle={{
                position: 'relative',
                top: 4,
              }}
            />
          </TouchableOpacity>
          {true && (
            <TouchableOpacity
              style={selectedBox !== 2 ? styles.box : styles.boxActive}
              onPress={() => handleBoxPress(2)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.boxTitle}>{t('tt_paid_title')}</Text>
                <Text style={styles.boxSubTitle}>{t('tt_paid_desc')}</Text>
              </View>
              <CustomCheckBox
                value={selectedBox === 2}
                onValueChange={() => handleBoxPress(2)}
                containerStyle={{
                  position: 'relative',
                  top: 4,
                }}
              />
            </TouchableOpacity>
          )}
          {true && (
            <TouchableOpacity
              style={selectedBox !== 3 ? styles.box : styles.boxActive}
              onPress={() => handleBoxPress(3)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.boxTitle}>{t('t_paid_title')}</Text>
                <Text style={styles.boxSubTitle}>{t('tt_paid_desc')}</Text>
              </View>
              <CustomCheckBox
                value={selectedBox === 3}
                onValueChange={() => handleBoxPress(3)}
                containerStyle={{
                  position: 'relative',
                  top: 4,
                }}
              />
            </TouchableOpacity>
          )}
          {selectedBox === 3 && (
            <View style={styles.ticket}>
              <View style={styles.ticketTop}>
                <View style={styles.ticketTopLeft}>
                  <TicketFillIcon />
                  <Text style={styles.ticketTitle}>Early birds</Text>
                </View>
                <View style={styles.ticketTopRight}>
                  <EditIconSvg
                    width={24}
                    height={24}
                    stroke={theme.colors.darkGray}
                  />
                  <TrashIcon
                    width={24}
                    height={24}
                    stroke={theme.colors.darkGray}
                  />
                </View>
              </View>
              <Text style={styles.ticketSubtitle}>
                Starts Jun 3,2023 / Ends Jun 13,2023 / Limit 100
              </Text>
              <Text style={styles.ticketSubtitle}>
                Price 30 USD (+10% platform fee + 3$ Stripe fee)
              </Text>
              <Text style={styles.ticketDescription}>
                Description here entrance is paid and there are one or more
                types of tickets.{' '}
              </Text>
              <View style={styles.ticketBottom}>
                <View style={styles.ticketBottomLeft}>
                  <View style={styles.tickeCircle}></View>
                  <Text style={styles.ticketBottomTitle}>On Hold</Text>
                </View>
                <View style={styles.ticketBottomRight}>
                  <Text
                    style={[
                      styles.ticketBottomTitle,
                      { color: theme.colors.gray700 },
                    ]}>
                    Final price:
                  </Text>
                  <Text
                    style={[styles.ticketBottomTitle, { fontWeight: '700' }]}>
                    39.00 USD
                  </Text>
                </View>
              </View>
            </View>
          )}
          {(selectedBox === 2 || selectedBox === 3) && (
            <DCButton
              children={'+' + ' ' + t('add_ticket')}
              containerStyle={{
                height: 58,
                marginTop: 10,
                backgroundColor: theme.colors.white,
                borderWidth: 1,
                borderColor: theme.colors.secondary500,
              }}
              textStyle={{
                color: theme.colors.secondary500,
              }}
              onPress={() => navigation.navigate('createTicket')}
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <DCButton
          children={t('create_event')}
          containerStyle={{
            height: 58,
          }}
          disabled={selectedBox === 2}
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
  title: {
    color: theme.colors.black,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theme.fonts.latoRegular,
  },
  container: {
    paddingHorizontal: theme.spacing.LG,
  },
  box: {
    paddingVertical: 20,
    paddingHorizontal: theme.spacing.MD,
    borderWidth: 1,
    borderColor: theme.colors.gray250,
    borderRadius: theme.spacing.XS,
    backgroundColor: theme.colors.white,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  boxActive: {
    paddingVertical: 20,
    paddingHorizontal: theme.spacing.MD,
    borderWidth: 1,
    borderColor: theme.colors.secondary500,
    borderRadius: theme.spacing.XS,
    backgroundColor: theme.colors.white,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  boxTitle: {
    fontWeight: '700',
    fontFamily: theme.fonts.latoRegular,
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  boxSubTitle: {
    fontSize: 16,
    color: theme.colors.gray700,
    marginTop: 5,
  },
  ticket: {
    backgroundColor: theme.colors.lightOrange,
    marginTop: 10,
    borderRadius: theme.spacing.XS,
    paddingVertical: 20,
    paddingHorizontal: theme.spacing.MD,
  },
  ticketTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.XS,
  },
  ticketTitle: {
    fontWeight: '700',
    fontFamily: theme.fonts.latoRegular,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  ticketTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.MD,
  },
  ticketSubtitle: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '400',
    fontFamily: theme.fonts.latoRegular,
    marginTop: 10,
    lineHeight: 21,
  },
  ticketDescription: {
    fontSize: 14,
    color: theme.colors.gray700,
    fontWeight: '400',
    fontFamily: theme.fonts.latoRegular,
    marginTop: 10,
    lineHeight: 21,
  },
  ticketBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  ticketBottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.XS,
  },
  ticketBottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tickeCircle: {
    width: 9,
    height: 9,
    borderRadius: 50,
    backgroundColor: theme.colors.orange,
    position: 'relative',
    top: 0.5,
  },
  ticketBottomTitle: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '400',
    fontFamily: theme.fonts.latoRegular,
  },
  bottom: {
    padding: theme.spacing.LG,
  },
}));
