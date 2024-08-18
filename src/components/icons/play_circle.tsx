import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { memo } from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg width={25} height={24} fill="none" {...props}>
    <Path
      stroke="#292B32"
      strokeMiterlimit={10}
      strokeWidth={1.3}
      d="M12.5 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
    />
    <Path
      stroke="#292B32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="m16.5 12-6-4v8l6-4Z"
    />
  </Svg>
);
export const PlayCircle = memo(SvgComponent);
