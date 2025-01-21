import React from 'react';
import { Image, ImageProps } from 'react-native';
import TurboImage, { Source, TurboImageProps } from 'react-native-turbo-image';

export type Props = { source: { uri?: string } } & Omit<
  TurboImageProps,
  'source'
> &
  Omit<ImageProps, 'source'>;

export function AppImage(props: Props) {
  if (!props.source.uri && props.defaultSource) {
    return <Image {...props} source={props.defaultSource} />;
  }

  if (props.source.uri) {
    return <TurboImage {...props} source={props.source as Source} />;
  }

  return null;
}
