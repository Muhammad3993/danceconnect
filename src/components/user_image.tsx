import React from 'react';
import { AppImage } from './shared/app_image';
import { ImageStyle } from 'react-native';
import { images } from 'common/resources/images';

interface Props {
  imageUrl?: string;
  gender?: string;
  size: number;
  style?: ImageStyle;
}

export function UserImage({ imageUrl, gender, size, style }: Props) {
  return (
    <AppImage
      defaultSource={
        // gender == 'female' ? images.womanDefAvatar : images.manDefAvatar
        images.defaultUser
      }
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      source={{ uri: imageUrl }}
    />
  );
}
