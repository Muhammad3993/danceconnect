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
      stroke="#F75555"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M25.423 14.14H11.375M22.012 10.739l3.416 3.402-3.416 3.402M19.086 8.902c-.385-4.177-1.948-5.694-8.167-5.694-8.284 0-8.284 2.695-8.284 10.792 0 8.096 0 10.791 8.284 10.791 6.219 0 7.782-1.516 8.167-5.693"
    />
  </Svg>
)
export const LogoutIcon = memo(SvgComponent)