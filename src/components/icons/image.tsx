import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { memo } from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg width={25} height={24} fill="none" {...props}>
    <Path
      stroke="#292B32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="M21 4.5H4.5a.75.75 0 0 0-.75.75v13.5c0 .414.336.75.75.75H21a.75.75 0 0 0 .75-.75V5.25A.75.75 0 0 0 21 4.5Z"
    />
    <Path
      stroke="#292B32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="m3.75 15.75 4.72-4.72a.75.75 0 0 1 1.06 0l4.19 4.19a.748.748 0 0 0 1.06 0l1.94-1.94a.75.75 0 0 1 1.06 0l3.97 3.97"
    />
    <Path
      fill="#292B32"
      d="M15.375 10.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
    />
  </Svg>
);
export const ImageIcon = memo(SvgComponent);
