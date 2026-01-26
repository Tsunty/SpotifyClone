import * as React from "react"
import Svg, { Path } from "react-native-svg"
 
// Принимаем props и достаем из них fillColor (по умолчанию "none")
const Heart = ({ fillColor = "none", ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      fill={fillColor === "none" ? "none" : fillColor} 
      stroke={fillColor === "none" ? "#8D8D8D" : fillColor }
      strokeWidth={1.5}
      strokeLinecap="round"
      d="M21.863 2.204C19.14-.573 15.987.598 14.034 1.837c-1.103.7-2.632.7-3.735 0-1.953-1.239-5.106-2.41-7.83.367C-3.994 8.797 7.092 21.5 12.168 21.5c5.075 0 16.16-12.703 9.696-19.296Z"
    />
  </Svg>
)

export default Heart