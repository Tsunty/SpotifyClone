import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Artist, IP_back, PlayerContextType, Track } from "./interfaces";

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeatMode, setIsRepeatMode] = useState(false);
  const [originalPlaylist, setOriginalPlaylist] = useState<Track[]>([]);
  const [artistId, setArtistId] = useState<number>(13);

  const playlistRef = useRef(playlist);
  const currentTrackRef = useRef(currentTrack);

  useEffect(() => {
    playlistRef.current = playlist;
    currentTrackRef.current = currentTrack;
  }, [playlist, currentTrack]);

  ////////////////////////////////////////////////////////// Настройки аудио //////////////////////////////////////////////////////////
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,

          allowsRecordingIOS: false,
          interruptionModeIOS: 1,
          playsInSilentModeIOS: true,

          shouldDuckAndroid: true,
          interruptionModeAndroid: 1,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.error("Audio mode setup error:", e);
      }
    };
    setupAudio();
  }, []);

  ////////////////////////////////////////////////////////// Вперемешку //////////////////////////////////////////////////////////
  const toggleShuffle = () => {
    if (!isShuffled) {
      setOriginalPlaylist(playlist);
      const shuffled = [...playlist].sort(() => Math.random() - 0.5);
      setPlaylist(shuffled);
    } else {
      setPlaylist(originalPlaylist);
    }
    setIsShuffled(!isShuffled);
  };

  ////////////////////////////////////////////////////////// Повторение трека //////////////////////////////////////////////////////////
  const toggleRepeat = () => {
    setIsRepeatMode(!isRepeatMode);
  };

  ////////////////////////////////////////////////////////// Вперемешку //////////////////////////////////////////////////////////
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        if (isRepeatMode) {
          // Если режим "Повтор одного трека" — запускаем этот же трек заново
          sound?.replayAsync();
        }
      }
    }
  };

  ////////////////////////////////////////////////////////// Включение трека //////////////////////////////////////////////////////////
  async function playTrack(track: Track, tracks: Track[] = []) {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      if (tracks.length > 0) setPlaylist(tracks);

      // Получаем URL трека по его ID
      const response = await fetch(
        `http://${IP_back}:4444/songs/songID/${track.id}`,
      );
      const data = await response.json();

      // Включаем трек по URL
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: data.url },
        { shouldPlay: true },
        onPlaybackStatusUpdate,
      );

      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (error) {
      console.error("Playback error:", error);
    }
  }

  //////////////////////////////////////////////////////// Следующий или Предыдуший трек //////////////////////////////////////////////////////////
  const playNext = (step = 1) => {
    const currentPlaylist = playlistRef.current;
    const activeTrack = currentTrackRef.current;

    // Если плейлист закончился - останавливаемся
    if (currentPlaylist.length === 0 || !activeTrack) return;

    // Получаем Index текущего трека в плейлисте
    const currentIndex = currentPlaylist.findIndex(
      (t) => t.id === activeTrack.id,
    );
    let nextIndex;

    if (isShuffled) {
      // Режим SHUFFLE: выбираем случайный индекс, который не равен текущему
      // (если в плейлисте больше 1 песни)
      do {
        nextIndex = Math.floor(Math.random() * currentPlaylist.length);
      } while (nextIndex === currentIndex && currentPlaylist.length > 1);
    } else if (isRepeatMode) {
      // Если репит режим то индекс следующего трека оставется такой же
      nextIndex = currentIndex;
    } else {
      nextIndex = (currentIndex + step) % currentPlaylist.length;
      // Если это была последняя песня останавливаемся
      if (nextIndex === 0) {
        setIsPlaying(false);
        return;
      }
    }
    playTrack(currentPlaylist[nextIndex], currentPlaylist);
  };

  //////////////////////////////////////////////////////// Пауза //////////////////////////////////////////////////////////
  async function pauseResume() {
    if (!sound) return;
    isPlaying ? await sound.pauseAsync() : await sound.playAsync();
  }

  //////////////////////////////////////////////////////// Перемотка трека //////////////////////////////////////////////////////////
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
        isShuffled,
        isRepeatMode,
        toggleShuffle,
        toggleRepeat,
        artistId,
        setArtistId,
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
