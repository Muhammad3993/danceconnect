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
      fill="#F5A80C"
      fillRule="evenodd"
      d="M14.08 20H5.91C2.38 20 0 17.729 0 14.34V5.67C0 2.28 2.38 0 5.91 0h8.17C17.62 0 20 2.28 20 5.67v8.67c0 3.389-2.38 5.66-5.92 5.66ZM12.27 9.25H5.92c-.42 0-.75.34-.75.75 0 .42.33.75.75.75h6.35l-2.48 2.47c-.14.14-.22.34-.22.53 0 .189.08.38.22.53.29.29.77.29 1.06 0l3.77-3.75c.28-.28.28-.78 0-1.06l-3.77-3.75a.754.754 0 0 0-1.06 0c-.29.3-.29.77 0 1.07l2.48 2.46Z"
      clipRule="evenodd"
    />
  </Svg>
)
export const ArrowRight = memo(SvgComponent)