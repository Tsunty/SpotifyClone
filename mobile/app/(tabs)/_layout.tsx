import { Tabs } from "expo-router";
import { View } from "react-native";
import Home from "@/assets/svg/Home";
import Heart from "@/assets/svg/Heart";
import Profile from "@/assets/svg/Profile";
import Explore from "@/assets/svg/Explore";

// 1. Импортируй созданный ранее контекст и компонент плеера
import { PlayerProvider } from "@/components/contextPlayer"
import MiniPlayer from "@/components/MiniPlayer";

export default function TabsLayout() {
  return (
    // 2. Оборачиваем всё в PlayerProvider, чтобы доступ к музыке был везде
    <PlayerProvider>
      <View style={{ flex: 1 }}>
        
        {/* 3. Мини-плеер рендерится поверх вкладок */}
        <MiniPlayer />

        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: "#FFFFFF",
              borderTopWidth: 1,
              height: 80,
              position: "absolute",
              bottom: 0,
              elevation: 0,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              tabBarIcon: ({ focused }) => (
                <View className="items-center justify-center mt-4 gap-3 h-full">
                  <View className={`${focused ? "bg-[#42C83C]" : "none"} w-6 h-1 rounded-full`} />
                  <Home fillColor={focused ? "#42C83C" : "none"} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              tabBarIcon: ({ focused }) => (
                <View className="items-center justify-center mt-4 gap-3 h-full">
                  <View className={`${focused ? "bg-[#42C83C]" : "none"} w-6 h-1 rounded-full`} />
                  <Explore fillColor={focused ? "#42C83C" : "none"} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="artists"
            options={{
              tabBarIcon: ({ focused }) => (
                <View className="items-center justify-center mt-4 gap-3 h-full">
                  <View className={`${focused ? "bg-[#42C83C]" : "none"} w-6 h-1 rounded-full`} />
                  <Heart fillColor={focused ? "#42C83C" : "none"} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              tabBarIcon: ({ focused }) => (
                <View className="items-center justify-center mt-4 gap-3 h-full">
                  <View className={`${focused ? "bg-[#42C83C]" : "none"} w-6 h-1 rounded-full`} />
                  <Profile fillColor={focused ? "#42C83C" : "none"} />
                </View>
              ),
            }}
          />
        </Tabs>
      </View>
    </PlayerProvider>
  );
}