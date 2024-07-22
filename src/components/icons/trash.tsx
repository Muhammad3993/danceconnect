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
      d="M22.544 11.046s-.633 7.858-1 11.168c-.176 1.58-1.152 2.507-2.752 2.536-3.043.055-6.09.058-9.133-.006-1.54-.031-2.5-.97-2.67-2.522-.37-3.34-1-11.176-1-11.176M24.16 7.28H4.374"
    />
    <Path
      stroke="#F54336"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20.348 7.28a1.923 1.923 0 0 1-1.884-1.545l-.284-1.419a1.493 1.493 0 0 0-1.443-1.107h-4.939c-.675 0-1.268.453-1.443 1.107l-.283 1.419A1.923 1.923 0 0 1 8.188 7.28"
    />
  </Svg>
)
export const TrashIcon = memo(SvgComponent)