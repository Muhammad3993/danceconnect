import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { memo } from 'react';

const SvgComponent = (props: SvgProps) => (
  <Svg width={25} height={24} fill="none" {...props}>
    <Path
      stroke="#9E9E9E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.719 19.438A4.001 4.001 0 0 1 9.402 17h6a4.001 4.001 0 0 1 3.684 2.438M16.402 9.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm6 2.5c0 5.523-4.477 10-10 10-5.522 0-10-4.477-10-10s4.478-10 10-10c5.523 0 10 4.477 10 10Z"
    />
  </Svg>
);
export const ProfileIcon = memo(SvgComponent);
