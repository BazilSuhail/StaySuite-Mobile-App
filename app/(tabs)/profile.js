import { useState, useEffect } from 'react';
import axios from 'axios';
import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import config from '@/Config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from "@expo/vector-icons";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Avatar code 
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/air-bnb/auth/login`,
          { email: 'bazil@gmail.com', password: '112233' }
        );
        
        const token = await AsyncStorage.getItem('token');
        console.log(token)
        const response = await axios.get(`${config.BACKEND_URL}/air-bnb/profile/user-info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("sdssd")

        setUserInfo(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching profile data');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "city" || name === "country") {
      setUpdatedData({
        ...updatedData,
        location: {
          ...userInfo.location,
          ...updatedData.location,
          [name]: value,
        },
      });
    }
    else {
      setUpdatedData({
        ...updatedData,
        [name]: value,
      });
    }
  };

  const handleArrayDelete = (attribute, value) => {
    setUpdatedData({
      ...updatedData,
      [attribute]: (updatedData[attribute] || userInfo[attribute] || []).filter((item) => item !== value),
    });
  };

  const openAvatarModal = () => {
    setIsAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };

  const selectAvatar = (index) => {
    setSelectedAvatar(index);
    /*setUpdatedData({
        ...updatedData,
        profilePicture: index,
    });*/
    closeAvatarModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await AsyncStorage.getItem('token');
      const updatedProfile = { ...updatedData, profilePicture: selectedAvatar || userInfo.profilePicture }; // Include avatar in profile update
      const response = await axios.put(`${config.BACKEND_URL}/air-bnb/profile/update-info`, updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Error updating profile data');
    }
  };


  if (loading) {
    return <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text>Loading...</Text>
    </View>;
  }

  if (error) {
    return <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text>{error}...</Text>
    </View>;
  }

  const addNewField = (attribute) => {
    setUpdatedData({
      ...updatedData,
      [attribute]: [...(updatedData[attribute] || userInfo[attribute] || []), ''],
    });
  };

  const updateFieldValue = (attribute, index, value) => {
    const updatedArray = [...(updatedData[attribute] || userInfo[attribute] || [])];
    updatedArray[index] = value;
    setUpdatedData({
      ...updatedData,
      [attribute]: updatedArray,
    });
  };
  const calculateTimeAgo = () => {
    const reviewDate = new Date(userInfo.createdAt);
    const now = new Date();
    const timeDiff = now - reviewDate;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years >= 1) {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months >= 1) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <ScrollView className='px-6 min-h-screen bg-gray-100 pt-[110px] lg:pt-[150px]'>
      {isEditing ?
        <View style={{ flex: 1, backgroundColor: "#f8f8f8", padding: 16 }}>
          {/* Left Section */}
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                padding: 20,
                backgroundColor: "white",
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                marginBottom: 16,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{
                    uri: `/Avatars/${selectedAvatar || userInfo.profilePicture}.jpg`,
                  }}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 48,
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                />
                <TouchableOpacity
                  onPress={openAvatarModal}
                  style={{
                    marginTop: 8,
                    backgroundColor: "#1e3a8a",
                    paddingVertical: 4,
                    paddingHorizontal: 16,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>Change Avatar</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 8 }}>
                  {userInfo.username}
                </Text>
                <Text
                  style={{
                    backgroundColor: "#6b7280",
                    color: "#f3f4f6",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 16,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {userInfo.role}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
                  {(() => {
                    const reviewDate = new Date(userInfo.createdAt);
                    const now = new Date();
                    const timeDiff = now - reviewDate;

                    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    const months = Math.floor(days / 30);
                    const years = Math.floor(days / 365);

                    if (years >= 1) {
                      return `${years} year${years > 1 ? "s" : ""} ago`;
                    } else if (months >= 1) {
                      return `${months} month${months > 1 ? "s" : ""} ago`;
                    } else {
                      return `${days} day${days > 1 ? "s" : ""} ago`;
                    }
                  })()}
                </Text>
                <Text style={{ color: "#e11d48", fontWeight: "700" }}>
                  On Airbnb
                </Text>
              </View>
            </View>

            <View
              style={{
                padding: 20,
                backgroundColor: "white",
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
                {userInfo.username}'s confirmed information status
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <FontAwesome5
                  name="check-circle"
                  size={16}
                  color={userInfo.phoneNumber ? "green" : "#6b7280"}
                />
                <Text style={{ marginLeft: 8, fontSize: 14, color: "#6b7280" }}>
                  Phone number:{" "}
                  <Text style={{ fontWeight: "500" }}>
                    {userInfo.phoneNumber || "Not provided"}
                  </Text>
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 16 }}>
                  Verify your identity
                </Text>
                <Text style={{ fontSize: 14, color: "#6b7280", marginVertical: 8 }}>
                  Before you book or host on Airbnb, you must complete this step.
                </Text>
              </View>
            </View>
          </View>

          {/* Right Section */}
          <View>
            <View
              style={{
                padding: 20,
                backgroundColor: "white",
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>About User</Text>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: "#1f2937",
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>Done</Text>
                </TouchableOpacity>
              </View>

              {/* Add more fields below */}
              <View>
                <TextInput
                  placeholder="Fullname"
                  value={updatedData.fullName || userInfo.fullName || ""}
                  onChangeText={(value) =>
                    handleChange({ target: { name: "fullName", value } })
                  }
                  style={{
                    borderColor: "#d1d5db",
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 8,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        :
        <View contentContainerStyle={styles.container}>
          <View style={[styles.section, styles.leftSection]}>
            <View style={styles.profileCard}>
              <View style={styles.profileInfo}>
                <Image
                  source={{ uri: `/Avatars/${selectedAvatar || userInfo.profilePicture}.jpg` }}
                  style={styles.avatar}
                />
                <Text style={styles.username}>{userInfo.username}</Text>
                <Text style={styles.role}>{userInfo.role}</Text>
              </View>
              <View style={styles.profileStatus}>
                <Text style={styles.text18}>{calculateTimeAgo()}</Text>
                <Text style={styles.onAirbnb}>On Airbnb</Text>
              </View>
            </View>

            <View style={styles.confirmationCard}>
              <Text style={styles.cardHeader}>Bazil's confirmed information status</Text>
              <View style={styles.infoItem}>
                <FontAwesome5 name="check-circle" size={16} color="green" />
                <Text style={styles.infoText}>
                  Phone number: <Text style={styles.bold}>{userInfo.phoneNumber || 'Not Provided'}</Text>
                </Text>
              </View>

              <Text style={styles.verifyHeader}>Verify your identity</Text>
              <Text style={styles.verifyDescription}>
                Before you book or host on Airbnb, you must complete this step.
              </Text>
              <TouchableOpacity style={styles.verifyButton}>
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.aboutCard}>
              <View style={styles.headerContainer}>
                <Text style={styles.cardHeader}>About Bazil</Text>
                <TouchableOpacity onPress={() => console.log('Edit Profile')}>
                  <Text style={styles.editButton}>Edit profile</Text>
                </TouchableOpacity>
              </View>
              <Text><Text style={styles.bold}>Fullname:</Text> {userInfo.fullName}</Text>
              <Text><Text style={styles.bold}>Email:</Text> {userInfo.email}</Text>
              <Text><Text style={styles.bold}>About:</Text> {userInfo.about}</Text>
              <Text><Text style={styles.bold}>Occupation:</Text> {userInfo.occupation}</Text>
              <Text><Text style={styles.bold}>Location:</Text> {userInfo.location.city}, {userInfo.location.country}</Text>
            </View>

            <View style={styles.languagesCard}>
              <Text style={styles.cardHeader}>Ask Me In</Text>
              <View style={styles.languageList}>
                {userInfo.languages && userInfo.languages.length > 0 ? (
                  userInfo.languages.map((language, index) => (
                    <Text key={index} style={styles.languageItem}>{language}</Text>
                  ))
                ) : (
                  <Text style={styles.noInfo}>No languages available.</Text>
                )}
              </View>

              <Text style={styles.interestsHeader}>Interest</Text>
              <View style={styles.interestList}>
                {userInfo.interests && userInfo.interests.length > 0 ? (
                  userInfo.interests.map((interest, index) => (
                    <Text key={index} style={styles.interestItem}>{interest}</Text>
                  ))
                ) : (
                  <Text style={styles.noInfo}>No interests added.</Text>
                )}
              </View>

              <View style={styles.socialLinksContainer}>
                <Text style={styles.socialLinksText}>Found Me at:</Text>
                <View style={styles.socialIcons}>
                  {userInfo.socialLinks?.facebook && (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(userInfo.socialLinks.facebook)}
                      style={[styles.socialIcon, styles.facebookIcon]}>
                      <FontAwesome5 name="facebook-f" size={18} color="white" />
                    </TouchableOpacity>
                  )}
                  {userInfo.socialLinks?.instagram && (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(userInfo.socialLinks.instagram)}
                      style={[styles.socialIcon, styles.instagramIcon]}>
                      <FontAwesome5 name="instagram" size={18} color="white" />
                    </TouchableOpacity>
                  )}
                  {userInfo.socialLinks?.linkedin && (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(userInfo.socialLinks.linkedin)}
                      style={[styles.socialIcon, styles.linkedinIcon]}>
                      <FontAwesome5 name="linkedin-in" size={18} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      }
      {/* Avatar Selection Modal 
      {isAvatarModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <motion.div
            className='bg-white p-6 rounded-lg shadow-lg'
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <h2 className='text-xl font-bold mb-4'>Select an Avatar</h2>
            <div className='grid grid-cols-3 lg:grid-cols-4 gap-4'>
              {Array.from({ length: 12 }).map((_, index) => (
                <img
                  key={index}
                  src={`/Avatars/${index + 1}.jpg`}
                  alt={`Avatar ${index + 1}`}
                  className='w-24 h-24 rounded-full border border-gray-300 shadow-md cursor-pointer hover:opacity-75'
                  onClick={() => selectAvatar(index + 1)}
                />
              ))}
            </div>
            <button
              onClick={closeAvatarModal}
              className='mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
            >
              Close
            </button>
          </motion.div>
        </div>
      )}*/}
    </ScrollView >
  );
};

export default Profile; 