import { images } from 'common/resources/images';
import React from 'react';
import { Image, ImageProps } from 'react-native';
import FastImage from 'react-native-fast-image';
interface Props extends ImageProps {
  userImage?: string;
}

export function UserImage(props: Props) {
  if (props.userImage) {
    // @ts-ignore
    return <FastImage {...props} source={{ uri: props.userImage }} />;
  }

  return <Image {...props} source={images.defaultUser} />;
}
