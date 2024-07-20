import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={8}
    height={8}
    fill="none"
    {...props}
  >
    <Path fill="#5C33D7" d="M3 0h2v8H3z" />
    <Path fill="#5C33D7" d="M8 3v2H0V3z" />
  </Svg>
)
export const PlusIcon = memo(SvgComponent)