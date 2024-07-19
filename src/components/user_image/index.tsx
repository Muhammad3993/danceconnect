import { images } from 'common/resources/images';
import React from 'react';
import { Image, ImageProps } from 'react-native';
import FastImage from 'react-native-fast-image';

interface Props extends ImageProps {
  userImage?: string;
}

export function UserImage(props: Props) {
  if (props.userImage) {
    return (
      // @ts-ignore
      <FastImage
        {...props}
        source={{ uri: props.userImage }}
        defaultSource={images.defaultUser}
      />
    );
  }

  return <Image {...props} source={images.defaultUser} />;
}
