import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { theming } from 'common/constants/theming';
import { Header } from './Header';
import { CloseIcon } from 'components/icons/close';
import { Status } from './Status';
import { t } from 'i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DCButton } from 'components/shared/button';
import { ArrowLeftIcon } from 'components/icons/arrowLeft';
import { UploadIcon } from 'components/icons/upload';
import { TrashIcon } from 'components/icons/trash';
import LocationSelector from 'components/location_selector';
import { images } from 'common/resources/images';
import { LittleCalendarIcon } from 'components/icons/calendarIcon';

interface DetailsProps {
  click: () => void
}

export const Details = ({click}: DetailsProps) => {

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
        statusColorStyle1={{
          backgroundColor: theming.colors.green,
        }}
        statusColorStyle2={{
          backgroundColor: theming.colors.purple,
        }}
        titleStyle1={{
          fontWeight: '400',
          color: theming.colors.textPrimary,
        }}
        titleStyle2={{
          fontWeight: '700',
          color: theming.colors.gray800,
        }}
      />
      <ScrollView>
        <View style={styles.dates}>
          <Text style={styles.inputNameTopTitle}>{t('add_event_date')}</Text>
          <Text style={styles.describe}>{t('description_desc')}</Text>
          <View style={styles.dateBoxes}>
            <View style={styles.date}>
              <Text style={styles.dateTitle}>Start Date</Text>
              <View style={styles.dateBox}>
                <Text style={styles.dateBoxTitle}>03-01-2022 </Text>
                <LittleCalendarIcon />
              </View>
            </View>
            <View style={styles.date}>
              <Text style={styles.dateTitle}>End Date</Text>
              <View style={styles.dateBox}>
                <Text style={styles.dateBoxTitle}>03-01-2022 </Text>
                <LittleCalendarIcon />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.uploadBox}>
          <Text style={styles.inputNameTopTitle}>
            {t('upload_img_title')}
            <Text style={styles.bodyTitle}>{t('optional')}</Text>
          </Text>
          <Text style={styles.bodySubtitle}>{t('upload_img_desc')}</Text>
          {true ? (
            <TouchableOpacity style={styles.upload}>
              <UploadIcon />
              <Text style={styles.uploadTitle}>Upload picture</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.images}>
              <View style={styles.image}>
                <Image source={images.homeImg1} style={styles.img} />
                <TouchableOpacity style={styles.imageTrash}>
                  <TrashIcon stroke={theming.colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <View style={[styles.container, { marginBottom: 15 }]}>
          <LocationSelector />
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <DCButton
          children="Next"
          containerStyle={{
            height: 58,
          }}
          onPress={click}
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
  uploadBox: {
    marginBottom: 30,
    paddingHorizontal: theming.spacing.LG,
  },
  inputNameTopTitle: {
    color: theming.colors.black,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
  },
  bodyTitle: {
    fontWeight: '400',
    fontSize: 16,
    color: theming.colors.darkGray,
    fontFamily: theming.fonts.latoRegular,
  },
  bodySubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 5,
  },
  upload: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theming.colors.secondary200,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 15,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.purple,
  },
  images: {
    marginTop: 20,
  },
  image: {
    width: 177,
    height: 141,
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageTrash: {
    width: 40,
    height: 40,
    backgroundColor: theming.colors.brown,
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: theming.spacing.LG,
  },
  dates: {
    paddingHorizontal: theming.spacing.LG,
    marginTop: 10,
    marginBottom: 20,
  },
  dateBoxes: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    width: "48%",
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theming.colors.black,
    fontFamily: theming.fonts.latoRegular,
  },
  dateBox: {
    width: "100%",
    backgroundColor: theming.colors.lightGray,
    borderWidth: 1,
    borderColor: theming.colors.gray50,
    borderRadius: theming.spacing.SM,
    paddingVertical: 17,
    paddingHorizontal: theming.spacing.MD,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dateBoxTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: theming.colors.textPrimary,
    fontFamily: theming.fonts.latoRegular,
  },
  describe: {
    fontSize: 16,
    fontWeight: '400',
    color: theming.colors.gray700,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 5,
    marginBottom: 10,
  },
  bottom: {
    padding: theming.spacing.LG,
  },
});
