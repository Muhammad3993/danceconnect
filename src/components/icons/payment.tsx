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
      d="M24.7 17.121h-4.534a2.99 2.99 0 0 1 0-5.98h4.499M20.678 14.062h-.347M8.875 9.501h4.737"
    />
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.168 14.295c0-7.472 2.712-9.962 10.851-9.962 8.138 0 10.85 2.49 10.85 9.962 0 7.471-2.712 9.963-10.85 9.963-8.139 0-10.851-2.492-10.851-9.963Z"
      clipRule="evenodd"
    />
  </Svg>
)
export const PaymentIcon = memo(SvgComponent)