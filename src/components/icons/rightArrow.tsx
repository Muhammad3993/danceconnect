import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke || "#5C33D7"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6 3.833 10.667 8.5 6 13.167"
    />
  </Svg>
)
export const RightArrowIcon = memo(SvgComponent)