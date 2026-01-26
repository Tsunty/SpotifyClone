import SpotifySVG_2 from '@/assets/svg/Spotify_2';
import ButtonBack from '@/components/ui/ButtonBack';
import { useRouter } from 'expo-router';
import { ImageBackground, TouchableOpacity, View, Text, Image } from 'react-native';

export default function SignUp() {
  const router = useRouter();

  return (
      <View className='flex-1 w-full h-full'>
        <View pointerEvents="none" 
            className='w-full h-full absolute z-10 justify-end'>
            <Image source={require('@/assets/images/Billie/Auth.png')}
            className='w-full h-full'
            resizeMode="contain"
            />
        </View>
            <ButtonBack/>
            <View className='h-full w-full items-center justify-center -mt-20 gap-6'>
                <SpotifySVG_2/>
                <Text className='text-[#383838] dark:text-white text-center font-satoshi-bold
                                        text-3xl mt-12 mb-3'>
                                        Enjoy Listening To Music
                </Text>
                <Text className='text-gray-500 text-center font-satoshi
                                    text-2xl'>
                                    Spotify is a proprietary Swedish audio streaming and media services provider 
                </Text>
                <View className='flex flex-row justify-around w-4/5 mt-8'>
                    <TouchableOpacity 
                        className="bg-[#42C83C] w-1/2 h-24 rounded-[30px] items-center justify-center"
                        onPress={() => router.push('/signUp')}
                        >
                        <Text className="text-white font-satoshi-medium text-2xl">Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className="w-1/2 h-24 rounded-[30px] items-center justify-center"
                        onPress={() => router.push('/signIn')}
                        >
                        <Text className="dark:text-white text-[#383838] font-satoshi-medium text-2xl">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>
  );
}
