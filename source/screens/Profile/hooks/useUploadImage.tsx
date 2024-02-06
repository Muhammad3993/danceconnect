import {useCallback, useState} from 'react';
import {Keyboard} from 'react-native';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

export function useUploadImage(onUploadImage: () => void) {
  const [image, setImage] = useState<Asset | null>(null);

  const uploadImage = useCallback(async () => {
    Keyboard.dismiss();
    let options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 1,
    };
    const images = await launchImageLibrary(options);

    if (images.assets) {
      setImage(images.assets[0]);
      onUploadImage();
    }
  }, [onUploadImage]);

  const uploadCameraImage = useCallback(async () => {
    Keyboard.dismiss();

    try {
      let options: CameraOptions = {
        mediaType: 'photo',
        quality: 1,
      };
      const images = await launchCamera(options);

      if (images.assets) {
        setImage(images.assets[0]);
        onUploadImage();
      }
    } catch (er) {
      console.log(er);
    }
  }, [onUploadImage]);

  return {uploadCameraImage, uploadImage, image};
}
