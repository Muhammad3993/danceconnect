import { useCallback } from 'react';

import { showErrorToast } from 'common/libs/toast';
import ImageCropPicker, { Image } from 'react-native-image-crop-picker';

export interface ImageData {
  path: string;
  filename?: string;
  mime?: string;
}

export function usePickImage(onPickImage: (data: ImageData) => void) {
  const selectVideo = useCallback(
    async (type: 'gallery' | 'camera') => {
      try {
        let image: Image;
        if (type == 'camera') {
          image = await ImageCropPicker.openCamera({
            mediaType: 'photo',
            selectionLimit: 1,
            compressImageQuality: 1,
          });
        } else {
          image = await ImageCropPicker.openPicker({
            mediaType: 'photo',
            selectionLimit: 1,
            compressImageQuality: 1,
          });
        }
        onPickImage(image);
      } catch (err) {
        const error = err as Error;
        showErrorToast(error.message);
      }
    },
    [onPickImage],
  );

  return selectVideo;
}
