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
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M8.75 11.25 17.5 2.5m-8.644 9.023 2.19 5.632c.193.496.29.744.428.817.12.063.264.063.385 0 .139-.072.236-.32.43-.816L17.78 3.083c.175-.448.262-.672.214-.815a.417.417 0 0 0-.263-.263c-.143-.048-.367.04-.814.214L2.843 7.711c-.495.194-.743.29-.816.43a.417.417 0 0 0 0 .384c.073.14.321.236.817.429l5.632 2.19c.1.039.15.058.193.089.038.026.07.06.098.097.03.042.05.093.089.193Z"
    />
  </Svg>
)
export const SendIcon = memo(SvgComponent)