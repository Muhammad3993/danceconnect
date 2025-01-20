import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { BasicInfo } from './ui/BasicInfo';
import { DanceStyles } from './ui/DanceStyles';
import { StackScreenProps } from 'screens/interfaces';
import PagerView from 'react-native-pager-view';
import { DCButton } from 'components/shared/button';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDCStore } from 'store';
import { userEditSchema } from './schema';
import { isEmptyObj } from 'common/utils/object';
import { useEditUser } from 'data/hooks/user';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from 'data/api/user/inerfaces';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export function EditUserScreen({}: StackScreenProps<'editUser'>) {
  const { t } = useTranslation();
  const { styles } = useStyles(styleSheet);

  const user = useDCStore.use.user();
  const [currPage, setCurrPage] = useState(0);
  const refPagerView = useRef<PagerView>(null);
  const { mutateAsync, isPending } = useEditUser();
  const methods = useForm<Partial<User>>({
    defaultValues: {
      fullName: user?.fullName,
      individualStyles: user?.individualStyles,
      gender: user?.gender,
      location: user?.location,
      userRole: user?.userRole,
      about: null,
    },
    resolver: yupResolver(userEditSchema),
  });

  const { isValid, dirtyFields } = methods.formState;

  const goNext = async () => {
    if (currPage === 0) {
      const validInfo = await methods.trigger([
        'location',
        'gender',
        'fullName',
        'userRole',
      ]);

      if (validInfo) {
        refPagerView.current?.setPage(1);
        setCurrPage(1);
      }

      return;
    }
    methods.handleSubmit(d => mutateAsync(d))();
  };

  return (
    <SafeAreaView style={styles.root}>
      <FormProvider {...methods}>
        <PagerView
          scrollEnabled={false}
          ref={refPagerView}
          style={styles.root}
          initialPage={0}>
          <BasicInfo key={'1'} />

          <DanceStyles key={'2'} />
        </PagerView>
      </FormProvider>

      <View style={styles.btnFooter}>
        <DCButton
          size={'large'}
          isLoading={isPending}
          disabled={currPage === 0 ? isEmptyObj(dirtyFields) : !isValid}
          onPress={goNext}>
          {t('next')}
        </DCButton>
      </View>
    </SafeAreaView>
  );
}

const styleSheet = createStyleSheet(theming => ({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
  btnFooter: {
    paddingHorizontal: theming.spacing.LG,
    paddingVertical: theming.spacing.MD,
  },
}));
