import SpotifySVG_2 from '@/assets/svg/Spotify_2';
import { View, TouchableOpacity, Text } from 'react-native';

export default function Profile() {
    
  
  return (
      <View className='flex-1 w-full h-full'>
            <View className='h-full w-full items-center justify-center -mt-20 gap-6'>
                <SpotifySVG_2/>
                <Text className='text-[#383838] dark:text-white text-center font-satoshi-bold
                                        text-3xl mt-12 mb-3'>
                                        Work In Progress
                </Text>
                <Text className='text-gray-500 text-center font-satoshi
                                    text-2xl'>
                                    Just Enjoy What You Have.
                </Text>
            </View>
        </View>
  );
}