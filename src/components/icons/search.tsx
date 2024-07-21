import * as React from "react"
import Svg, { Circle, Path, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Circle
      cx={9.805}
      cy={9.806}
      r={7.49}
      stroke="#BDBDBD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      stroke="#BDBDBD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m15.016 15.404 2.936 2.93"
    />
  </Svg>
)
export const SearchIcon = memo(SvgComponent)