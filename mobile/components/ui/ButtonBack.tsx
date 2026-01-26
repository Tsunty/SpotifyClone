import SpotifySVG_2 from '@/assets/svg/Spotify_2';
import BackSvg from '@/assets/svg/VectorBack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, TouchableOpacity, View } from 'react-native';

export default function ButtonBack() {
  const router = useRouter();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
      } catch (e) {
        console.log("Ошибка загрузки темы", e);
      }
    };

    loadTheme();
  }, []);

  return (<TouchableOpacity 
            className={`${ theme == 'light'? 'bg-black/5': 'bg-white/5'} absolute top-16 left-6 
                        w-10 h-10 rounded-full 
                        items-center justify-center`}
            onPress={() => router.back()}
            ><BackSvg/>
    </TouchableOpacity>
  );
}
