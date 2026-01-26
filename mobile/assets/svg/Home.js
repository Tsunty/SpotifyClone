import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Home = ({ fillColor = "none", ...props }) => (
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
      fillOpacity={0.99}
      fillRule="evenodd"
      strokeLinecap="round"
      d="M6.08 3.96C2.97 6.22 1.415 7.35.804 9.02c-.05.134-.093.27-.132.407-.487 1.71.107 3.538 1.295 7.196 1.189 3.657 1.783 5.486 3.182 6.583.112.088.227.172.346.252 1.475.991 3.398.991 7.244.991 3.846 0 5.769 0 7.244-.991.119-.08.234-.164.346-.252 1.4-1.097 1.994-2.925 3.182-6.583 1.188-3.658 1.782-5.486 1.295-7.196a5.804 5.804 0 0 0-.132-.407c-.61-1.67-2.166-2.8-5.277-5.06C16.283 1.7 14.727.57 12.951.504a5.834 5.834 0 0 0-.428 0C10.748.569 9.192 1.699 6.081 3.96Zm4.325 14.121a.875.875 0 1 0 0 1.75h4.666a.875.875 0 0 0 0-1.75h-4.666Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default Home
