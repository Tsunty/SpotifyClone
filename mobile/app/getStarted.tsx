import { View, TouchableOpacity, Text } from "react-native";
import SpotifySVG_1 from "../assets/svg/Spotify_1";
import { ImageBackground } from "expo-image";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function GetStarted() {
  const router = useRouter();

  useEffect(() => {
    const clearStorage = async () => {
      try {
        // Удаляем токен авторизации
        await SecureStore.deleteItemAsync("userToken");

        // Если хочешь удалить только данные пользователя, не трогая тему:
        await AsyncStorage.removeItem("userData");

        // Если всё же нужно очистить ВСЁ:
        // await AsyncStorage.clear();

        console.log("Storage cleared successfully");
      } catch (e) {
        console.error("Failed to clear storage:", e);
      }
    };

    clearStorage();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/Billie/GetStarted.png")}
      className="flex-1 w-full h-full"
      contentFit="cover"
    >
      <View className="py-20 w-full h-full justify-between items-center">
        <SpotifySVG_1 />
        <View className="w-4/5 flex gap-7">
          <Text
            className="text-gray-300 text-center font-satoshi-bold
                              text-2xl"
          >
            Enjoy Listening To Music
          </Text>
          <Text
            className="text-gray-500 text-center font-satoshi
                              text-2xl"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
            numquam quos non reiciendis libero modi eveniet quod eaque.
          </Text>

          <TouchableOpacity
            className="bg-[#42C83C] w-full h-24 rounded-[30px] items-center justify-center"
            onPress={() => router.replace("/chooseMode")}
          >
            <Text className="text-white font-satoshi-bold text-2xl">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
