import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke || "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 1.655v14.652M16.333 8.981H1.666"
    />
  </Svg>
)
export const PlusBigIcon = memo(SvgComponent)
