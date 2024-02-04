import React, {useState, useEffect, useCallback, memo} from 'react';

import {Image} from 'react-native';

interface Props {
  uri: string;
  originalWidth: number;
  originalHeight?: number;
}

const ScalableImage = memo(({uri, originalWidth, originalHeight}: Props) => {
  const [scalableWidth, setScalableWidth] = useState(originalWidth);
  const [scalableHeight, setScalableHeight] = useState(200);

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
    },
    [originalHeight, originalWidth],
  );

  useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => adjustSize(width, height),
      console.log,
    );
  }, [adjustSize, uri]);

  return (
    <Image
      source={{uri}}
      style={{
        width: scalableWidth,
        height: scalableHeight,
      }}
    />
  );
});

export default ScalableImage;
