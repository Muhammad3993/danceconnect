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
      d="M2.919 14c-.004 1.435-.068 3.392.82 4.123.828.682 1.41.506 2.922.617 1.512.112 4.704 4.558 7.165 3.152 1.27-.998 1.364-3.091 1.364-7.892 0-4.8-.094-6.893-1.364-7.892-2.46-1.407-5.653 3.04-7.165 3.152-1.512.111-2.094-.065-2.922.617-.888.732-.824 2.689-.82 4.123Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M22.848 6.888a12.432 12.432 0 0 1 0 14.224M19.928 9.7a8.631 8.631 0 0 1 0 8.6"
    />
  </Svg>
);
export const SoundIcon = memo(SvgComponent);
