import { theming } from 'common/constants/theming';
import React, { useState, useCallback, memo } from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

interface Props {
  uri: string;
  originalWidth: number;
  originalHeight?: number;
  style?: ImageStyle;
}

export const ScalableImage = memo(
  ({ uri, originalWidth, originalHeight, style = {} }: Props) => {
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

    // useEffect(() => {
    //   Image.getSize(
    //     uri,
    //     (width, height) => adjustSize(width, height),
    //     console.log,
    //   );
    // }, [adjustSize, uri]);

    // if (sizing) {
    //   return (
    //     <View
    //       style={[
    //         styles.mediaContainer,
    //         { width: scalableWidth, height: scalableHeight },
    //       ]}>
    //       <ActivityIndicator />
    //     </View>
    //   );
    // }

    return (
      <FastImage
        onLoad={({ nativeEvent: { height, width } }) => {
          adjustSize(width, height);
        }}
        resizeMode="contain"
        source={{ uri }}
        style={[{ width: scalableWidth, height: scalableHeight }, style]}
      />
    );
  },
);

const styles = StyleSheet.create({
  mediaContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theming.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
});
