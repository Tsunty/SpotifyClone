import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Eye from '@/assets/svg/Eye';
import EyeOff from '@/assets/svg/EyeOff';

interface AppInputProps {
  placeholder: string;
  isPassword?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function AppInput({ placeholder, isPassword, value, onChangeText }: AppInputProps) {
  const [secure, setSecure] = useState(isPassword);

  return (
    <View className="w-full h-full relative justify-center mb-4">
      <TextInput
        className="w-full h-full px-8 rounded-[30px] border border-gray-300 dark:border-gray-800 
                   text-[#383838] dark:text-white font-satoshi-bold text-xl"
        placeholder={placeholder}
        placeholderTextColor="#A7A7A7"
        secureTextEntry={secure}
        value={value}
        onChangeText={onChangeText}
      />
      
      {isPassword && (
        <TouchableOpacity 
          className="absolute right-8"
          onPress={() => setSecure(!secure)}
        >
          {secure ? <EyeOff/> : <Eye/>}
        </TouchableOpacity>
      )}
    </View>
  );
}