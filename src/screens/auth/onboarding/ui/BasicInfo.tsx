import React, { useRef } from 'react';
import { genders, roles } from 'common/constants';
import { DCInput } from 'components/shared/input';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LocationSelector } from 'components/location_selector';
import { Controller, useFormContext } from 'react-hook-form';
import { User } from 'data/api/user/inerfaces';
import { Header } from './Header';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { images } from 'common/resources/images';

export const BasicInfo = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<Partial<User>>();
  const locationRef = useRef<BottomSheetModal>(null);
  const { styles, theme } = useStyles(styleSheet);

  return (
    <ScrollView style={{ flex: 1 }}>
      <Header title={t('yourself')} description={t('yourself_desc')} />

      <Text style={styles.placeholderTitle}>{t('name')}</Text>

      <Controller
        control={control}
        name="fullName"
        render={({ field: { value, onChange }, fieldState }) => {
          return (
            <DCInput
              containerStyle={[
                { paddingHorizontal: theme.spacing.LG },
                styles.input,
              ]}
              onChangeText={onChange}
              value={value}
              placeholder="ex. Eric"
              errorText={fieldState.error?.message}
            />
          );
        }}
      />

      <Text style={styles.placeholderTitle}>{t('gender')}</Text>

      <Controller
        control={control}
        name="userGender"
        render={({ field: { value, onChange }, fieldState }) => {
          return (
            <View style={styles.input}>
              <ScrollView
                style={{ paddingHorizontal: theme.spacing.LG }}
                showsHorizontalScrollIndicator={false}
                horizontal>
                {genders.map(item => {
                  if (!item.title.length) {
                    return null;
                  }
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => onChange(item.title)}
                      style={[
                        styles.choiseItem,
                        value === item.title && styles.choiseItemActive,
                      ]}>
                      <Text style={styles.choiseItemText}>{item.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {fieldState.error?.message && (
                <Text
                  style={{
                    color: theme.colors.error,
                    paddingHorizontal: theme.spacing.LG,
                  }}>
                  {fieldState.error.message}
                </Text>
              )}
            </View>
          );
        }}
      />

      <Text style={styles.placeholderTitle}>{t('location')}</Text>
      <Controller
        control={control}
        name="location"
        render={({ field: { value, onChange }, fieldState }) => {
          return (
            <>
              <View
                style={[{ paddingHorizontal: theme.spacing.LG }, styles.input]}>
                <TouchableOpacity
                  onPress={() => locationRef.current?.present()}
                  style={styles.chooseCountryWrapper}
                  activeOpacity={0.7}>
                  <Text style={styles.chooseCountryText}>
                    {value ? value.location : t('location_choose')}
                  </Text>
                  <Image
                    style={{ width: 24, height: 24 }}
                    tintColor={theme.colors.secondary500}
                    source={images.icon.locationPin}
                  />
                </TouchableOpacity>

                {fieldState.error?.message && (
                  <Text style={{ color: theme.colors.error }}>
                    {fieldState.error?.message}
                  </Text>
                )}
              </View>
              <LocationSelector
                ref={locationRef}
                onChange={data => {
                  onChange(data);
                  locationRef.current?.dismiss();
                }}
                onClose={() => locationRef.current?.dismiss()}
              />
            </>
          );
        }}
      />

      <Text style={styles.placeholderTitle}>{`${t('role')}, ${t('few')}`}</Text>

      <Controller
        control={control}
        name="userRole"
        render={({ field: { value, onChange }, fieldState }) => {
          const currRole = value ?? [];
          return (
            <View style={styles.input}>
              <ScrollView
                style={{ paddingHorizontal: theme.spacing.LG }}
                showsHorizontalScrollIndicator={false}
                horizontal>
                {roles.map(item => {
                  const active = currRole.includes(item.title);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        const newValue = active
                          ? currRole.filter(el => el !== item.title)
                          : [...currRole, item.title];
                        onChange(newValue);
                      }}
                      style={[
                        styles.choiseItem,
                        active && styles.choiseItemActive,
                      ]}>
                      <Text style={styles.choiseItemText}>{item.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {fieldState.error?.message && (
                <Text
                  style={{
                    paddingHorizontal: theme.spacing.LG,
                    color: theme.colors.error,
                  }}>
                  {fieldState.error.message}
                </Text>
              )}
            </View>
          );
        }}
      />
    </ScrollView>
  );
};

const styleSheet = createStyleSheet(theme => ({
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.LG,
    marginBottom: theme.spacing.XS,
  },
  choiseItem: {
    borderWidth: 1,
    borderRadius: 100,
    borderColor: theme.colors.darkGray,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 6,
  },
  chooseCountryWrapper: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: theme.colors.grayTransparent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  chooseCountryText: {
    paddingVertical: 18,
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: 0.2,
    color: theme.colors.textPrimary,
  },
  choiseItemActive: {
    borderColor: theme.colors.orange,
  },

  choiseItemText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  input: {
    marginBottom: 28,
  },
}));
