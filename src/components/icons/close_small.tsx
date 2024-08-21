import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
import { memo } from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg width={13} height={12} fill="none" {...props}>
    <G fill="#F5A80C" fillRule="evenodd" clipPath="url(#a)" clipRule="evenodd">
      <Path d="M2.077 10.625a.45.45 0 0 1-.32-.77l8.847-8.846a.451.451 0 1 1 .638.638l-8.846 8.845a.448.448 0 0 1-.319.133Z" />
      <Path d="M10.685 10.375a.437.437 0 0 1-.31-.129l-8.621-8.62a.44.44 0 1 1 .622-.622l8.62 8.62a.44.44 0 0 1-.31.751Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.5 0h12v12H.5z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export const CloseSmallIcon = memo(SvgComponent);
