import React, { createContext, useContext, useState, useEffect } from "react";
import { Audio, AVPlaybackStatus } from "expo-av";
import PlayList from "./ui/PlayList";
import { IP_back } from "./interfaces";

interface Track {
  id: number;
  title: string;
  artist: string;
  image: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number; // Текущее время в мс
  duration: number; // Длительность в мс
  playTrack: (track: Track, tracks?: Track[]) => Promise<void>;
  pauseResume: () => Promise<void>;
  seek: (millis: number) => Promise<void>;
  playNext: () => void; // Новая функция
  playPrevious: () => void; // Новая функция
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]); // Храним текущий плейлист
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Функция обновления статуса
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) setIsPlaying(false);
    }
  };

  async function playTrack(track: Track, tracks: Track[] = []) {
    try {
      if (sound) await sound.unloadAsync();

      // Если передан новый список песен, запоминаем его
      
      if (tracks.length > 0) setPlaylist(tracks);

      const response = await fetch(
        `http://${IP_back}:4444/songs/${track.id}`,
      );
      const data = await response.json();

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: data.url },
        { shouldPlay: true },
        onPlaybackStatusUpdate, // Подключаем отслеживание времени
      );

      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (error) {
      console.error("Playback error:", error);
    }
  }

  const playNext = () => {
    if (playlist.length === 0 || !currentTrack) return;

    // Находим индекс текущей песни
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    // Берем следующую (если последняя — включаем первую)
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  };

  const playPrevious = () => {
    if (playlist.length === 0 || !currentTrack) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex]);
  };

  async function pauseResume() {
    if (!sound) return;
    isPlaying ? await sound.pauseAsync() : await sound.playAsync();
  }

  // Функция перемотки
  async function seek(millis: number) {
    if (sound) await sound.setPositionAsync(millis);
  }

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        position,
        duration,
        playTrack,
        pauseResume,
        seek,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
};
