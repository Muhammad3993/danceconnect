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
      d="M8.142 5.368V20.09M3.383 10.15s2.53-4.783 4.757-4.783c2.226 0 4.758 4.783 4.758 4.783M19.724 22.665V7.945M24.48 17.883s-2.532 4.784-4.758 4.784-4.757-4.784-4.757-4.784"
    />
  </Svg>
)
export const SwapIcon = memo(SvgComponent)