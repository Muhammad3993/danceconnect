import * as React from 'react';
import Svg, { SvgProps, Path, Mask, G } from 'react-native-svg';
import { memo } from 'react';

const SvgComponent = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fill="#9E9E9E"
      fillRule="evenodd"
      d="M13.598 7.17a.75.75 0 0 1-.75-.75V4a.75.75 0 0 1 1.5 0v2.42a.75.75 0 0 1-.75.75ZM13.598 20.284a.75.75 0 0 1-.75-.75v-2.023a.75.75 0 1 1 1.5 0v2.023a.75.75 0 0 1-.75.75ZM13.598 14.825a.75.75 0 0 1-.75-.75v-4.82a.75.75 0 0 1 1.5 0v4.82a.75.75 0 0 1-.75.75Z"
      clipRule="evenodd"
    />
    <Mask id="a" width={22} height={18} x={1} y={3} maskUnits="userSpaceOnUse">
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M1 3h21.5v17.5H1V3Z"
        clipRule="evenodd"
      />
    </Mask>
    <G mask="url(#a)">
      <Path
        fill="#9E9E9E"
        fillRule="evenodd"
        d="M2.5 14.554v1.939C2.5 17.875 3.643 19 5.048 19h13.404C19.857 19 21 17.875 21 16.493v-1.94a2.91 2.91 0 0 1-2.177-2.802c0-1.343.925-2.474 2.177-2.803l-.001-1.941c0-1.382-1.143-2.507-2.548-2.507H5.049c-1.405 0-2.548 1.125-2.548 2.507L2.5 9.025c1.267.31 2.177 1.397 2.177 2.726A2.91 2.91 0 0 1 2.5 14.554ZM18.452 20.5H5.048C2.816 20.5 1 18.702 1 16.493V13.9a.75.75 0 0 1 .75-.75c.787 0 1.427-.628 1.427-1.4 0-.75-.614-1.316-1.427-1.316a.749.749 0 0 1-.75-.75l.001-2.678C1.001 4.797 2.817 3 5.049 3h13.402c2.232 0 4.048 1.798 4.048 4.007L22.5 9.6a.749.749 0 0 1-.75.75c-.787 0-1.427.628-1.427 1.4 0 .772.64 1.4 1.427 1.4a.75.75 0 0 1 .75.75v2.592c0 2.209-1.816 4.007-4.048 4.007Z"
        clipRule="evenodd"
      />
    </G>
  </Svg>
);
export const TicketIcon = memo(SvgComponent);
