export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  image: string;
  url: string;
}

export interface Album {
  id: number;
  title: string;
  image: string;
  artist: {
    id: number;
    name: string;
  };
}

export interface Artist {
  id: number;
  name: string;
  image: string;
}

export const IP_back = "172.20.10.3";

export interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  playTrack: (track: Track, tracks?: Track[]) => Promise<void>;
  pauseResume: () => Promise<void>;
  seek: (millis: number) => Promise<void>;
  playNext: (step: number) => void;
  isShuffled: boolean;
  isRepeatMode: boolean;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  artistId: number;
  setArtistId: React.Dispatch<React.SetStateAction<number>>;
}
