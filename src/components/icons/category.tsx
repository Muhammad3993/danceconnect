import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M24.5 7.786a4.287 4.287 0 1 1-8.573-.001 4.287 4.287 0 0 1 8.574.001ZM12.071 7.786a4.286 4.286 0 1 1-8.572 0 4.286 4.286 0 0 1 8.572 0ZM24.5 20.139a4.286 4.286 0 1 1-8.57-.002 4.286 4.286 0 0 1 8.57.002ZM12.071 20.139a4.285 4.285 0 1 1-8.57 0 4.285 4.285 0 0 1 8.57 0Z"
      clipRule="evenodd"
    />
  </Svg>
)
export const CategoryIcon = memo(SvgComponent)