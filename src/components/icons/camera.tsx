import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { memo } from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      stroke="#292B32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="M19.5 19.5h-15A1.5 1.5 0 0 1 3 18V7.5A1.5 1.5 0 0 1 4.5 6h3L9 3.75h6L16.5 6h3A1.5 1.5 0 0 1 21 7.5V18a1.5 1.5 0 0 1-1.5 1.5Z"
    />
    <Path
      stroke="#292B32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="M12 15.75A3.375 3.375 0 1 0 12 9a3.375 3.375 0 0 0 0 6.75Z"
    />
  </Svg>
);
export const CameraIcon = memo(SvgComponent);
