import SpotifySVG_3 from "@/assets/svg/Spotify_3";
import { IP_back } from "@/components/interfaces";
import ButtonBack from "@/components/ui/ButtonBack";
import AppInput from "@/components/ui/inputText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`http://${IP_back}:4444/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      if (data.token) {
        // Заполняем хранилища
        await SecureStore.setItemAsync("userToken", data.token);
        await AsyncStorage.setItem("userID", data.user.id.toString());
        await AsyncStorage.setItem("username", data.user.username);
        await AsyncStorage.setItem("email", data.user.email);
        router.replace("/(tabs)"); // Переход в приложение
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
  return (
    <View>
      <ButtonBack />
      <View className="w-full h-full items-center justify-center">
        <View className="absolute top-20">
          <SpotifySVG_3 />
        </View>

        <Text
          className="dark:text-gray-300 text-[#383838] text-center font-satoshi-bold
                                text-5xl mb-4 mt-12"
        >
          Sign In
        </Text>

        <View className="flex-row gap-1">
          <Text
            className="text-gray-500 text-center font-satoshi
                                    text-1xl"
          >
            If You Need Any Support
          </Text>
          <TouchableOpacity onPress={() => router.push("/wip")}>
            <Text className="text-[#42C83C] font-satoshi text-1xl">
              Click Here
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-4/5 mt-7 gap-5">
          <View className="w-full h-24">
            <AppInput
              placeholder="Enter Username Or Email"
              onChangeText={(text) => handleChange("email", text)}
            />
          </View>

          <View className="w-full h-24">
            <AppInput
              placeholder="Password"
              isPassword={true}
              onChangeText={(text) => handleChange("password", text)}
            />
          </View>

          <View>
            <TouchableOpacity
              className="bg-[#42C83C] w-full h-24 rounded-[30px] items-center justify-center mt-7"
              onPress={() => handleLogin()}
            >
              <Text className="text-white font-satoshi-bold text-2xl">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center my-8 w-4/5">
          <View className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-800" />
          <Text className="mx-4 text-gray-700 dark:text-gray-300 font-satoshi">
            Or
          </Text>
          <View className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-800" />
        </View>
        <View className="flex-row w-4/5 justify-evenly items-center">
          <Image source={require("../assets/images/auth/google.png")} />
          <Image source={require("../assets/images/auth/apple.png")} />
        </View>

        <View className="flex-row gap-1 mt-10">
          <Text
            className="text-gray-500 text-center font-satoshi
                                    text-1xl"
          >
            Not A Member?
          </Text>
          <TouchableOpacity onPress={() => router.push("/signUp")}>
            <Text className="text-[#42C83C] font-satoshi text-1xl">
              Register Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
