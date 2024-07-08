import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BasicInfo } from './ui/BasicInfo';
import { DanceStyles } from './ui/DanceStyles';
import { theming } from 'common/constants/theming';
import { StackScreenProps } from 'screens/interfaces';
import PagerView from 'react-native-pager-view';
import { DCButton } from 'components/shared/button';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDCStore } from 'store';
import { userEditSchema } from './schema';
import { EditUserRequest } from 'data/api/user/inerfaces';
import { isEmptyObj } from 'common/utils/object';
import { PagerViewInternal } from 'react-native-pager-view/lib/typescript/PagerView';
import { useEditUser } from 'data/hooks/user';
import { showErrorToast } from 'common/libs/toast';
import { SafeAreaView } from 'react-native-safe-area-context';

export function EditUserScreen({}: StackScreenProps<'editUser'>) {
  const { t } = useTranslation();
  const user = useDCStore.use.user();
  const updateUser = useDCStore.use.setUser();
  const [currPage, setCurrPage] = useState(0);
  const refPagerView = useRef<PagerViewInternal>(null);
  const { mutateAsync, isLoading } = useEditUser();
  const methods = useForm<EditUserRequest>({
    defaultValues: user ?? {},
    resolver: yupResolver(userEditSchema),
  });

  const { isValid, dirtyFields, errors } = methods.formState;
  console.log(errors);

  const goNext = async () => {
    if (currPage === 0) {
      const validInfo = await methods.trigger([
        'location',
        'userGender',
        'userName',
        'userRole',
      ]);

      if (validInfo) {
        refPagerView.current?.setPage(1);
        setCurrPage(1);
      }
    } else {
      methods.handleSubmit(data => {
        mutateAsync(data, {
          onSuccess(newUser) {
            updateUser(newUser);
          },
          onError(err) {
            const error = err as Error;
            showErrorToast(error.message);
          },
        });
      })();
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <FormProvider {...methods}>
        <PagerView
          scrollEnabled={false}
          ref={refPagerView}
          style={styles.root}
          initialPage={0}
          useNext={false}>
          <BasicInfo key={'1'} />
          <DanceStyles key={'2'} />
        </PagerView>

        <View style={{ paddingHorizontal: theming.spacing.LG }}>
          <DCButton
            isLoading={isLoading}
            disabled={currPage === 0 ? isEmptyObj(dirtyFields) : !isValid}
            title={t('next')}
            onPress={goNext}
          />
        </View>
      </FormProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theming.colors.white,
  },
});
