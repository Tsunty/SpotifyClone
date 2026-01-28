import { View, Text, TouchableOpacity , Image } from "react-native";



export default function TopBlock() {
  return (
    <TouchableOpacity className="flex bg-[#58df51] w-full rounded-[30px] p-3 pl-6 justify-center">
      <Text className="font-satoshi w-2/3 text-white"> New Album</Text>
      <Text className="font-satoshi-bold text-3xl w-2/3 text-white">
        Happier Than Ever
      </Text>
      <Text className="font-satoshi text-xl w-2/3 text-white">
        Billie Eilish
      </Text>
      <Image
        source={require("@/assets/images/homeWave.png")}
        className="absolute right-0"
      />
      <Image
        source={require("@/assets/images/Billie/HomeBlock.png")}
        className="absolute right-0 bottom-0"
      />
    </TouchableOpacity>
  );
}
