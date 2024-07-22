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
      d="M13.98 25.207c2.725 0 8.951-2.71 8.951-10.182 0-7.471.325-8.056-.393-8.774-.718-.719-4.463-3.042-8.557-3.042S6.14 5.532 5.424 6.251c-.718.718-.394 1.303-.394 8.774 0 7.473 6.228 10.182 8.95 10.182Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m10.95 13.854 2.207 2.21 4.547-4.55"
    />
  </Svg>
)
export const SecurityIcon = memo(SvgComponent)