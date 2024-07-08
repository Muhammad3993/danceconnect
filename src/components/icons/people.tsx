import * as React from 'react';
import Svg, { SvgProps, Mask, Path } from 'react-native-svg';
import { memo } from 'react';

const SvgComponent = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Mask id="a" fill="#fff">
      <Path d="M11.874 10.889a3.944 3.944 0 1 1 0-7.889 3.944 3.944 0 0 1 0 7.889Z" />
    </Mask>
    <Path
      fill="#9E9E9E"
      d="M11.874 9.389A2.444 2.444 0 0 1 9.43 6.944h-3a5.444 5.444 0 0 0 5.444 5.445v-3ZM9.43 6.944A2.444 2.444 0 0 1 11.874 4.5v-3A5.444 5.444 0 0 0 6.43 6.944h3ZM11.874 4.5a2.444 2.444 0 0 1 2.445 2.444h3A5.444 5.444 0 0 0 11.874 1.5v3Zm2.445 2.444a2.444 2.444 0 0 1-2.445 2.445v3a5.444 5.444 0 0 0 5.445-5.445h-3Z"
      mask="url(#a)"
    />
    <Path
      stroke="#9E9E9E"
      strokeWidth={1.5}
      d="M3.898 20.25h-.023a.844.844 0 0 1-.115-.126c.205-2.108 1.155-3.665 2.556-4.714 1.448-1.084 3.428-1.66 5.667-1.66 2.285 0 4.295.548 5.75 1.615 1.432 1.05 2.383 2.641 2.516 4.88v.005H3.898Z"
    />
  </Svg>
);
export const PeopleIcon = memo(SvgComponent);
