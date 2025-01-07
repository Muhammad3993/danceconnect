import React from 'react';
import { useTranslation } from 'react-i18next';

import DanceStylesSelector from 'components/dance_styles_selector';
import { Header } from './Header';
import { User } from 'data/api/user/inerfaces';
import { Controller, useFormContext } from 'react-hook-form';
import { ScrollView } from 'react-native';

export const DanceStyles = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<Partial<User>>();

  return (
    <ScrollView style={{ flex: 1 }}>
      <Header title={t('select_dc')} />
      <Controller
        control={control}
        name="individualStyles"
        render={({ field: { value, onChange }, fieldState }) => {
          return (
            <DanceStylesSelector
              errorMessage={fieldState.error?.message}
              value={value ?? []}
              onChange={onChange}
            />
          );
        }}
      />
    </ScrollView>
  );
};
