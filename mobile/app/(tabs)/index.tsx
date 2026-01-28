import SpotifySVG_3 from "@/assets/svg/Spotify_3";
import React, { useEffect, useState } from "react";
import PlayList from "@/components/ui/PlayList";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Album, Artist, IP_back, Track } from "@/components/interfaces";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import ArtistsBlock from "@/components/ui/artistsBlock";
import TopBlock from "@/components/ui/TopBlockNews";
import AlbumsBlock from "@/components/ui/albumBlock";

type NavChoice = "News" | "Video" | "Artists" | "Podcasts";

export default function Home() {
  const [songs, setSongs] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [navChoice, setNavChoice] = useState<NavChoice>("News");

  const fetchSongs = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        router.replace("/getStarted");
        return;
      }

      const response = await fetch(`http://${IP_back}:4444/songs/chart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch(`http://${IP_back}:4444/albums/chart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error("Failed to load albums", error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  let blockInfo;
  switch (navChoice) {
    case "News":
      blockInfo = <AlbumsBlock albums={albums} />;
      break;
    case "Video":
      blockInfo = <View className="px-5 mt-4"></View>;
      break;
    case "Artists":
      blockInfo = <ArtistsBlock />;
      break;
    case "Podcasts":
      blockInfo = <View className="px-5 mt-4"></View>;
      break;

    default:
      break;
  }

  return (
    <View className="flex-1 bg-white dark:bg-[#0D0C0C] items-center">
      <View className="top-20 absolute">
        <SpotifySVG_3 />
      </View>
      <View className="w-full h-full items-center gap-5 mt-32">
        <View className="w-full px-10">
          <TopBlock />
        </View>

        <HomeNavigator navigator={[navChoice, setNavChoice]} />

        <View className="w-full">{blockInfo}</View>

        <Text className="w-full font-satoshi-bold text-3xl px-10">
          Playlist
        </Text>

        <PlayList songs={songs} />
      </View>
    </View>
  );
}

interface HomeNavigatorProps {
  navigator: [NavChoice, React.Dispatch<React.SetStateAction<NavChoice>>];
}
function HomeNavigator({ navigator }: HomeNavigatorProps) {
  const [navChoice, setNavChoice] = navigator;
  return (
    <View className="flex w-full">
      <FlatList
        data={["News", "Video", "Artists", "Podcasts"] as const}
        horizontal={true}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        keyExtractor={(item) => item[0]}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              className="items-center justify-center"
              onPress={() => setNavChoice(item)}
            >
              <Text
                className={`font-satoshi-bold text-2xl mx-8 ${item === navChoice ? "text-black" : "text-gray-400"}`}
              >
                {item}
              </Text>
              {item === navChoice ? (
                <View className="bg-green-400 h-1 w-1/2 rounded-b-full" />
              ) : (
                ""
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
