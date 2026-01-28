import SpotifySVG_3 from "@/assets/svg/Spotify_3";
import React, { useEffect, useState } from "react";
import PlayList from "@/components/ui/PlayList";
import { View } from "react-native";
import { IP_back, Track } from "@/components/interfaces";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import InputText from "@/components/ui/inputText";

export default function Explore() {
  const [songs, setSongs] = useState<Track[]>([]);
  const [query, setQuery] = useState("");

  const SearchSongs = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        router.replace("/getStarted");
        return;
      }
      const response = await fetch(
        `http://${IP_back}:4444/songs/search/${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 401 || response.status === 403) {
        await SecureStore.deleteItemAsync("userToken");
        router.replace("/getStarted");
        return;
      }
      const data = await response.json();

      setSongs(data);
    } catch (error) {
      console.error("Failed to load songs", error);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-[#0D0C0C]">
      <View className="w-full h-full items-center">
        <View className="mt-20 mb-10">
          <SpotifySVG_3 />
        </View>
        <View className="h-16 w-1/2">
          <InputText
            placeholder="search"
            onChangeText={(text) => {
              setQuery(text);
              SearchSongs();
            }}
          />
        </View>
        <PlayList songs={songs} />
      </View>
    </View>
  );
}
