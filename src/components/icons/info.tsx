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
      d="M24.79 14c0 8.093-2.7 10.792-10.793 10.792S3.206 22.093 3.206 14 5.904 3.208 13.997 3.208C22.091 3.208 24.79 5.907 24.79 14Z"
      clipRule="evenodd"
    />
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.999 18.544V14M14.004 9.917h-.01"
    />
  </Svg>
)
export const InfoIcon = memo(SvgComponent)