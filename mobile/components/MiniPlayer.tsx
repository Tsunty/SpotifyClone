import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { usePlayer } from "@/components/contextPlayer";

export default function MiniPlayer() {
  const { playNext, playPrevious, currentTrack, isPlaying, pauseResume, position, duration, seek } =
    usePlayer();
  const [isFullPlayer, setIsFullPlayer] = useState(false);

  if (!currentTrack) return null;

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      {/* МАЛЕНЬКИЙ ПЛЕЕР (над навигацией) */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setIsFullPlayer(true)}
        className="absolute bottom-[80px] left-2 right-2 bg-[#282828] h-16 rounded-xl flex-row items-center px-3 z-50 border-b border-zinc-800"
      >
        <Image
          source={{ uri: currentTrack.image }}
          className="w-10 h-10 rounded-lg"
        />
        <View className="flex-1 ml-3">
          <Text
            numberOfLines={1}
            className="text-white font-satoshi-bold text-sm"
          >
            {currentTrack.title}
          </Text>
          <Text className="text-gray-400 text-xs">{currentTrack.artist}</Text>
        </View>
        <TouchableOpacity onPress={pauseResume} className="p-2">
          <Text className="text-white text-xl">{isPlaying ? "⏸️" : "▶️"}</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* ПОЛНОЭКРАННЫЙ ПЛЕЕР */}
      <Modal
        visible={isFullPlayer}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView className="flex-1 bg-[#121212]">
          <View className="px-6 flex-1 justify-between py-10">
            {/* Header */}
            <TouchableOpacity onPress={() => setIsFullPlayer(false)}>
              <Text className="text-white text-2xl">✕</Text>
            </TouchableOpacity>

            {/* Обложка */}
            <View className="items-center shadow-2xl">
              <Image
                source={{ uri: currentTrack.image }}
                className="w-80 h-80 rounded-2xl"
              />
            </View>

            {/* Инфо */}
            <View>
              <Text className="text-white text-3xl font-satoshi-bold">
                {currentTrack.title}
              </Text>
              <Text className="text-gray-400 text-xl mt-1">
                {currentTrack.artist}
              </Text>
            </View>

            {/* Слайдер / Range */}
            <View>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                minimumTrackTintColor="#42C83C"
                maximumTrackTintColor="#555555"
                thumbTintColor="#42C83C"
                onSlidingComplete={seek}
              />
              <View className="flex-row justify-between px-2">
                <Text className="text-gray-400">{formatTime(position)}</Text>
                <Text className="text-gray-400">{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Кнопки управления */}
            <View className="flex-row items-center justify-between px-10 mb-10">
              <TouchableOpacity onPress={playPrevious}>
                <Text className="text-white text-4xl">⏮</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pauseResume}
                className="bg-[#42C83C] w-20 h-20 rounded-full items-center justify-center"
              >
                <Text className="text-white text-4xl">
                  {isPlaying ? "⏸" : "▶"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={playNext}>
                <Text className="text-white text-4xl">⏭</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
