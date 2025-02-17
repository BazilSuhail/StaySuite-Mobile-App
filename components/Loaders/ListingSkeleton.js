import { View } from 'react-native'

const ListingSkeleton = () => {
    return (
        <View className="w-full mt-[15px]">
            <View className="w-full h-[200px] bg-gray-200 rounded-lg"></View>
            <View className="w-[160px] h-[10px] mt-[10px] bg-gray-200 rounded-lg"></View>
            <View className="w-[160px] h-[10px] mt-[10px] bg-gray-200 rounded-lg"></View>
            <View className="flex-row justify-between items-center">
                <View className="w-[120px] h-[30px] mt-[12px] bg-gray-200 rounded-md"></View>
                <View className="w-[120px] h-[30px] mt-[12px] bg-gray-200 rounded-md"></View>
            </View>
        </View>
    )
}
export default ListingSkeleton;
