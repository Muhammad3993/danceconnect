import React from 'react';
import { useTranslation } from 'react-i18next';

import CategorySelector from 'components/category_selector';
import { Header } from './Header';
import { EditUserRequest } from 'data/api/user/inerfaces';
import { Controller, useFormContext } from 'react-hook-form';

export const DanceStyles = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<EditUserRequest>();

  return (
    <>
      <Header title={t('select_dc')} />
      <Controller
        control={control}
        name="individualStyles"
        render={({ field: { value, onChange }, fieldState }) => {
          return (
            <CategorySelector
              errorMessage={fieldState.error?.message}
              value={value ?? []}
              onChange={onChange}
            />
          );
        }}
      />
    </>
  );
};
