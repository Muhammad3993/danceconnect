import React, {
  useState,
  useCallback,
  memo,
  PropsWithChildren,
  ReactNode,
} from 'react';

import {
  ImageStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from 'react-native-unistyles';
import { AppImage } from '../app_image';
import TurboImage from 'react-native-turbo-image';
import { images } from '@common/resources/images';

interface Props {
  source: { uri?: string };
  originalWidth?: number;
  originalHeight?: number;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  resizeMode?: 'contain' | 'center' | 'stretch' | 'cover' | undefined;
  onPress?: () => void;
  thumbhash?: string;
}

export const ScalableImage = memo(
  ({
    source,
    originalWidth,
    originalHeight,
    style = {},
    containerStyle,
    children,
    onPress,
    thumbhash,
  }: PropsWithChildren<Props>) => {
    const { styles, theme } = useStyles(stylesheet);
    const [scalableWidth, setScalableWidth] = useState(originalWidth ?? 0);
    const [scalableHeight, setScalableHeight] = useState(
      originalHeight ?? UnistylesRuntime.screen.height * 0.25,
    );
    const [sizing, setSizing] = useState(true);

    const adjustSize = useCallback(
      (sourceWidth: number, sourceHeight: number) => {
        if (style.width || style.height) {
          setSizing(false);
        }

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
      [originalHeight, originalWidth, style.height, style.width],
    );

    return (
      <OptionalLink onPress={onPress}>
        <View style={[styles.mediaContainer, containerStyle]}>
          <AppImage
            onSuccess={({ nativeEvent: { height, width } }) => {
              adjustSize(width, height);
            }}
            onError={() => setSizing(false)}
            resize={originalWidth}
            defaultSource={images.defaultImage}
            source={source}
            style={[styles.image(scalableWidth, scalableHeight), style]}
            indicator={{
              color: theme.colors.transparentPurple,
              style: 'medium',
            }}
          />
          {!sizing && children}
          {thumbhash && (
            <TurboImage
              style={styles.thumbhash}
              resizeMode="cover"
              showPlaceholderOnFailure
              placeholder={{ thumbhash }}
            />
          )}
        </View>
      </OptionalLink>
    );
  },
);

const stylesheet = createStyleSheet(theming => ({
  mediaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theming.colors.transparentPurple,
  },
  image: (width, height) => ({
    width,
    height,
    overflow: 'hidden',
  }),
  thumbhash: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: -1,
    width: '100%',
    height: '100%',
  },
}));

const OptionalLink = ({
  onPress,
  children,
}: {
  onPress?: () => void;
  children: ReactNode;
}) => {
  if (onPress) {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        {children}
      </TouchableWithoutFeedback>
    );
  }

  return children;
};
