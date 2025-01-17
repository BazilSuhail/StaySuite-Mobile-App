
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';


export const Listing = ({ item, router }) => {
    return (
        <TouchableOpacity
            onPress={() => router.push(`/${item._id}`)} // Using useRouter for navigation
            className='rounded-[12px] pb-[15px] mx-[15px] overflow-hidden mt-[20px] border-[1px] border-gray-300 shadow-sm bg-white '
        >
            <Image
                source={
                    item.images.placePicture
                        ? { uri: item.images.placePicture }
                        : { uri: 'https://via.placeholder.com/300' }
                } className='h-[200px] w-full'
                resizeMode="cover"
            />

            <View className='px-[15px] mt-[8px]'>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: '600', fontSize: 16 }}>
                        {item.address.suburb.substring(0, 8)}, {item.address.country.substring(0, 8)}
                    </Text>
                    {item.rating > 0 && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text className='font-[600]'>{item.rating} </Text>
                            <AntDesign name="star" size={17} color="#6b7280" />
                        </View>
                    )}
                </View>
                <View className='flex-row items-center justify-between mt-[12px]'>
                    <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                        ${item.price} <Text className='text-gray-500 text-[13px]'>/night</Text>
                    </Text>
                    <Text className='text-white mt-[6px] bg-gray-400 w-[75px] font-[700] text-center text-[10px] rounded-md py-[2px]'>
                        {item.property_type}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};
