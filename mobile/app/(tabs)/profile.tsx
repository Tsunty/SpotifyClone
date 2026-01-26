import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Image } from "react-native";
import PlayList from "@/components/ui/PlayList"; // Твой компонент
import { useFocusEffect } from "expo-router";
import { IP_back, Track } from "@/components/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FavoritesScreen() {
  const [favSongs, setFavSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const userId = await AsyncStorage.getItem("userID")
      const response = await fetch(
        `http://${IP_back}:4444/favorites/${userId}`,
      );
      const data = await response.json();
      setFavSongs(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, []),
  );

  return (
    <View className="flex-1 gap-4">
      <View
        className="bg-white w-full
        rounded-b-[70px] drop-shadow-xl
        items-center pt-20 gap-3"
      >
        <Text className="text-2xl font-satoshi-bold dark:text-white">
          Profile
        </Text>
        <View className="border h-20 w-20 rounded-full" />
        <Text className="font-satoshi dark:text-white">
          {AsyncStorage.getItem("email")}
        </Text>
        <Text className="text-3xl font-satoshi-bold dark:text-white">
          {AsyncStorage.getItem("username")}
        </Text>
        <View className="flex-row w-full justify-evenly my-8">
          <View className="items-center">
            <Text className="text-3xl font-satoshi-bold dark:text-white">
              {favSongs.length}
            </Text>
            <Text className="font-satoshi dark:text-white">Tracks</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl font-satoshi-bold dark:text-white">
              {new Set(favSongs.map((song) => song.artist)).size}
            </Text>
            <Text className="font-satoshi dark:text-white">Artists</Text>
          </View>
        </View>
      </View>

      <View className="flex-1">
        <Text className="text-3xl font-satoshi-bold dark:text-white px-8 mb-6">
          Your Favorites
        </Text>
        <PlayList songs={favSongs} isPhoto={true} />
      </View>
    </View>
  );
}
