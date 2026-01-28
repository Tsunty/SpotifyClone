import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Pause = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={23}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M1.75.875a.875.875 0 1 0-1.75 0v21a.875.875 0 0 0 1.75 0v-21ZM8.75.875a.875.875 0 1 0-1.75 0v21a.875.875 0 0 0 1.75 0v-21Z"
    />
  </Svg>
)
export default Pause
