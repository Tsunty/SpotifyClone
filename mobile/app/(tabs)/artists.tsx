import { usePlayer } from "@/components/contextPlayer";
import { Album, Artist, IP_back, Track } from "@/components/interfaces";
import AlbumsBlock from "@/components/ui/albumBlock";
import PlayList from "@/components/ui/PlayList";
import { useFocusEffect } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Image, ScrollView } from "react-native";

type ArtistsPageProps = {
  artist: Artist;
};
export default function ArtistsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artist, setArtist] = useState<Artist>();
  const [songs, setSongs] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { artistId } = usePlayer();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Запускаем запросы параллельно, чтобы было быстрее
      const [resArtist, resAlbums] = await Promise.all([
        fetch(`http://${IP_back}:4444/artists/artist/${artistId}`),
        fetch(`http://${IP_back}:4444/artists/albums/${artistId}`),
      ]);

      const artistData = await resArtist.json();
      const albumsData = await resAlbums.json();

      setArtist(artistData);
      // setAlbums(albumsData);
    } catch (error) {
      console.error("Error fetching artist data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopSongs = async () => {
    try {
      const res = await fetch(
        `http://${IP_back}:4444/artists/artist/top/${artistId}`,
      );
      const data = await res.json();
      setSongs(data);
    } catch (e) {
      console.log("Error loading top tracks", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      fetchTopSongs()
    }, [artistId]),
  );

  if (isLoading || !artist) {
    return <ArtistSkeleton />;
  }
  return (
    <ScrollView
      bounces={false}
      contentContainerClassName="w-full items-center gap-3 pb-10"
    >
      <Image
        source={{ uri: artist.image }}
        className="w-full h-96 rounded-b-[60px]"
      />
      <Text className="font-satoshi-bold text-3xl mt-4">{artist.name}</Text>
      <Text className="font-satoshi text-gray-500 text-lg">
        {albums.length} Albums
      </Text>

      <Text className="w-full px-10 font-satoshi-bold text-2xl mt-4">
        Albums
      </Text>
      <View className="h-80 w-full">
        <AlbumsBlock albums={albums} />
      </View>

      <Text className="w-full px-10 font-satoshi-bold text-xl mt-4">
        Top Songs
      </Text>
      <PlayList songs={songs}/>
    </ScrollView>
  );
}

function ArtistSkeleton() {
  return (
    <View className="w-full items-center gap-4">
      {/* Заглушка для большого фото */}
      <View className="w-full h-96 bg-gray-200 dark:bg-white/5 rounded-b-[60px]" />

      {/* Заглушка для имени */}
      <View className="w-64 h-8 bg-gray-200 dark:bg-white/5 rounded-full mt-4" />

      {/* Заглушка для текста альбомов */}
      <View className="w-32 h-5 bg-gray-200 dark:bg-white/5 rounded-full" />

      {/* Заглушка для блока альбомов */}
      <View className="flex-row gap-4 px-10 mt-6">
        <View className="w-40 h-52 bg-gray-200 dark:bg-white/5 rounded-[30px]" />
        <View className="w-40 h-52 bg-gray-200 dark:bg-white/5 rounded-[30px]" />
      </View>
    </View>
  );
}
