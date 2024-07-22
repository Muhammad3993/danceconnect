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
      d="M14 3.5c-2.376 0-2.6 4.138-4.014 5.6-1.415 1.461-5.811-.21-6.422 2.385-.61 2.596 3.345 3.477 3.833 5.704.49 2.227-1.926 5.357.139 6.914C9.6 25.66 11.823 22.137 14 22.137c2.177 0 4.4 3.522 6.464 1.966 2.065-1.557-.35-4.687.139-6.914.489-2.227 4.443-3.108 3.833-5.704-.61-2.595-5.007-.924-6.42-2.385C16.6 7.638 16.376 3.5 14 3.5Z"
      clipRule="evenodd"
    />
  </Svg>
)
export const StarIcon = memo(SvgComponent)