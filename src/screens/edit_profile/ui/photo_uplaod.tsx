import { ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';
import { EditIcon } from 'components/icons/edit';
import { UserImage } from 'components/user_image';
import { theming } from 'common/constants/theming';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useUploadImage } from 'data/hooks/collections';
import ImageCropPicker from 'react-native-image-crop-picker';
import { showErrorToast } from 'common/libs/toast';
import { getImgePath } from 'data/api';

interface Props {
  value?: string;
  onChange: (val: string) => void;
}

export function PhotoUplaod({ value, onChange }: Props) {
  const { mutate, isPending } = useUploadImage();
  const uploadImage = async (path: string) => {
    const formData = new FormData();
    formData.append('file', {
      name: 'photo.jpg',
      type: 'image/jpeg',
      uri: path,
    });

    mutate(formData, {
      async onSuccess(data) {
        onChange(data.filename);
      },
      onError(err) {
        const error = err as Error;
        showErrorToast(error.message);
      },
    });
  };

  const handleImagePicker = async () => {
    try {
      const image = await ImageCropPicker.openPicker({ cropping: true });
      await uploadImage(image.path);
    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleImagePicker} style={styles.editAvatar}>
      {isPending ? (
        <ActivityIndicator />
      ) : (
        <UserImage userImage={getImgePath(value)} style={styles.editImage} />
      )}
      <EditIcon style={styles.editIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  editAvatar: {
    width: 140,
    height: 140,
    position: 'relative',
    marginVertical: theming.spacing.LG,
    alignItems: 'center',
  },
  editImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    borderRadius: 70,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
