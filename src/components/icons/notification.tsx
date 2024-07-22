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
            d="M13.995 2.933c-5.174 0-7.421 4.685-7.421 7.781 0 2.315.335 1.634-.946 4.457-1.564 4.023 4.727 5.668 8.367 5.668 3.639 0 9.93-1.645 8.366-5.668-1.28-2.823-.945-2.142-.945-4.457 0-3.096-2.25-7.78-7.421-7.78Z"
            clipRule="evenodd"
        />
        <Path
            stroke="#212121"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16.69 23.93c-1.51 1.688-3.865 1.708-5.39 0"
        />
    </Svg>
)
export const NotificationIcon = memo(SvgComponent)