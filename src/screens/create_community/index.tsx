import { theming } from 'common/constants/theming';
import DanceStylesSelector from 'components/dance_styles_selector';
import { CommunitiesIcon } from 'components/icons/communities';
import LocationSelector from 'components/location_selector';
import { DCButton } from 'components/shared/button';
import { DCInput } from 'components/shared/input';
import { t } from 'i18next';
import React, { useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ImageUploadList from 'components/image_upload_list';
import { useCreateCommunity, useUpdateCommunity } from 'data/hooks/community';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from 'screens/interfaces';
import { LocationIcon } from 'components/icons/location';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { showErrorToast } from 'common/libs/toast';

export function CreateCommunity({
  navigation,
  route,
}: StackScreenProps<'createCommunity'>) {
  const locationRef = useRef<BottomSheetModal>(null);
  const initialData = route.params.community;
  const methods = useForm({
    defaultValues: initialData ?? {
      title: '',
      description: '',
      images: [],
      categories: [],
      location: undefined,
      type: '',
      channelId: '',
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const { mutateAsync: createCommunity, isPending: isCreateing } =
    useCreateCommunity();
  const { mutateAsync: editCommunity, isPending: isEditing } =
    useUpdateCommunity();

  const handleCreateCommunity = async data => {
    try {
      if (initialData) {
        await editCommunity(data);
      } else {
        await createCommunity(data);
      }
      navigation.pop();
    } catch (err) {
      const error = err as Error;
      showErrorToast(error.message);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FormProvider {...methods}>
          <View style={styles.container}>
            <View style={styles.box}>
              <View style={styles.boxCircleOpacity}>
                <View style={styles.boxCircle}>
                  <CommunitiesIcon active fill={'white'} />
                </View>
              </View>
              <Text style={styles.boxTitle}>
                {t('create_community_card_title')}
              </Text>
              <Text style={styles.boxSubtitle}>{t('ds_desc_event')}</Text>
            </View>
          </View>

          <View style={styles.inputName}>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field: { value, onChange }, fieldState }) => (
                <>
                  <View style={styles.inputNameTop}>
                    <Text style={styles.inputNameTopTitle}>
                      {t('create_name')}
                    </Text>
                    <Text style={styles.inputNameTopLimit}>
                      {value.length}/100
                    </Text>
                  </View>
                  <DCInput
                    placeholder={t('name')}
                    inputStyle={styles.inputNameStyle}
                    value={value}
                    onChangeText={onChange}
                    errorText={fieldState.error?.message}
                  />
                </>
              )}
            />
          </View>

          <View>
            <View style={[styles.container, { marginBottom: 15 }]}>
              <Text style={styles.inputNameTopTitle}>
                {t('choose_category_title')}{' '}
                <Text style={styles.bodyTitle}>{t('few')}</Text>
              </Text>
              <Text style={styles.bodySubtitle}>{t('ds_desc_event')}</Text>
            </View>
            <Controller
              name="categories"
              control={control}
              render={({ field: { value, onChange } }) => (
                <DanceStylesSelector
                  scrollEnabled={false}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.categories?.message}
                />
              )}
            />
          </View>

          <View style={styles.inputName}>
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field: { value, onChange }, fieldState }) => (
                <>
                  <View style={styles.inputNameTop}>
                    <Text style={styles.inputNameTopTitle}>
                      {t('description_title')}
                    </Text>
                    <Text style={styles.inputNameTopLimit}>
                      {value.length}/350
                    </Text>
                  </View>
                  <Text style={styles.describe}>{t('description_desc')}</Text>
                  <DCInput
                    placeholder={t('description')}
                    inputStyle={styles.inputNameStyle}
                    onChangeText={onChange}
                    value={value}
                    errorText={fieldState.error?.message}
                  />
                </>
              )}
            />
          </View>

          <View style={styles.uploadBox}>
            <Text style={styles.inputNameTopTitle}>
              {false ? t('upload_img_title') : 'Add Cover Image'}
              <Text style={styles.bodyTitle}>{t('optional')}</Text>
            </Text>
            <Text style={styles.bodySubtitle}>{t('upload_img_desc')}</Text>

            <Controller
              name="images"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field: { value, onChange } }) => (
                <ImageUploadList
                  containerStyle={{ marginTop: theming.spacing.LG }}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </View>

          <View style={[styles.container, { marginBottom: 15 }]}>
            <Controller
              name="location"
              control={control}
              render={({ field: { value, onChange }, fieldState }) => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => locationRef.current?.present()}
                      style={styles.chooseCountryWrapper}>
                      <Text style={styles.chooseCountryText}>
                        {value ? value.location : t('location_choose')}
                      </Text>
                      <LocationIcon />
                    </TouchableOpacity>
                    {fieldState.error?.location?.message && (
                      <Text style={{ color: theming.colors.redError }}>
                        {fieldState.error?.location?.message}
                      </Text>
                    )}
                    <LocationSelector
                      ref={locationRef}
                      onChange={data => {
                        onChange(data);
                        locationRef.current?.dismiss();
                      }}
                    />
                  </>
                );
              }}
            />
          </View>
        </FormProvider>
      </ScrollView>

      <View style={styles.bottom}>
        <DCButton
          children={t('clear')}
          containerStyle={{ flex: 1, borderRadius: 100 }}
          variant="outlined"
          textStyle={styles.bottomTitle}
          onPress={() => reset()}
        />
        <DCButton
          children={t('create_community')}
          containerStyle={{ flex: 1 }}
          onPress={handleSubmit(handleCreateCommunity)}
          isLoading={isCreateing || isEditing}
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
  top: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theming.spacing.LG,
  },

  container: {
    paddingHorizontal: theming.spacing.LG,
  },
  box: {
    backgroundColor: theming.colors.transparentPurple,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  uploadBox: {
    paddingHorizontal: theming.spacing.LG,
    marginBottom: theming.spacing.LG,
  },
  boxCircleOpacity: {
    width: 66,
    height: 66,
    backgroundColor: theming.colors.lightPurple1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxCircle: {
    width: 46,
    height: 46,
    backgroundColor: theming.colors.purple,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theming.colors.black,
    fontFamily: theming.fonts.latoRegular,
    marginTop: 5,
  },
  chooseCountryWrapper: {
    backgroundColor: theming.colors.lightGray,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: theming.colors.grayTransparent,
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
    color: theming.colors.textPrimary,
  },
  boxSubtitle: {
    width: '90%',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.textPrimary,
    marginBottom: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  inputName: {
    marginVertical: theming.spacing.LG,
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
  describe: {
    fontSize: 16,
    fontWeight: '400',
    color: theming.colors.gray700,
    fontFamily: theming.fonts.latoRegular,
    marginBottom: 15,
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: theming.colors.gray75,
    paddingHorizontal: theming.spacing.LG,
    paddingVertical: theming.spacing.MD,
    gap: theming.spacing.MD,
  },
  // bottomBtn: {
  //   width: '49%',
  //   backgroundColor: theming.colors.white,
  //   borderWidth: 1,
  //   borderColor: theming.colors.purple,
  // },
  // bottomBtn1: {
  //   width: '49%',
  // },
  bottomTitle: {
    color: theming.colors.purple,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theming.fonts.latoRegular,
  },
  city: {
    marginVertical: 30,
  },
});
