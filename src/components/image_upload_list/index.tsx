import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { useUploadImage } from 'data/hooks/common';
import { UploadIcon } from 'components/icons/upload';
import FastImage from 'react-native-fast-image';
import { TrashIcon } from 'components/icons/trash';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useTranslation } from 'react-i18next';
import { getImgePath } from 'data/api';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export interface Props {
  value?: string[];
  onChange: (val: string[]) => void;
  containerStyle?: ViewStyle;
}

export default function ImageUploadList({
  value = [],
  onChange,
  containerStyle,
}: Props) {
  const { mutate: uploadImage } = useUploadImage();
  const { t } = useTranslation();
  const { styles, theme } = useStyles(styleSheet);

  const handleImagePicker = async () => {
    try {
      const image = await ImageCropPicker.openPicker({ cropping: true });

      const formData = new FormData();
      formData.append('file', {
        name: image.filename,
        type: 'image/png',
        uri: image.path,
      });

      uploadImage(formData, {
        onSuccess(data) {
          onChange([...value, data.filename]);
        },
      });
    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };

  const deleteImage = (path: string) => {
    onChange(value.filter(el => el !== path));
  };

  if (value.length === 0) {
    return (
      <TouchableOpacity
        onPress={handleImagePicker}
        style={[styles.upload, containerStyle]}>
        <UploadIcon />
        <Text style={styles.uploadTitle}>{t('upload_img')}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView style={containerStyle} horizontal>
      {value.map(img => (
        <View style={styles.image} key={img}>
          <FastImage
            resizeMode="cover"
            source={{ uri: getImgePath(img) }}
            style={styles.img}
          />
          <TouchableOpacity
            onPress={() => deleteImage(img)}
            style={styles.imageTrash}>
            <TrashIcon stroke={theme.colors.white} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styleSheet = createStyleSheet(theming => ({
  upload: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theming.colors.secondary200,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: theming.fonts.latoRegular,
    color: theming.colors.secondary500,
  },
  uploadBox: {
    marginBottom: 30,
    paddingHorizontal: theming.spacing.LG,
  },
  image: {
    width: 151,
    height: 167,
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  imageTrash: {
    width: 40,
    height: 40,
    backgroundColor: theming.colors.brown,
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
