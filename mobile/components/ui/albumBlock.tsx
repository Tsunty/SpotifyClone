import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Album, IP_back, Track } from "../interfaces";
import BackSvg from "@/assets/svg/VectorBack";
import PlayList from "./PlayList";
import { useFocusEffect } from "expo-router";

type AlbumsBlockProp = {
  albums: Album[];
};
export default function AlbumsBlock({ albums }: AlbumsBlockProp) {
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);

  // Определяем, идет ли еще загрузка (если массив пришел пустой)
  // В идеале isLoading лучше прокидывать как пропс сверху, но можно и так:
  const isLoading = albums.length === 0;

  // Компонент заглушки для одного альбома
  const SkeletonAlbum = () => (
    <View className="gap-2 m-3 w-44">
      <View className="w-44 h-48 rounded-[30px] bg-gray-200 dark:bg-white/5" />
      <View className="h-6 w-32 self-center rounded bg-gray-200 dark:bg-white/5 mt-1" />
      <View className="h-4 w-24 self-center rounded bg-gray-200 dark:bg-white/5" />
    </View>
  );

  return (
    <>
      <FlatList
        // Подменяем данные на массив чисел для скелетонов
        data={isLoading ? ([1, 2, 3, 4] as any) : albums}
        horizontal={true}
        keyExtractor={(item, index) =>
          isLoading ? index.toString() : item.id.toString()
        }
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          if (isLoading) return <SkeletonAlbum />;

          return (
            <TouchableOpacity
              className="gap-2 m-3 w-44"
              onPress={() => setSelectedAlbumId(item.id)}
            >
              <Image
                source={{ uri: item.image }}
                className="w-44 h-48 rounded-[30px]"
              />
              <Text
                className="font-satoshi-bold text-xl w-44 px-2 text-center"
                numberOfLines={2}
              >
                {item.title}
              </Text>
              {item.artist && (
                <Text
                  className="font-satoshi text-xl w-44 px-2 text-center text-gray-500"
                  numberOfLines={1}
                >
                  {item.artist.name}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
      />

      <AlbumModal
        albumID={selectedAlbumId}
        onClose={() => setSelectedAlbumId(null)}
      />
    </>
  );
}
type AlbumModalProps = {
  albumID: number | null; // Может быть null
  onClose: () => void;
};
function AlbumModal({ albumID, onClose }: AlbumModalProps) {
  const [songs, setSongs] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Новый стейт

  useEffect(() => {
    if (albumID) {
      fetchSongs(albumID);
    } else {
      setSongs([]);
    }
  }, [albumID]);

  const fetchSongs = async (id: number) => {
    setIsLoading(true); // Включаем загрузку
    try {
      const response = await fetch(`http://${IP_back}:4444/albums/album/${id}`);
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error("Failed to load songs", error);
    } finally {
      setIsLoading(false); // Выключаем загрузку
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={albumID !== null}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white dark:bg-[#0D0C0C]">
        <TouchableOpacity
          onPress={onClose}
          className="bg-black/5 dark:bg-white/10 absolute left-8 top-16 w-10 h-10 rounded-full items-center justify-center z-10"
        >
          <BackSvg />
        </TouchableOpacity>

        <View className="mt-32 flex-1">
          {isLoading ? (
            // Заглушка списка песен
            <View className="px-8 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <View key={i} className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-white/5" />
                  <View className="gap-2">
                    <View className="w-40 h-4 rounded bg-gray-200 dark:bg-white/5" />
                    <View className="w-24 h-3 rounded bg-gray-200 dark:bg-white/5" />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <PlayList songs={songs} />
          )}
        </View>
      </View>
    </Modal>
  );
}
