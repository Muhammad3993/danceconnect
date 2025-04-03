import DanceStylesSelector from '@components/dance_styles_selector';
import { LocationSelector } from '@components/location_selector';
import { DCButton } from '@components/shared/button';
import { DCInput } from '@components/shared/input';
import React, { useRef } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import ImageUploadList from '@components/image_upload_list';
import { useCreateCommunity, useUpdateCommunity } from '@data/hooks/community';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@screens/interfaces';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { showErrorToast } from '@common/libs/toast';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { images } from '@common/resources/images';
import { useDCStore } from '@store';
import { yupResolver } from '@hookform/resolvers/yup';
import { CommunitySchema, communitySchema } from '@data/api/community/schema';
import { CreateBanner } from './ui/create_banner';
import { useTranslation } from 'react-i18next';

export function CreateCommunity({
  navigation,
  route,
}: StackScreenProps<'createCommunity'>) {
  const { styles, theme } = useStyles(styleSheet);
  const { t } = useTranslation();

  const user = useDCStore.use.user();
  const locationRef = useRef<BottomSheetModal>(null);
  const initialData = route.params.community;
  const methods = useForm({
    resolver: yupResolver(communitySchema),
    defaultValues: initialData ?? {
      title: '',
      description: '',
      images: [],
      categories: user?.individualStyles ?? [],
      location: user?.location?.location,
    },
  });

  const { control, handleSubmit, reset } = methods;

  const { mutateAsync: createCommunity, isPending: isCreateing } =
    useCreateCommunity();
  const { mutateAsync: editCommunity, isPending: isEditing } =
    useUpdateCommunity();

  const handleCreateCommunity = async (data: CommunitySchema) => {
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
          {!initialData && <CreateBanner />}

          <View style={styles.inputName}>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field: { value, onChange }, fieldState }) => (
                <>
                  <View style={styles.lableWrapper}>
                    <Text style={styles.label}>{t('create_name')}</Text>
                    <Text style={styles.labelInfo}>{value.length}/100</Text>
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
              <Text style={styles.label}>
                {t('choose_category_title')}{' '}
                <Text style={styles.labelInfo}>{t('few')}</Text>
              </Text>
              <Text style={styles.subLabel}>{t('ds_desc_event')}</Text>
            </View>
            <Controller
              name="categories"
              control={control}
              render={({ field: { value, onChange }, fieldState }) => (
                <DanceStylesSelector
                  scrollEnabled={false}
                  value={value}
                  onChange={onChange}
                  errorMessage={fieldState?.error?.message}
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
                  <View style={styles.lableWrapper}>
                    <Text style={styles.label}>{t('description_title')}</Text>
                    <Text style={styles.labelInfo}>
                      {value?.length ?? 0}/350
                    </Text>
                  </View>
                  <Text style={styles.subLabel}>{t('description_desc')}</Text>
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
            <View
              style={{
                paddingHorizontal: theme.spacing.LG,
                marginBottom: theme.spacing.LG,
              }}>
              <Text style={styles.label}>
                {t('upload_img_title')}
                <Text style={styles.labelInfo}> {t('optional')}</Text>
              </Text>
              <Text style={styles.subLabel}>{t('upload_img_desc')}</Text>
            </View>

            <Controller
              name="images"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field: { value, onChange } }) => (
                <ImageUploadList
                  containerStyle={{ paddingHorizontal: theme.spacing.LG }}
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
                        {value ? value : t('location_choose')}
                      </Text>
                      <Image
                        style={{ width: 16, height: 16 }}
                        tintColor={theme.colors.secondary500}
                        source={images.icon.locationPin}
                      />
                    </TouchableOpacity>
                    {fieldState.error?.message && (
                      <Text style={{ color: theme.colors.error }}>
                        {fieldState.error?.message}
                      </Text>
                    )}
                    <LocationSelector
                      ref={locationRef}
                      onChange={data => {
                        onChange(data.location);
                        locationRef.current?.dismiss();
                      }}
                      onClose={() => {
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

const styleSheet = createStyleSheet(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },

  container: {
    paddingHorizontal: theme.spacing.LG,
  },
  lableWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.XS,
  },

  label: {
    color: theme.colors.black,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: theme.fonts.latoRegular,
  },
  subLabel: {
    color: theme.colors.darkGray,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: theme.fonts.latoRegular,
    marginBottom: theme.spacing.SM,
  },

  labelInfo: {
    fontWeight: '400',
    fontSize: 16,
    color: theme.colors.darkGray,
    fontFamily: theme.fonts.latoRegular,
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

  inputName: {
    marginVertical: theme.spacing.LG,
    paddingHorizontal: theme.spacing.LG,
  },

  inputNameStyle: {
    paddingHorizontal: 16,
    height: 56,
    borderColor: theme.colors.gray50,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: theme.colors.gray75,
    paddingHorizontal: theme.spacing.LG,
    paddingVertical: theme.spacing.MD,
    gap: theme.spacing.MD,
  },
  uploadBox: {
    marginBottom: theme.spacing.LG,
  },
}));
