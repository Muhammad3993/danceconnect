import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';
import { memo } from 'react';

const SvgComponent = (props: SvgProps & { focused?: boolean }) =>
  props.focused ? (
    <Svg width={25} height={24} fill="none" {...props}>
      <Path
        fill="#F5A80C"
        fillRule="evenodd"
        d="M2.95 12a9.25 9.25 0 1 1 16.1 6.217 4.743 4.743 0 0 0-3.85-1.967h-6a4.743 4.743 0 0 0-3.85 1.967A9.216 9.216 0 0 1 2.95 12Zm20 0a10.723 10.723 0 0 1-3.578 8.008A10.71 10.71 0 0 1 12.2 22.75 10.71 10.71 0 0 1 5 19.984 10.723 10.723 0 0 1 1.45 12c0-5.937 4.813-10.75 10.75-10.75S22.95 6.063 22.95 12Zm-14-2.5a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0Zm3.25-4.75a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5Z"
        clipRule="evenodd"
      />
      <Circle cx={12.2} cy={10} r={4} fill="#F5A80C" />
    </Svg>
  ) : (
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
