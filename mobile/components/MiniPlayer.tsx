import React, { useState, useEffect, useCallback } from "react";
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
import BackSvg from "@/assets/svg/VectorBack";
import Menu from "@/assets/svg/Menu";
import Heart from "@/assets/svg/Heart";
import Pause from "@/assets/svg/Pause";
import Play from "@/assets/svg/Play";
import PrevNext from "@/assets/svg/PrevNext";
import Repeat from "@/assets/svg/Repeat";
import Shuffle from "@/assets/svg/Shuffle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IP_back, Track } from "./interfaces";
import { useFocusEffect } from "expo-router";

export default function MiniPlayer() {
  const {
    playNext,
    currentTrack,
    isPlaying,
    pauseResume,
    position,
    duration,
    seek,
    toggleShuffle,
    isShuffled,
    toggleRepeat,
    isRepeatMode,
    setArtistId,
  } = usePlayer();

  const [isFullPlayer, setIsFullPlayer] = useState(false);
  const [slidingValue, setSlidingValue] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchFavoriteIds = async () => {
        try {
          const userId = await AsyncStorage.getItem("userID");
          if (!userId) return;
          const response = await fetch(
            `http://${IP_back}:4444/favorites/ArrIds/${userId}`,
          );
          const ids = await response.json();
          setFavoriteIds(ids);
        } catch (error) {
          console.error("Ошибка при получении ID избранного:", error);
        }
      };
      fetchFavoriteIds();
    }, []),
  );

  if (!currentTrack) return null;

  const formatTime = (millis: number) => {
    if (!millis || isNaN(millis)) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const onSlidingComplete = (value: number) => {
    seek(value);
    setIsSliding(false);
  };

  const toggleFavorite = async (track: Track) => {
    try {
      const userId = 1;
      const response = await fetch(`http://${IP_back}:4444/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, track }),
      });

      const data = await response.json();

      // После успешного ответа обновляем локальный список ID
      if (data.isLiked) {
        setFavoriteIds((prev) => [...prev, track.id]);
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== track.id));
      }
    } catch (error) {
      console.error("Ошибка при лайке трека:", error);
    }
  };
  const isLiked = favoriteIds.includes(currentTrack.id);

  console.log(currentTrack.image);
  
  return (
    <>
      {/* МАЛЕНЬКИЙ ПЛЕЕР */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setIsFullPlayer(true)}
        className="absolute bottom-[80px] w-full bg-white 
                  h-20 z-50 shadow-top justify-center"
      >
        <View
          className="flex-row items-center px-3 border border-gray-200
                         absolute left-3 right-3 h-2/3 bg-gray-100
                         rounded-xl"
        >
          <Image
            source={{ uri: currentTrack.image }}
            className="w-10 h-10 rounded-lg"
          />
          <View className="flex-1 ml-3">
            <Text numberOfLines={1} className="font-satoshi-bold text-sm">
              {currentTrack.title}
            </Text>
            <Text className="text-gray-400 text-xs">{currentTrack.artist}</Text>
          </View>
          <TouchableOpacity onPress={pauseResume} className="p-2">
            <Text className="text-white text-xl">
              {isPlaying ? "⏸️" : "▶️"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* ПОЛНОЭКРАННЫЙ ПЛЕЕР */}
      <Modal
        visible={isFullPlayer}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="px-6 flex-1 justify-between py-10">
            {/* Header */}
            <View className="flex-row justify-between px-2">
              <TouchableOpacity
                onPress={() => setIsFullPlayer(false)}
                className={`bg-black/5 dark:bg-white/5 
                          w-10 h-10 rounded-full 
                          items-center justify-center`}
              >
                <BackSvg />
              </TouchableOpacity>
              <Text className="text-3xl font-satoshi-bold dark:text-white px-8 mb-6">
                Now playing
              </Text>
              <TouchableOpacity
                onPress={() => alert("Work In Progress")}
                className={`w-10 h-10 rounded-full 
                          items-center justify-center`}
              >
                <Menu />
              </TouchableOpacity>
            </View>

            {/* Обложка */}
            <View className="items-center w-full h-1/2 px-2">
              <Image
                source={{ uri: currentTrack.image }}
                className="w-full h-full rounded-[30px]"
              />
            </View>

            {/* Инфо */}
            <View className="mt-4 flex-row justify-between items-center">
              <View>
                <Text
                  className="dark:text-white text-3xl font-satoshi-bold"
                  numberOfLines={1}
                >
                  {currentTrack.title}
                </Text>
                <TouchableOpacity
                  className="text-gray-500 text-xl mt-1"
                  onPress={() => alert(currentTrack.artist)}
                >
                  <Text>{currentTrack.artist}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(currentTrack)}>
                <Heart fillColor={isLiked ? "#42C83C" : "none"} />
              </TouchableOpacity>
            </View>

            {/* Слайдер */}
            <View>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={duration}
                value={isSliding ? slidingValue : position}
                minimumTrackTintColor="#434343"
                maximumTrackTintColor="#BEBEBE"
                thumbTintColor="#5C5C5C"
                onValueChange={(val) => {
                  setIsSliding(true);
                  setSlidingValue(val);
                }}
                onSlidingComplete={onSlidingComplete}
              />
              <View className="flex-row justify-between px-2">
                <Text className="text-gray-500">
                  {formatTime(isSliding ? slidingValue : position)}
                </Text>
                <Text className="text-gray-500">{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Управление */}
            <View className="flex-row items-center justify-between px-10 mb-10">
              <TouchableOpacity onPress={toggleRepeat}>
                <Repeat fillColor="#363636" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => playNext(-1)}>
                <PrevNext />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pauseResume}
                className="bg-[#42C83C] w-20 h-20 rounded-full items-center justify-center"
              >
                {isPlaying ? <Pause /> : <Play size={24} fillColor="#FFFFFF" />}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => playNext(1)}>
                <PrevNext reverse={true} />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleShuffle}>
                <Shuffle />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
