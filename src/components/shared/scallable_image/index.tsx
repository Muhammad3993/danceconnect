import { theming } from 'common/constants/theming';
import React, { useState, useCallback, memo } from 'react';

import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

interface Props {
  uri: string;
  originalWidth: number;
  originalHeight?: number;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
}

export const ScalableImage = memo(
  ({
    uri,
    originalWidth,
    originalHeight,
    style = {},
    containerStyle,
  }: Props) => {
    const [scalableWidth, setScalableWidth] = useState(originalWidth);
    const [scalableHeight, setScalableHeight] = useState(
      originalHeight ?? originalWidth,
    );
    const [sizing, setSizing] = useState(true);

    const adjustSize = useCallback(
      (sourceWidth: number, sourceHeight: number) => {
        let ratio = 1;
        if (originalWidth && originalHeight) {
          ratio = Math.min(
            originalWidth / sourceWidth,
            originalHeight / sourceHeight,
          );
        } else if (originalWidth) {
          ratio = originalWidth / sourceWidth;
        } else if (originalHeight) {
          ratio = originalHeight / sourceHeight;
        }

        const computedWidth = sourceWidth * ratio;
        const computedHeight = sourceHeight * ratio;

        setScalableWidth(computedWidth);
        setScalableHeight(computedHeight);
        setSizing(false);
      },
      [originalHeight, originalWidth],
    );

    return (
      <View style={[styles.mediaContainer, containerStyle]}>
        <FastImage
          onLoad={({ nativeEvent: { height, width } }) => {
            adjustSize(width, height);
          }}
          resizeMode="contain"
          source={{ uri }}
          style={[{ width: scalableWidth, height: scalableHeight }, style]}
        />
        {sizing && <ActivityIndicator style={styles.loader} />}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  mediaContainer: {
    backgroundColor: theming.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
  },
  loader: {
    position: 'absolute',
  },
});
