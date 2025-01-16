import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

import { useAuthContext } from "@/hooks/AuthProvider";
import { Link, useRouter } from "expo-router";
import avatarImages from "@/constants/avatar";
import { Entypo } from "@expo/vector-icons";
import { Header } from "@/components/Header";
//import Notification from "../../assets/PhotosAssets/notifications.webp";


const NotificationTile = ({ notification }) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push(notification.listingId)}
            className="bg-white border border-gray-300 shadow-md rounded-[15px] p-4 mb-4"
        >
            <View className="flex-row items-center">
                {/* Status Indicator */}
                <View
                    className={`h-[10px] w-[10px] rounded-full mr-3 ${notification.UpdatedStatus === "approved"
                        ? "bg-green-500"
                        : notification.UpdatedStatus === "rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                />
                {/* Notification Title */}
                <Text className="font-[600] text-gray-700 flex-1">{notification.address}</Text>
            </View>

            <Text className="text-[13px] text-gray-600 mt-2">
                Reservation for{" "}
                <Text className="font-[600] text-gray-800">{notification.address}</Text> between{" "}
                {notification.checkInOut} has been{" "}
                <Text
                    className={`font-[700] underline ${notification.UpdatedStatus === "approved"
                        ? "text-green-600"
                        : notification.UpdatedStatus === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                >
                    {notification.UpdatedStatus}
                </Text>{" "}
                by Host {notification.host}.
            </Text>
        </TouchableOpacity>
    );
};



const Notifications = () => {
    const navigation = useRouter();
    const { notifications, userNotifications } = useAuthContext();

    return (
        <View className="bg-white w-full">


            <Header heading={"Notifications"} />
            <ScrollView className="bg-gray-50 pt-[15px] pb-[45px] w-full mx-auto px-[15px]">

                <View className="flex flex-col space-y-[15px]">
                    {userNotifications.length === 0 && notifications.length === 0 && (
                        <View className="min-h-screen w-full flex justify-center items-center mix-blend-multiply mt-[-250px]">
                            {/*<Image
                source={Notification}
                resizeMode="contain"
                className="scale-[0.55] md:scale-[0.4]"
              />*/}
                        </View>
                    )}

                    {notifications.map((notification, index) => (
                        <View
                            key={index}
                            className="border-b-[2px] border-rose-700 lg:px-[20px] py-[15px] flex flex-col"
                        >
                            <View className="flex-row items-center">
                                <View className="w-[32px] h-[32px] md:w-[38px] md:h-[38px] rounded-full flex items-center justify-center text-[28px] bg-rose-800 text-rose-100">

                                </View>
                                <Text className="text-[16px] ml-[5px] text-rose-700 font-[500]">
                                    {notification.title}
                                    <Text
                                        className={`scale-[0.9] mt-[5px] uppercase font-[600] px-[12px] mx-[8px] pb-[2px] text-white rounded-[30px] text-[13px] ${notification.UpdatedStatus === "approved"
                                            ? "bg-green-800"
                                            : notification.UpdatedStatus === "pending"
                                                ? "bg-yellow-600"
                                                : notification.UpdatedStatus === "rejected"
                                                    ? "bg-red-800"
                                                    : "text-gray-800"
                                            }`}
                                    >
                                        {notification.UpdatedStatus}
                                    </Text>
                                </Text>
                            </View>
                            <Text className="ml-[48px] break-words">
                                Your reservation for {notification.address} between{" "}
                                {notification.checkInOut} has been {" "}
                                <Text
                                    className={`scale-[0.9] mt-[5px] px-[8px] font-[700] underline ${notification.UpdatedStatus === "approved"
                                        ? "text-green-800"
                                        : notification.UpdatedStatus === "rejected"
                                            ? "text-red-600"
                                            : "text-yellow-700"
                                        }`}
                                >
                                    {notification.UpdatedStatus}
                                </Text>
                                {" "}
                                by Host {notification.host}.
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Listing", { id: notification.listingId })}
                            >
                                <Text className="ml-[48px] text-rose-700 underline underline-offset-2 font-[500] mt-[4px] text-start">
                                    See Listing
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {userNotifications.map((notification, index) => (
                         <NotificationTile key={index} notification={notification} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default Notifications;
