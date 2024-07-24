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
      stroke="#616161"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6.697 12.245H1.36M9.078 4.034h5.338"
    />
    <Path
      stroke="#616161"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.338 3.988A1.995 1.995 0 0 0 3.336 2c-1.106 0-2.002.89-2.002 1.988 0 1.098.896 1.988 2.002 1.988 1.106 0 2.002-.89 2.002-1.988ZM14.889 12.212a1.995 1.995 0 0 0-2.001-1.988c-1.107 0-2.003.89-2.003 1.988 0 1.098.896 1.988 2.003 1.988 1.105 0 2.001-.89 2.001-1.988Z"
      clipRule="evenodd"
    />
  </Svg>
)
export const FilterIcon = memo(SvgComponent)