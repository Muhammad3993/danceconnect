import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { memo } from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.955 11.045 9 19c-.207-.12-.402-.196-.577-.207-1.512-.108-2.1.066-2.927-.642-.893-.762-.827-2.797-.827-4.288s-.066-3.527.827-4.289c.827-.707 1.415-.522 2.927-.642 1.513-.12 4.713-4.734 7.183-3.276 1.002.816 1.274 2.34 1.35 5.388Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.955 16.237c-.043 3.352-.305 4.985-1.35 5.834-1.142.674-2.437.054-3.656-.828M4.668 23.333 9 19.001l7.956-7.956 6.377-6.378"
    />
  </Svg>
);
export const UnsoundIcon = memo(SvgComponent);
