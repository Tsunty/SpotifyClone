import { View, TouchableOpacity, Text } from 'react-native';
import SpotifySVG_1 from '../assets/svg/Spotify_1'
import SunLight from '../assets/svg/SunLight'
import MoonDark from '../assets/svg/MoonDark'
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/components/contextTheme';

export default function ChooseMode() {
    const router = useRouter();
    const { theme, setTheme } = useTheme(); // Берем глобальную тему

    const handleTheme = (choice: 'dark' | 'light') => {
        setTheme(choice); // Это обновит цвет во всем приложении сразу
    };

  return (
    <ImageBackground
      source={require('../assets/images/Billie/ChooseMode.png')}
      className="flex-1 w-full h-full"
      contentFit="cover"
    >
      <View className="py-20 w-full h-full justify-between items-center">
          <SpotifySVG_1 />
          <View className='w-4/5 flex gap-10'>
            <Text className='text-gray-300 text-center font-satoshi-bold
                              text-2xl'>
                                Choose Mode
            </Text>


            <View className='flex flex-row justify-evenly mb-8'>
                <View className='items-center gap-4'>
                    <TouchableOpacity 
                    className="bg-gray-800 w-24 h-24 rounded-full items-center justify-center"
                    onPress={() => handleTheme('dark')}
                    ><MoonDark/>
                    </TouchableOpacity>
                    <Text className="text-white font-satoshi-medium text-2xl">Dark Mode</Text>
                </View>

                <View className='items-center gap-4'>
                    <TouchableOpacity 
                    className="bg-gray-800 w-24 h-24 rounded-full items-center justify-center"
                    onPress={() => handleTheme('light')}
                    ><SunLight/>
                    </TouchableOpacity>
                    <Text className="text-white font-satoshi-medium text-2xl">Light Mode</Text>
                </View>
            </View>

            <TouchableOpacity 
              className="bg-[#42C83C] w-full h-24 rounded-[30px] items-center justify-center"
              onPress={() => router.push('/auth')}
            >
              <Text className="text-white font-satoshi-bold text-2xl">Continue</Text>
            </TouchableOpacity>
          </View>
      </View>
    </ImageBackground>
  );
}