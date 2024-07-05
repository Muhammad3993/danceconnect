import React from 'react';
import { genders, roles } from 'common/constants';
import { DCInput } from 'components/shared/input';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LocationSelector } from 'components/location_selector';
import { Controller, useFormContext } from 'react-hook-form';
import { EditUserRequest } from 'data/api/user/inerfaces';
import { theming } from 'common/constants/theming';
import { Header } from './Header';

export const BasicInfo = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<EditUserRequest>();

  return (
    <>
      <Header title={t('yourself')} description={t('yourself_desc')} />

      <Text style={styles.placeholderTitle}>{t('name')}</Text>

      <Controller
        control={control}
        name="userName"
        render={({ field: { value, onChange }, fieldState }) => {
          return (
            <DCInput
              containerStyle={[
                { paddingHorizontal: theming.spacing.LG },
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
                style={{ paddingHorizontal: theming.spacing.LG }}
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
                    color: theming.colors.redError,
                    paddingHorizontal: theming.spacing.LG,
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
            <View
              style={[{ paddingHorizontal: theming.spacing.LG }, styles.input]}>
              <LocationSelector
                value={value?.location ?? ''}
                onChange={onChange}
              />
              {fieldState.error?.location?.message && (
                <Text style={{ color: theming.colors.redError }}>
                  {fieldState.error?.location?.message}
                </Text>
              )}
            </View>
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
                style={{ paddingHorizontal: theming.spacing.LG }}
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
                    paddingHorizontal: theming.spacing.LG,
                    color: theming.colors.redError,
                  }}>
                  {fieldState.error.message}
                </Text>
              )}
            </View>
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theming.colors.textPrimary,
    paddingHorizontal: theming.spacing.LG,
    marginBottom: theming.spacing.SM,
  },
  choiseItem: {
    borderWidth: 1,
    borderRadius: 100,
    borderColor: theming.colors.darkGray,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 6,
  },
  choiseItemActive: {
    borderColor: theming.colors.orange,
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
});
