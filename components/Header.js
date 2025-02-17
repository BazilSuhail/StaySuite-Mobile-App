import { View, Text, Image, Pressable } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import avatarImages from '@/constants/avatar';
import logo from '@/assets/images/icon.png';
import { useAuthContext } from '@/hooks/AuthProvider';

export const Header = ({ heading }) => {
    const router = useRouter();
    const { logout, userRole } = useAuthContext();
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <View className='h-[52px] flex-row items-center justify-between px-[15px] w-full bg-white'>
            <View>
                {heading === "home" ?
                    <Image source={logo} className='rounded-full w-[40px] h-[38px]' /> :
                    <Text className='text-[20px] font-[600]'>{heading}</Text>
                }
            </View>

            <View className='flex-row'>
                {heading === "Profile" &&
                    <Pressable onPress={handleLogout}>
                        <Text><MaterialCommunityIcons name="logout" size={27} color="red" />{"  "}</Text>
                    </Pressable>
                }
                {userRole === 'Guest' && (
                    <Link href="/notifications">
                        <Entypo name="bell" size={28} color="black" />
                    </Link>
                )}

            </View>
        </View>
    );
};



