import * as React from 'react';
import Svg, { SvgProps, Rect, Path } from 'react-native-svg';
import { memo } from 'react';

const SvgComponent = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Rect width={24} height={24} fill="#fff" rx={4} />
    <Path
      fill="#292B32"
      d="M13.688 12.25A1.71 1.71 0 0 0 12 10.562c-.95 0-1.688.774-1.688 1.688 0 .95.739 1.688 1.688 1.688.914 0 1.688-.739 1.688-1.688Zm4.218-1.688c-.949 0-1.687.774-1.687 1.688 0 .95.738 1.688 1.687 1.688.914 0 1.688-.739 1.688-1.688 0-.914-.774-1.688-1.688-1.688Zm-11.812 0c-.95 0-1.688.774-1.688 1.688 0 .95.739 1.688 1.688 1.688.914 0 1.687-.739 1.687-1.688 0-.914-.773-1.688-1.687-1.688Z"
    />
  </Svg>
);
export const MenuIcon = memo(SvgComponent);
