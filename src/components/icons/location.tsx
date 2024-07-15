import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      fillRule="evenodd"
      d="M1.668 8.318C1.668 3.718 5.512 0 10.161 0c4.663 0 8.507 3.718 8.507 8.318 0 2.318-.843 4.47-2.23 6.294a22.065 22.065 0 0 1-5.541 5.14c-.486.318-.925.342-1.459 0a21.64 21.64 0 0 1-5.54-5.14c-1.388-1.824-2.23-3.976-2.23-6.294Zm5.694.259c0 1.54 1.258 2.753 2.8 2.753 1.542 0 2.812-1.212 2.812-2.753 0-1.53-1.27-2.8-2.813-2.8a2.813 2.813 0 0 0-2.799 2.8Z"
      clipRule="evenodd"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={18.668}
        x2={-2.005}
        y1={20}
        y2={14.905}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#584CF4" />
        <Stop offset={1} stopColor="#7369F8" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export const LocationIcon = memo(SvgComponent)