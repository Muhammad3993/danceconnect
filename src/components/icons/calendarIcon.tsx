import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke || "#5C33D7"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.578 7.837h14.853M13.703 11.091h.007M10.003 11.091h.008M6.3 11.091h.008M13.703 14.33h.007M10.003 14.33h.008M6.3 14.33h.008M13.37 1.667v2.742M6.636 1.667v2.742"
    />
    <Path
      stroke={props.stroke || "#5C33D7"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.532 2.983H6.476C4.029 2.983 2.5 4.346 2.5 6.852v7.541c0 2.546 1.529 3.94 3.976 3.94h7.048c2.455 0 3.976-1.37 3.976-3.877V6.852c.008-2.506-1.513-3.87-3.968-3.87Z"
      clipRule="evenodd"
    />
  </Svg>
)
export const LittleCalendarIcon = memo(SvgComponent)