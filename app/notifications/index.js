import React, { useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

import { useAuthContext } from "@/hooks/AuthProvider";
import { Link, useRouter } from "expo-router";
import avatarImages from "@/constants/avatar";
import { Entypo } from "@expo/vector-icons";
//import Notification from "../../assets/PhotosAssets/notifications.webp";

const Notifications = () => {
    const navigation = useRouter();
    const { notifications, userNotifications } = useAuthContext();

    return (
        <View className="bg-white w-full">

            <View className='h-[52px] flex-row items-center justify-between px-[15px] w-full bg-white'>
                <View>
                    <Image
                        source={avatarImages["5"]}
                        className='rounded-full w-[40px] h-[40px]'
                    />
                </View>
                <View className='flex-row'>
                    <Link href="/notifications">
                        <Entypo name="bell" size={28} color="black" className='px-[]' />
                    </Link>
                </View>
            </View>

            <ScrollView className="bg-gray-50 w-full mx-auto px-6">
                <View className="flex-row items-center text-rose-600">
                    <Text className="text-[24px] font-[700] text-start">Notifications</Text>
                </View>

                <View className="h-[2px] bg-rose-300 rounded-lg my-[15px] mb-[35px]" />

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
                                {notification.checkInOut} has been
                                <Text
                                    className={`scale-[0.9] mt-[5px] px-[8px] font-[700] underline ${notification.UpdatedStatus === "approved"
                                        ? "text-green-800"
                                        : notification.UpdatedStatus === "rejected"
                                            ? "text-red-600"
                                            : "text-yellow-700"
                                        }`}
                                >
                                    {notification.UpdatedStatus}
                                </Text>{" "}
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
                        <View
                            key={index}
                            className="bg-white border border-gray-300 shadow-md rounded-[15px] lg:px-[20px] py-[15px] flex flex-col"
                        >
                            <View className=""> 
                                <Text className="text-[16px] ml-[5px] text-rose-700 font-[500]">
                                    {notification.title}
                                    <Text
                                        className={`scale-[0.9] mt-[5px] uppercase font-[600] px-[12px] mx-[8px] pb-[2px] text-white rounded-[30px] text-[11px] ${notification.UpdatedStatus === "approved"
                                            ? "bg-green-400"
                                            : notification.UpdatedStatus === "pending"
                                                ? "bg-yellow-500"
                                                : notification.UpdatedStatus === "rejected"
                                                    ? "bg-red-300"
                                                    : "text-gray-800"
                                            }`}
                                    >
                                        {notification.UpdatedStatus}
                                    </Text>
                                </Text>
                            </View>
                            <Text className="ml-[15px] break-words text-[12px] mb-[8px] text-rose-600">
                                Your reservation for {notification.address} between{" "}
                                {notification.checkInOut} has been
                                <Text
                                    className={`scale-[0.9] mt-[5px] bg-green-900 px-[15px] mx-[8px] font-[700] underline ${notification.UpdatedStatus === "approved"
                                        ? "text-green-500"
                                        : notification.UpdatedStatus === "rejected"
                                            ? "text-red-500"
                                            : "text-yellow-500"
                                        }`}
                                >
                                    {notification.UpdatedStatus}
                                </Text>{" "}
                                by Host {notification.host}.
                            </Text>
                            <Link href={notification.listingId} >
                                <Text className="ml-[48px] text-rose-700 underline underline-offset-2 font-[500] mt-[4px] text-start">
                                    See Listing
                                </Text>
                            </Link>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default Notifications;
