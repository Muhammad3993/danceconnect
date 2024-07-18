import { theming } from 'common/constants/theming';
import { images } from 'common/resources/images';
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import { CalendarIcon } from 'components/icons/calendar';
import { EditIconSvg } from 'components/icons/editIcon';
import { LocationIcon } from 'components/icons/location';
import { SettingIcon } from 'components/icons/settingIcon';
import { ShareIcon } from 'components/icons/shareIcon';
import { TicketIcon } from 'components/icons/ticket';
import { DCButton } from 'components/shared/button';
import { DCRoundIcon } from 'components/shared/round_icon';
import { DCLine } from 'components/shared/line';
import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

export function EventScreen() {
  const { t } = useTranslation();
  const [isActiveBox, setIsActiveBox] = useState(1);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ImageBackground source={images.eventBg} style={styles.backgroundImage}>
          <View style={styles.eventTop}>
            <DCRoundIcon icon={<ArrowLeftIcon fill={theming.colors.white} />} />
            <View style={styles.eventTopRight}>
              <DCRoundIcon icon={<EditIconSvg />} />
              <DCRoundIcon icon={<SettingIcon />} />
              <DCRoundIcon icon={<ShareIcon />} />
            </View>
          </View>

          <View style={styles.eventBoxes}>
            <View
              style={
                isActiveBox !== 1 ? styles.eventBox : styles.eventBoxActive
              }>
              <Text
                style={
                  isActiveBox !== 1
                    ? styles.eventBoxTitle
                    : styles.eventBoxTitleActive
                }
                onPress={() => setIsActiveBox(1)}>
                Festival
              </Text>
            </View>
            <View
              style={
                isActiveBox !== 2 ? styles.eventBox : styles.eventBoxActive
              }>
              <Text
                style={
                  isActiveBox !== 2
                    ? styles.eventBoxTitle
                    : styles.eventBoxTitleActive
                }
                onPress={() => setIsActiveBox(2)}>
                Salsa
              </Text>
            </View>
            <View
              style={
                isActiveBox !== 3 ? styles.eventBox : styles.eventBoxActive
              }>
              <Text
                style={
                  isActiveBox !== 3
                    ? styles.eventBoxTitle
                    : styles.eventBoxTitleActive
                }
                onPress={() => setIsActiveBox(3)}>
                Bachata
              </Text>
            </View>
            <View
              style={
                isActiveBox !== 4 ? styles.eventBox : styles.eventBoxActive
              }>
              <Text
                style={
                  isActiveBox !== 4
                    ? styles.eventBoxTitle
                    : styles.eventBoxTitleActive
                }
                onPress={() => setIsActiveBox(4)}>
                Kizomba
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.eventBody}>
          <Text style={styles.eventTitle}>New York Salsa Festival</Text>

          <View style={styles.eventPeople}>
            <View style={styles.eventPeopleLeft}>
              <Image source={images.eventAvatar} style={styles.eventAvatar} />
              <Text style={styles.eventPeopleTitle}>+ 1 going</Text>
            </View>
            <View style={styles.eventPeopleRight}>
              <Text style={styles.eventPeopleRightTitle}>$25.00</Text>
            </View>
          </View>

          <DCLine />

          <View style={styles.eventColumn}>
            <View style={styles.eventRow}>
              <DCRoundIcon
                icon={<CalendarIcon />}
                iconBoxStyle={{
                  width: 44,
                  height: 44,
                  backgroundColor: theming.colors.transparentPurple,
                }}
              />
              <View>
                <Text style={styles.eventDate}>
                  Mon, Dec 24 - Dec 29 • 21:00
                </Text>
                <Text style={styles.eventTime}>GMT +07:00</Text>
              </View>
            </View>

            <View style={styles.eventRow}>
              <DCRoundIcon
                icon={<LocationIcon />}
                iconBoxStyle={{
                  width: 44,
                  height: 44,
                  backgroundColor: theming.colors.transparentPurple,
                }}
              />
              <View style={styles.eventRowBox}>
                <Text style={styles.eventDate}>La Favela Night Club</Text>
                <View style={styles.eventMaps}>
                  <Text style={styles.eventMapsTitle}>Maps</Text>
                  <ArrowLeftIcon
                    fill={theming.colors.purple}
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.eventRow}>
              <Image
                source={images.eventAvatar}
                style={styles.eventOrganizerAvatar}
              />
              <View>
                <Text
                  style={[styles.eventDate, { fontSize: theming.spacing.MD }]}>
                  World of Dance
                </Text>
                <Text style={styles.eventTime}>Organizer</Text>
              </View>
            </View>
          </View>

          <DCLine />

          <View
            style={[styles.eventRow, { marginVertical: 15, marginBottom: 30 }]}>
            <DCRoundIcon
              icon={<TicketIcon fill={theming.colors.purple} />}
              iconBoxStyle={{
                width: 44,
                height: 44,
                backgroundColor: theming.colors.transparentPurple,
              }}
            />
            <View>
              <Text style={styles.eventDate}>$25.00 - $100.00</Text>
              <Text style={styles.eventTime}>
                Ticket price depends on package
              </Text>
            </View>
          </View>

          <DCButton
          // containerStyle={{
          //   borderColor: theming.colors.purple,
          //   borderRadius: 100,
          // }}
          // textStyle={{
          //   color: theming.colors.purple,
          //   fontWeight: '700',
          //   fontFamily: theming.fonts.latoRegular,
          // }}
          >
            {t('manage_tickets')}
          </DCButton>

          <View style={{ marginTop: 25 }}>
            <Text style={styles.eventSubtitle}>About this event</Text>
            <Text style={styles.eventDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut Read moreLorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut Read more.Lorem ipsum dolor
              sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut Read
              moreLorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut Read more......
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  backgroundImage: {
    width: '100%',
    height: 340,
    position: 'relative',
    marginBottom: 30,
  },
  eventTop: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theming.spacing.LG,
  },
  eventTopRight: {
    flexDirection: 'row',
    gap: theming.spacing.SM,
  },
  eventBoxes: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: theming.spacing.LG,
    position: 'absolute',
    bottom: -12,
    zIndex: 1,
  },
  eventBox: {
    borderWidth: 1,
    borderColor: theming.colors.purple,
    backgroundColor: theming.colors.white,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  eventBoxActive: {
    borderWidth: 1,
    borderColor: theming.colors.purple,
    backgroundColor: theming.colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  eventBoxTitle: {
    color: theming.colors.purple,
    fontWeight: '700',
    fontSize: 14,
    position: 'relative',
    top: -1,
    fontFamily: theming.fonts.latoRegular,
  },
  eventBoxTitleActive: {
    color: theming.colors.white,
    fontWeight: '700',
    fontSize: 14,
    position: 'relative',
    top: -1,
    fontFamily: theming.fonts.latoRegular,
  },
  eventBody: {
    paddingHorizontal: theming.spacing.LG,
  },
  eventTitle: {
    fontSize: theming.spacing.LG,
    color: theming.colors.textPrimary,
    fontWeight: '700',
  },
  eventPeople: {
    width: '100%',
    height: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  eventPeopleLeft: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theming.spacing.SM,
  },
  eventAvatar: {
    width: 36,
    height: '100%',
  },
  eventPeopleTitle: {
    color: theming.colors.textPrimary,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: theming.fonts.latoRegular,
  },
  eventPeopleRight: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theming.colors.green,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  eventPeopleRightTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.white,
  },
  eventDate: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.gray700,
  },
  eventRow: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventRowBox: {
    width: '84%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventMaps: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventMapsTitle: {
    color: theming.colors.purple,
    fontSize: theming.spacing.MD,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
  },
  eventOrganizerAvatar: {
    width: 44,
    height: 44,
  },
  eventColumn: {
    marginVertical: 15,
    gap: 12,
  },
  eventSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
  },
  eventDescription: {
    fontSize: theming.spacing.MD,
    fontWeight: '500',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.gray800,
    marginVertical: theming.spacing.MD,
    // marginBottom: theming.spacing.MD
  },
});
