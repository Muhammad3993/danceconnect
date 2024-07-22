import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps & { active: boolean }) => (
  !props.active ?
    (
      <Svg
        width={props.width || 20}
        height={props.height || 20}
        viewBox="0 0 20 20"
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
    :
    (
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
          d="M16.915 12.25a2.917 2.917 0 1 0-5.833 0 2.917 2.917 0 0 0 5.833 0Z"
          clipRule="evenodd"
        />
        <Path
          stroke="#212121"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14 24.5c-1.399 0-8.75-5.952-8.75-12.176C5.25 7.45 9.167 3.5 14 3.5c4.832 0 8.75 3.951 8.75 8.824 0 6.224-7.352 12.176-8.75 12.176Z"
          clipRule="evenodd"
        />
      </Svg>
    )
)
export const LocationIcon = memo(SvgComponent)