import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { showErrorToast } from 'common/libs/toast';
import { ImageUploadBottomSheet } from 'components/image_upload_bottosheet';
import { UserImage } from 'components/user_image';
import { ServerFile } from 'data/api/common/interfaces';
import { useUploadImage } from 'data/hooks/common';
import React, { useRef } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'react-native-image-crop-picker';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface Props {
  value?: string;
  gender?: string;
  onChange: (file: ServerFile) => void;
}

export function PhotoUplaod({ onChange, gender, value }: Props) {
  const { styles } = useStyles(stylesheet);
  const { mutate } = useUploadImage();
  const sheetRef = useRef<BottomSheetModal>(null);

  const uploadImage = async ({ path }: Image) => {
    const formData = new FormData();
    formData.append('file', {
      name: 'photo.jpg',
      type: 'image/jpeg',
      uri: path,
    });
    sheetRef.current?.dismiss();

    mutate(formData, {
      onSuccess(data) {
        onChange(data);
      },
      onError(err) {
        const error = err as Error;
        showErrorToast(error.message);
      },
    });
  };

  return (
    <>
      <View>
        <Pressable
          style={styles.pressable}
          onPress={() => sheetRef.current?.present()}>
          <UserImage key={value} imageUrl={value} gender={gender} size={100} />
        </Pressable>
      </View>
      <ImageUploadBottomSheet cropping onChange={uploadImage} ref={sheetRef} />
    </>
  );
}

const stylesheet = createStyleSheet(theming => ({
  pressable: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: theming.spacing.LG,
  },
}));
