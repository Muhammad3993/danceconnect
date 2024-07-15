import * as React from "react"
import Svg, { Path, Circle, SvgProps } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m24.274 8.894-.727-1.26a2.232 2.232 0 0 0-3.043-.822v0a2.221 2.221 0 0 1-3.044-.79 2.136 2.136 0 0 1-.299-1.068v0a2.231 2.231 0 0 0-2.231-2.296h-1.463a2.221 2.221 0 0 0-2.222 2.232v0a2.232 2.232 0 0 1-2.231 2.2 2.136 2.136 0 0 1-1.068-.3v0a2.232 2.232 0 0 0-3.044.823l-.78 1.281a2.232 2.232 0 0 0 .812 3.044v0a2.232 2.232 0 0 1 0 3.865v0a2.221 2.221 0 0 0-.811 3.033v0l.736 1.271a2.232 2.232 0 0 0 3.044.865v0a2.21 2.21 0 0 1 3.033.812c.192.323.295.691.299 1.068v0c0 1.232.999 2.231 2.232 2.231h1.463a2.232 2.232 0 0 0 2.232-2.22v0a2.221 2.221 0 0 1 2.231-2.233c.376.01.742.113 1.068.3v0a2.232 2.232 0 0 0 3.044-.812v0l.769-1.282a2.22 2.22 0 0 0-.812-3.043v0a2.22 2.22 0 0 1-.811-3.044 2.19 2.19 0 0 1 .811-.811v0a2.232 2.232 0 0 0 .812-3.033v0-.01Z"
      clipRule="evenodd"
    />
    <Circle
      cx={14.204}
      cy={13.871}
      r={3.076}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </Svg>
)
export const SettingIcon = memo(SvgComponent)