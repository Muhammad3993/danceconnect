import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { theming } from 'common/constants/theming';
import { Header } from './Header';
import { CloseIcon } from 'components/icons/close';
import { Status } from './Status';
import { t } from 'i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DCButton } from 'components/shared/button';
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import { CustomCheckBox } from './check';
import { TicketFillIcon } from 'components/icons/ticketFill';
import { EditFillIcon } from 'components/icons/editFIll';
import { EditIconSvg } from 'components/icons/editIcon';
import { TrashIcon } from 'components/icons/trash';
import { useNavigation } from '@react-navigation/native';

export function Tickets() {
  const [selectedBox, setSelectedBox] = useState(null);

  const navigation = useNavigation();

  const handleBoxPress = boxNumber => {
    setSelectedBox(boxNumber);
  };
  return (
    <SafeAreaView style={styles.root}>
      <Header
        rightIcon={<CloseIcon />}
        leftIcon={<ArrowLeftIcon fill={theming.colors.textPrimary} />}
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
          backgroundColor: theming.colors.green,
        }}
        statusColorStyle2={{
          backgroundColor: theming.colors.green,
        }}
        statusColorStyle3={{
          backgroundColor: theming.colors.purple,
        }}
        titleStyle1={{
          fontWeight: '400',
          color: theming.colors.textPrimary,
        }}
        titleStyle2={{
          fontWeight: '400',
          color: theming.colors.textPrimary,
        }}
        titleStyle3={{
          fontWeight: '700',
          color: theming.colors.gray800,
        }}
      />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{t('ticket_type')}</Text>
          <TouchableOpacity
            style={selectedBox !== 1 ? styles.box : styles.boxActive}
            onPress={() => handleBoxPress(1)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.boxTitle}>Free Event. No tickets needed</Text>
              <Text style={styles.boxSubTitle}>
                Guests don't need tickets and the number of visitors is not
                limited.
              </Text>
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
                <Text style={styles.boxTitle}>Tickets needed</Text>
                <Text style={styles.boxSubTitle}>
                  Entrance is paid and there are one or more types of tickets or
                  Entrance is free, but the number of visitors is limited.
                </Text>
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
                <Text style={styles.boxTitle}>Paid tickets needed</Text>
                <Text style={styles.boxSubTitle}>
                  Entrance is paid and there are one or more types of tickets or
                  Entrance is free, but the number of visitors is limited.
                </Text>
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
                    stroke={theming.colors.darkGray}
                  />
                  <TrashIcon
                    width={24}
                    height={24}
                    stroke={theming.colors.darkGray}
                  />
                </View>
              </View>
              <Text style={styles.ticketSubtitle}>Starts Jun 3,2023 / Ends Jun 13,2023 / Limit 100</Text>
              <Text style={styles.ticketSubtitle}>Price 30 USD (+10% platform fee + 3$ Stripe fee)</Text>
              <Text style={styles.ticketDescription}>Description here entrance is paid and there are one or more types of tickets. </Text>
              <View style={styles.ticketBottom}>
                <View style={styles.ticketBottomLeft}>
                  <View style={styles.tickeCircle}></View>
                  <Text style={styles.ticketBottomTitle}>On Hold</Text>
                </View>
                <View style={styles.ticketBottomRight}>
                  <Text style={[styles.ticketBottomTitle, {color: theming.colors.gray700}]}>Final price:</Text>
                  <Text style={[styles.ticketBottomTitle, {fontWeight: "700"}]}>39.00 USD</Text>
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
                  backgroundColor: theming.colors.white,
                  borderWidth: 1,
                  borderColor: theming.colors.purple,
                }}
                textStyle={{
                  color: theming.colors.purple,
                }}
                onPress={() => navigation.navigate("createTicket")}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  title: {
    color: theming.colors.black,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
  },
  container: {
    paddingHorizontal: theming.spacing.LG,
  },
  box: {
    paddingVertical: 20,
    paddingHorizontal: theming.spacing.MD,
    borderWidth: 1,
    borderColor: theming.colors.gray250,
    borderRadius: theming.spacing.SM,
    backgroundColor: theming.colors.white,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  boxActive: {
    paddingVertical: 20,
    paddingHorizontal: theming.spacing.MD,
    borderWidth: 1,
    borderColor: theming.colors.purple,
    borderRadius: theming.spacing.SM,
    backgroundColor: theming.colors.white,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  boxTitle: {
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    fontSize: 18,
    color: theming.colors.textPrimary,
  },
  boxSubTitle: {
    fontSize: 16,
    color: theming.colors.gray700,
    marginTop: 5,
  },
  ticket: {
    backgroundColor: theming.colors.lightOrange,
    marginTop: 10,
    borderRadius: theming.spacing.SM,
    paddingVertical: 20,
    paddingHorizontal: theming.spacing.MD,
  },
  ticketTop: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  ticketTopLeft: {
    flexDirection: "row",
    alignItems: 'center',
    gap: theming.spacing.SM
  },
  ticketTitle: {
    fontWeight: "700",
    fontFamily: theming.fonts.latoRegular,
    fontSize: 16,
    color: theming.colors.textPrimary,
  },
  ticketTopRight: {
    flexDirection: "row",
    alignItems: 'center',
    gap: theming.spacing.MD
  },
  ticketSubtitle: {
    fontSize: 14,
    color: theming.colors.textPrimary,
    fontWeight: "400",
    fontFamily: theming.fonts.latoRegular,
    marginTop: 10,
    lineHeight: 21,
  },
  ticketDescription: {
    fontSize: 14,
    color: theming.colors.gray700,
    fontWeight: "400",
    fontFamily: theming.fonts.latoRegular,
    marginTop: 10,
    lineHeight: 21,
  },
  ticketBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  ticketBottomLeft: {
    flexDirection: "row",
    alignItems: 'center',
    gap: theming.spacing.SM
  },
  ticketBottomRight: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 4,
  },
  tickeCircle: {
    width: 9,
    height: 9,
    borderRadius: 50,
    backgroundColor: theming.colors.orange,
    position: "relative",
    top: .5,
  },
  ticketBottomTitle: {
    fontSize: 16,
    color: theming.colors.textPrimary,
    fontWeight: "400",
    fontFamily: theming.fonts.latoRegular,
  },
  bottom: {
    padding: theming.spacing.LG,
  },
});
