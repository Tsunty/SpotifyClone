import * as React from "react";
import Svg, { Circle } from "react-native-svg";
const Menu = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={4}
    height={18}
    fill="none"
    {...props}
  >
    <Circle
      cx={1.965}
      cy={8.965}
      r={1.964}
      fill="#7D7D7D"
      transform="rotate(.03 1.965 8.965)"
    />
    <Circle
      cx={1.965}
      cy={1.965}
      r={1.964}
      fill="#7D7D7D"
      transform="rotate(.03 1.965 1.965)"
    />
    <Circle
      cx={1.965}
      cy={16.035}
      r={1.964}
      fill="#7D7D7D"
      transform="rotate(.03 1.965 16.035)"
    />
  </Svg>
);
export default Menu;
