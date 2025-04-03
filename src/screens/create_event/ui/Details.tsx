import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Header } from './Header';
import { CloseIcon } from '@components/icons/close';
import { Status } from './Status';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DCButton } from '@components/shared/button';
import { ArrowLeftIcon } from '@components/icons/arrowLeft';
import { UploadIcon } from '@components/icons/upload';
import { TrashIcon } from '@components/icons/trash';
import { images } from '@common/resources/images';
import { LittleCalendarIcon } from '@components/icons/calendarIcon';
import { useTranslation } from 'react-i18next';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface DetailsProps {
  click: () => void;
}

export const Details = ({ click }: DetailsProps) => {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(styleSheet);

  return (
    <SafeAreaView style={styles.root}>
      <Header
        rightIcon={<CloseIcon />}
        leftIcon={<ArrowLeftIcon fill={theme.colors.textPrimary} />}
      />
      <Status
        statusStyle1={{ opacity: 1 }}
        statusStyle2={{ opacity: 1 }}
        statusColorStyle1={{ backgroundColor: theme.colors.green }}
        statusColorStyle2={{ backgroundColor: theme.colors.secondary500 }}
        titleStyle1={{
          fontWeight: '400',
          color: theme.colors.textPrimary,
        }}
        titleStyle2={{
          fontWeight: '700',
          color: theme.colors.gray800,
        }}
      />
      <ScrollView>
        <View style={styles.dates}>
          <Text style={styles.inputNameTopTitle}>{t('add_event_date')}</Text>
          <Text style={styles.describe}>{t('description_desc')}</Text>
          <View style={styles.dateBoxes}>
            <View style={styles.date}>
              <Text style={styles.dateTitle}>{t('start_date')}</Text>
              <View style={styles.dateBox}>
                <Text style={styles.dateBoxTitle}>03-01-2022 </Text>
                <LittleCalendarIcon />
              </View>
            </View>
            <View style={styles.date}>
              <Text style={styles.dateTitle}>{t('end_date')}</Text>
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
              <Text style={styles.uploadTitle}>{t('upload_img')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.images}>
              <View style={styles.image}>
                <Image source={images.homeImg1} style={styles.img} />
                <TouchableOpacity style={styles.imageTrash}>
                  <TrashIcon stroke={theme.colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <View style={[styles.container, { marginBottom: 15 }]}>
          {/* <LocationSelector /> */}
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
};

const styleSheet = createStyleSheet(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  uploadBox: {
    marginBottom: 30,
    paddingHorizontal: theme.spacing.LG,
  },
  inputNameTopTitle: {
    color: theme.colors.black,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theme.fonts.latoRegular,
  },
  bodyTitle: {
    fontWeight: '400',
    fontSize: 16,
    color: theme.colors.darkGray,
    fontFamily: theme.fonts.latoRegular,
  },
  bodySubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.latoRegular,
    marginTop: 5,
  },
  upload: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.secondary200,
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
    fontFamily: theme.fonts.latoRegular,
    color: theme.colors.secondary500,
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
    backgroundColor: theme.colors.brown,
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: theme.spacing.LG,
  },
  dates: {
    paddingHorizontal: theme.spacing.LG,
    marginTop: 10,
    marginBottom: 20,
  },
  dateBoxes: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  describe: {
    fontSize: 16,
    fontWeight: '400',
    color: theme.colors.gray700,
    fontFamily: theme.fonts.latoRegular,
    marginTop: 5,
    marginBottom: 10,
  },
  bottom: {
    padding: theme.spacing.LG,
  },
}));
