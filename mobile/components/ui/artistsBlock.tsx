import { useEffect, useState } from "react";
import { FlatList, View, Text, Image, TouchableOpacity } from "react-native";
import { Artist, IP_back } from "../interfaces";
import { usePlayer } from "../contextPlayer";

export default function ArtistsBlock() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const { setArtistId } = usePlayer();

  const fetchArtists = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://${IP_back}:4444/artists/chart`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error("Failed to load artists", error);
    } finally {
      setIsLoading(false); // Выключаем загрузку в любом случае
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  // Компонент заглушки (Skeleton)
  const SkeletonItem = () => (
    <View className="gap-3 m-3 w-44">
      <View className="w-44 h-48 rounded-[30px] bg-gray-200 dark:bg-white/10" />
      <View className="ml-2 w-32 h-6 rounded-md bg-gray-200 dark:bg-white/10" />
    </View>
  );

  return (
    <FlatList
      // Если загрузка идет, передаем массив из 5 пустых элементов
      data={isLoading ? [1, 2, 3, 4, 5] as any: artists}
      horizontal={true}
      keyExtractor={(item, index) => isLoading ? index.toString() : item.id.toString()}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        if (isLoading) return <SkeletonItem />;

        return (
          <TouchableOpacity
            className="gap-3 m-3 w-44"
            onPress={() => setArtistId(item.id)}
          >
            <Image
              source={{ uri: item.image }}
              className="w-44 h-48 rounded-[30px]"
            />
            <Text className="ml-2 font-satoshi-bold text-xl w-44" numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}