import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { memo } from 'react';
const SvgComponent = (props: SvgProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <Path
      fill="#F5A80C"
      fillRule="evenodd"
      d="M0 14.08V5.91C0 2.38 2.271 0 5.66 0h8.67C17.72 0 20 2.38 20 5.91v8.17c0 3.54-2.28 5.92-5.67 5.92H5.66C2.271 20 0 17.62 0 14.08Zm10.75-1.81V5.92c0-.42-.34-.75-.75-.75-.42 0-.75.33-.75.75v6.35L6.78 9.79a.767.767 0 0 0-.53-.22c-.19 0-.38.08-.53.22-.29.29-.29.77 0 1.06l3.75 3.77c.28.28.78.28 1.06 0l3.75-3.77c.29-.29.29-.77 0-1.06a.767.767 0 0 0-1.07 0l-2.46 2.48Z"
      clipRule="evenodd"
    />
  </Svg>
);
export const ArrowDownButtonIcon = memo(SvgComponent);
