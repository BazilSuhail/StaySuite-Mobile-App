import { View, Text, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';
import avatarImages from '@/constants/avatar';
import { useAuthContext } from '@/hooks/AuthProvider';

export const Header = ({ heading }) => {
    const { user } = useAuthContext();
    return (
        <View className='h-[52px] flex-row items-center justify-between px-[15px] w-full bg-white'>
            <View>
                {heading === "home" ?
                    <Image
                        source={avatarImages["5"]}
                        className='rounded-full w-[40px] h-[40px]'
                    /> :
                    <Text className='text-[20px] font-[600]'>{heading}</Text>
                }
            </View>

            <View className='flex-row'>
                {/*<Image
            source={avatarImages[user.profilePicture]}
            className='rounded-full w-[36px] h-[36px]'
          />*/}
           <View>
                {heading === "Profile" &&
                    <Image
                        source={avatarImages["5"]}
                        className='rounded-full w-[40px] h-[40px]'
                    />
                }
            </View>
                <Link href="/notifications">
                    <Entypo name="bell" size={28} color="black" className='px-[]' />
                </Link>
            </View>
        </View>
    );
};



