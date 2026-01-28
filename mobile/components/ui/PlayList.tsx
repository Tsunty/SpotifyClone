import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";

import { TouchableOpacity, View, Text, FlatList, Image } from "react-native";
import Play from "../../assets/svg/Play";
import Heart from "../../assets/svg/Heart";
import { usePlayer } from "@/components/contextPlayer";
import { IP_back, Track } from "../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PlayListProps {
  songs: Track[];
  isPhoto?: boolean;
}

export default function PlayList({ songs, isPhoto }: PlayListProps) {
  const { currentTrack, isPlaying, playTrack, pauseResume } = usePlayer();
  // Состояние для хранения ID всех лайкнутых треков
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // 1. Функция загрузки списка ID избранного
  const fetchFavoriteIds = async () => {
    try {
      const userId = await AsyncStorage.getItem("userID");
      const response = await fetch(
        `http://${IP_back}:4444/favorites/ArrIds/${userId}`,
      );
      const ids = await response.json();
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Ошибка при получении ID избранного:", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchFavoriteIds();
    }, []),
  );

  // 2. Функция переключения лайка
  const toggleFavorite = async (track: Track) => {
    try {
      const userId = 1;
      const response = await fetch(
        `http://${IP_back}:4444/favorites/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, track }),
        },
      );

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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View className="w-full px-10 flex-1">
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
        renderItem={({ item }) => {
          const isCurrent = currentTrack?.id === item.id;
          const isLiked = favoriteIds.includes(item.id);

          return (
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity
                className="flex-row items-center flex-1 gap-4"
                onPress={() => (isCurrent ? pauseResume() : playTrack(item, songs))}
              >
                {isPhoto ? (
                  <Image
                    source={{ uri: item.image }}
                    className="w-12 h-12 rounded-lg" // Задай ширину и высоту
                    resizeMode="cover"
                  />
                ) : (
                  <View className="bg-[#E6E6E6] dark:bg-[#2C2C2C] rounded-full p-3 border-[2px] border-gray-300 dark:border-[#1C1C1C]">
                    {isCurrent && isPlaying ? (
                      <Text className="text-[10px] w-[15px] text-center">
                        ⏸
                      </Text>
                    ) : (
                      <Play />
                    )}
                  </View>
                )}

                <View className="flex-1">
                  <Text
                    numberOfLines={1}
                    className={`text-lg font-satoshi-bold w-3/4 ${
                      isCurrent
                        ? "text-[#42C83C]"
                        : "dark:text-white text-[#383838]"
                    }`}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-sm font-satoshi text-gray-500">
                    {item.artist}
                  </Text>
                </View>
              </TouchableOpacity>

              <View className="flex-row items-center gap-4">
                <Text className="text-gray-500 font-satoshi">
                  {formatDuration(item.duration)}
                </Text>
                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                  <Heart fillColor={isLiked ? "#42C83C" : "none"} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
