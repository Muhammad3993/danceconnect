import { BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import ImagePicker, { Image } from 'react-native-image-crop-picker';
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from 'react-native-unistyles';
import { DCButton } from './shared/button';
import { DCBottomSheet } from './shared/bottom_sheet';

interface Props {
  onChange: (data: Image) => void;
  cropping?: boolean;
}

export const ImageUploadBottomSheet = forwardRef<
  BottomSheetModalMethods,
  Props
>(({ onChange, cropping = false }, sheetRef) => {
  const { t } = useTranslation();

  const { styles } = useStyles(stylesheet);

  const handleImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping,
        mediaType: 'photo',
        selectionLimit: 1,
      });

      onChange(image);
    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };

  const handleCameraPicker = async () => {
    try {
      const image = await ImagePicker.openCamera({
        cropping,
        mediaType: 'photo',
        selectionLimit: 1,
      });

      onChange(image);
    } catch (error) {
      console.error('Error picking image from camera:', error);
    }
  };

  return (
    <DCBottomSheet ref={sheetRef}>
      <BottomSheetView style={styles.bottomSheetContainer}>
        <DCButton onPress={handleCameraPicker} containerStyle={{ flex: 1 }}>
          {t('camera')}
        </DCButton>
        <DCButton onPress={handleImagePicker} containerStyle={{ flex: 1 }}>
          {t('gallery')}
        </DCButton>
      </BottomSheetView>
    </DCBottomSheet>
  );
});

const stylesheet = createStyleSheet(theming => ({
  bottomSheetContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: theming.spacing.LG,
    gap: theming.spacing.MD,
    paddingBottom: UnistylesRuntime.insets.bottom + 10,
  },
}));
