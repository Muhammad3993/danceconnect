import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    {...props}
    width={20}
    height={20}
    fill="none"
  >
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.62 7.516s-2.675 3.21-4.631 3.21c-1.956 0-4.66-3.21-4.66-3.21"
    />
    <Path
      stroke="#212121"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.043 9.974c0-5.698 1.984-7.597 7.936-7.597 5.953 0 7.937 1.899 7.937 7.597s-1.984 7.597-7.937 7.597c-5.952 0-7.936-1.9-7.936-7.597Z"
      clipRule="evenodd"
    />
  </Svg>
)
export const MailIcon = memo(SvgComponent)