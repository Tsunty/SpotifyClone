import * as React from "react"
import Svg, { Path } from "react-native-svg"
const MoonDark = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={27}
    height={31}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeWidth={1.5}
      d="M13.155 16.333c6 10.392 17.272 7.348 10.098 11.49-7.175 4.142-16.349 1.684-20.49-5.49-4.143-7.174-1.685-16.348 5.49-20.49 7.174-4.143-1.098 4.098 4.902 14.49Z"
    />
  </Svg>
)
export default MoonDark
