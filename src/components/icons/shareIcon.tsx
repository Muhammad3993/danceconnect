import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={props.width || 28}
    height={props.width || 28}
    viewBox="0 0 28 28"
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m24.5 12.457-8.4-6.624v3.613c-4 0-12.6 1.205-12.6 15.054.4-2.81 3.6-9.032 12.6-9.032v3.613l8.4-6.624Z"
    />
  </Svg>
)
export const ShareIcon = memo(SvgComponent)