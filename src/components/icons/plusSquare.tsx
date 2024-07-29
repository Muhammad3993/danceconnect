import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 5.552v4.884M10.445 7.994h-4.89"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.124 1.333H4.876c-2.177 0-3.543 1.542-3.543 3.724v5.886c0 2.182 1.36 3.724 3.543 3.724h6.248c2.184 0 3.543-1.542 3.543-3.724V5.057c0-2.182-1.359-3.724-3.543-3.724Z"
      clipRule="evenodd"
    />
  </Svg>
)
export const PlusSquareIcon = memo(SvgComponent)