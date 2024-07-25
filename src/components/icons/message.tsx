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
      d="M13.999 3.208C19.958 3.208 24.79 8.04 24.79 14S19.958 24.792 14 24.792c-5.96 0-10.792-4.833-10.792-10.792 0-5.96 4.832-10.791 10.792-10.791Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18.594 14.015h.01M13.918 14.015h.01M9.238 14.015h.01"
    />
  </Svg>
)
export const MessageIcon = memo(SvgComponent)