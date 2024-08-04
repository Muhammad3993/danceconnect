import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { memo } from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg width={props.width || 28} height={props.height || 28} viewBox="0 0 28 28" fill="none" {...props}>
    <Path
      stroke={props.stroke || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.04 23.85h8.46"
    />
    <Path
      stroke={props.stroke || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.91 4.427a2.62 2.62 0 0 1 3.636-.353c.06.048 2.022 1.571 2.022 1.571a2.5 2.5 0 0 1 .84 3.481C21.368 9.19 10.28 23.06 10.28 23.06c-.37.46-.93.731-1.528.738l-4.246.053-.956-4.049a1.9 1.9 0 0 1 .369-1.627L14.91 4.427Z"
      clipRule="evenodd"
    />
    <Path
      stroke={props.stroke || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12.86 7.001 6.36 4.885"
    />
  </Svg>
);
export const EditIconSvg = memo(SvgComponent);
