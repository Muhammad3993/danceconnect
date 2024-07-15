import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
    <Svg
        {...props}
        width={28}
        height={28}
        fill="none"
    >
        <Path
        fill={props.fill}
        d="M23.332 14.32c0 .443-.33.809-.756.867l-.119.008h-17.5a.875.875 0 0 1-.119-1.742l.119-.008h17.5c.483 0 .875.392.875.875Z"
        />
        <Path
        fill={props.fill}
        d="M12.633 20.728a.875.875 0 0 1-1.136 1.325l-.099-.085-7.058-7.027a.875.875 0 0 1-.085-1.142l.085-.099 7.058-7.029a.875.875 0 0 1 1.32 1.142l-.085.098-6.435 6.41 6.435 6.407Z"
        />
    </Svg>
)

export const ArrowLeft = memo(SvgComponent)