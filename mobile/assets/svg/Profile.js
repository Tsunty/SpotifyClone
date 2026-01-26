import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Profile = ({ fillColor = "none", ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      fill={fillColor === "none" ? "none" : fillColor} 
      d="M9.542.5a5.542 5.542 0 1 0 0 11.083A5.542 5.542 0 0 0 9.542.5ZM6.042 13.333a5.542 5.542 0 0 0 0 11.084h7a5.542 5.542 0 0 0 0-11.084h-7Z"
      />
    <Path
      stroke={fillColor === "none" ? "#8D8D8D" : fillColor }
      d="M9.542.5a5.542 5.542 0 1 0 0 11.083A5.542 5.542 0 0 0 9.542.5ZM6.042 13.333a5.542 5.542 0 0 0 0 11.084h7a5.542 5.542 0 0 0 0-11.084h-7Z"
    />
  </Svg>
)
export default Profile
