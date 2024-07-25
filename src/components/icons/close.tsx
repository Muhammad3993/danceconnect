import * as React from "react"
import Svg, { G, Path, Defs, ClipPath, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    viewBox="0 0 28 28"
    {...props}
  >
    <G fill={props.stroke || "#212121"} fillRule="evenodd" clipPath="url(#a)" clipRule="evenodd">
      <Path d="M3.682 24.79a1.052 1.052 0 0 1-.745-1.798l20.64-20.638a1.052 1.052 0 1 1 1.489 1.489L4.426 24.482a1.045 1.045 0 0 1-.744.309Z" />
      <Path d="M23.765 24.209c-.262 0-.525-.1-.725-.301L2.926 3.794a1.025 1.025 0 1 1 1.45-1.451l20.115 20.114a1.025 1.025 0 0 1-.726 1.752Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h28v28H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export const CloseIcon = memo(SvgComponent)