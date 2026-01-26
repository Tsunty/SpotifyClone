import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SunLight = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={31}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M15.417.75v2.667m0 24v2.666m14.666-14.666h-2.666m-24 0H.75M25.788 5.046 23.902 6.93m-16.97 16.97-1.886 1.887m20.742 0-1.886-1.886M6.932 6.932 5.045 5.045m18.37 10.37a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
    />
  </Svg>
)
export default SunLight
