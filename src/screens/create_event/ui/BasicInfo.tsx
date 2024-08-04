import {
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
import { DCInput } from 'components/shared/input';
import CategorySelector from 'components/category_selector';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DCButton } from 'components/shared/button';

interface BasicInfoProps {
  click: () => void
}

export const BasicInfo = ({ click }: BasicInfoProps) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryError, setCategoryError] = useState('');

  const [eventType, setEventType] = useState('');

  console.log(eventType);

  const data = [
    {
      id: 1,
      name: 'Festival',
    },
    {
      id: 2,
      name: 'Competition',
    },
    {
      id: 3,
      name: 'Workshop',
    },
    {
      id: 4,
      name: 'Class',
    },
    {
      id: 5,
      name: 'Party',
    },
    {
      id: 6,
      name: 'Congress',
    },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <Header rightIcon={<CloseIcon />} />
      <Status
        statusStyle1={{
          opacity: 1,
        }}
        statusColorStyle1={{
          backgroundColor: theming.colors.purple,
        }}
        titleStyle1={{
          fontWeight: '700',
          color: theming.colors.gray800,
        }}
      />
      <ScrollView>
        {/* Name */}
        <View style={styles.inputName}>
          <View style={styles.inputNameTop}>
            <Text style={styles.inputNameTopTitle}>{t('event_name')}</Text>
            <Text style={styles.inputNameTopLimit}>0/100</Text>
          </View>
          <DCInput placeholder={t('name')} inputStyle={styles.inputNameStyle} />
        </View>
        {/* Choose eventType */}
        <View style={[styles.container, { marginBottom: 20 }]}>
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.inputNameTopTitle}>{t('choose_ev_type')}</Text>
          </View>
          <View style={styles.eventTypes}>
            {data.map(item => (
              <TouchableOpacity
                key={item.id}
                style={
                  eventType !== item.name
                    ? styles.eventType
                    : styles.eventTypeActive
                }
                onPress={() => setEventType(item.name)}>
                <Text
                  style={
                    eventType !== item.name
                      ? styles.eventTypeText
                      : styles.eventTypeTextActive
                  }>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Selected category */}
        <View>
          <View style={[styles.container, { marginBottom: 15 }]}>
            <Text style={styles.inputNameTopTitle}>
              {t('choose_category_title')}{' '}
              <Text style={styles.bodyTitle}>{t('few')}</Text>
            </Text>
            <Text style={styles.bodySubtitle}>{t('ds_desc_event')}</Text>
          </View>
          <CategorySelector
            value={selectedCategories}
            onChange={setSelectedCategories}
            errorMessage={categoryError}
          />
        </View>
        {/* Desctription */}
        <View style={styles.inputName}>
          <View style={styles.inputNameTop}>
            <Text style={styles.inputNameTopTitle}>
              {t('description_title')}
            </Text>
            <Text style={styles.inputNameTopLimit}>0/350</Text>
          </View>
          <Text style={styles.describe}>{t('description_desc')}</Text>
          <DCInput
            placeholder={t('description')}
            inputStyle={styles.inputNameStyle}
          />
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
  inputName: {
    marginTop: 10,
    marginBottom: theming.spacing.LG,
    paddingHorizontal: theming.spacing.LG,
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
  eventTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theming.spacing.SM,
  },
  eventType: {
    paddingVertical: theming.spacing.SM,
    paddingHorizontal: theming.spacing.MD,
    borderWidth: 1,
    borderColor: theming.colors.gray400,
    borderRadius: 100,
  },
  eventTypeActive: {
    paddingVertical: theming.spacing.SM,
    paddingHorizontal: theming.spacing.MD,
    borderWidth: 1,
    borderColor: theming.colors.orange,
    borderRadius: 100,
  },
  eventTypeText: {
    color: theming.colors.darkGray,
    fontWeight: '600',
    fontFamily: theming.fonts.latoRegular,
    fontSize: 16,
  },
  eventTypeTextActive: {
    color: theming.colors.orange,
    fontWeight: '600',
    fontFamily: theming.fonts.latoRegular,
    fontSize: 16,
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
  container: {
    paddingHorizontal: theming.spacing.LG,
  },
  describe: {
    fontSize: 16,
    fontWeight: '400',
    color: theming.colors.gray700,
    fontFamily: theming.fonts.latoRegular,
    marginBottom: 15,
  },
  bottom: {
    padding: theming.spacing.LG,
  },
});
