import * as React from "react"
import Svg, { Mask, Path, G, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Mask
      id="a"
      width={18}
      height={12}
      x={1}
      y={7}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M1.668 7.328h16.666v11.454H1.668V7.328Z"
        clipRule="evenodd"
      />
    </Mask>
    <G mask="url(#a)">
      <Path
        fill="#5C33D7"
        fillRule="evenodd"
        d="M14.639 18.782H5.364a3.7 3.7 0 0 1-3.696-3.696v-4.063a3.7 3.7 0 0 1 3.696-3.695h.777a.625.625 0 0 1 0 1.25h-.777a2.448 2.448 0 0 0-2.446 2.445v4.063a2.448 2.448 0 0 0 2.446 2.446h9.275a2.448 2.448 0 0 0 2.446-2.446v-4.07a2.44 2.44 0 0 0-2.437-2.438h-.786a.625.625 0 0 1 0-1.25h.786a3.691 3.691 0 0 1 3.687 3.688v4.07a3.7 3.7 0 0 1-3.696 3.696Z"
        clipRule="evenodd"
      />
    </G>
    <Mask
      id="b"
      width={2}
      height={12}
      x={9}
      y={1}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M9.375 1.667h1.25V12.95h-1.25V1.667Z"
        clipRule="evenodd"
      />
    </Mask>
    <G mask="url(#b)">
      <Path
        fill="#5C33D7"
        fillRule="evenodd"
        d="M10 12.95a.625.625 0 0 1-.625-.624V2.292a.625.625 0 0 1 1.25 0v10.034c0 .345-.28.625-.625.625Z"
        clipRule="evenodd"
      />
    </G>
    <Path
      fill="#5C33D7"
      fillRule="evenodd"
      d="M7.572 5.357a.624.624 0 0 1-.442-1.066l2.429-2.44a.642.642 0 0 1 .885 0l2.43 2.44a.625.625 0 0 1-.885.882L10 3.178 8.015 5.173a.62.62 0 0 1-.443.184Z"
      clipRule="evenodd"
    />
  </Svg>
)
export const UploadIcon = memo(SvgComponent)