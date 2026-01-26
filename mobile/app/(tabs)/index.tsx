import SpotifySVG_3 from "@/assets/svg/Spotify_3";
import React, { useEffect, useState } from "react";
import PlayList from "@/components/ui/PlayList";
import { TouchableOpacity, View, Text, FlatList } from "react-native";
// 1. Импортируем наш хук вместо Audio из expo-av
import { usePlayer } from "@/components/contextPlayer";
import { IP_back, Track } from "@/components/interfaces";


export default function Home() {
  const [songs, setSongs] = useState<Track[]>([]);
  
  // 2. Достаем нужные функции и состояния из контекста
  const { currentTrack, isPlaying, playTrack, pauseResume } = usePlayer();

  const fetchSongs = async () => {
    try {
      const response = await fetch(`http://${IP_back}:4444/songs`);
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error("Failed to load songs", error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <View className="flex-1 bg-white dark:bg-[#0D0C0C]">
      <View className="w-full h-full items-center">
        <View className="mt-20 mb-10">
          <SpotifySVG_3 />
        </View>
        {/* Передаем данные в Playlist */}
        <PlayList songs={songs} />
      </View>
    </View>
  );
}
