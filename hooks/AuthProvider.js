import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/Config/Config";
import { useRouter } from "expo-router";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [searchfilters, setSearchFilters] = useState({});
  const [userNotifications, setUserNotifications] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [toast, setToast] = useState({ message: "", visible: false });
  const toastTimeoutRef = useRef(null);

  const validateToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp && Date.now() < payload.exp * 1000;
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(
        `${config.BACKEND_URL}/air-bnb/profile/user-info`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      //console.log(response.data)
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Error fetching user data:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const fetchUserNotifications = async (token) => {
    try {
      const response = await axios.get(
        `${config.BACKEND_URL}/air-bnb/profile/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const connectSocket = (token) => {
    if (socket) {
      socket.disconnect();
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    const newSocket = io(config.BACKEND_URL, {
      auth: { token, userId },
    });

    newSocket.on("connect", () => {
      //console.log(`Connected to server with socket ID: ${newSocket.id}`);
    });

    newSocket.on("notification", (data) => {
      setNotifications((prev) => [...prev, data]);
      showToast(data.message);
      setNotificationsCount((prev) => prev + 1);
    });

    newSocket.on("disconnect", () => {
      //console.log("Disconnected from server");
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        if (validateToken(token)) {
          fetchUserData(token);
          fetchUserNotifications(token);
          connectSocket(token);
        } else {
          handleLogout();
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const login = async (token) => {
    //console.log(token)
    await AsyncStorage.setItem("token", token);
    //console.log("aaaa")
    await fetchUserData(token);
    connectSocket(token);
    router.replace("/profile");
  };
 

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
      setUserRole(null);
      setNotifications([]);
      if (socket) {
        socket.disconnect();
      }
      setSocket(null); 
      router.replace("/authentication/signIn");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const logout = () => {
    handleLogout();
  };

  const showToast = (message) => {
    setToast({ message, visible: true });
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ message: "", visible: false });
    }, 6000);
  };

  const closeToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message: "", visible: false });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        login,
        logout, 
        socket,
        notifications,
        notificationsCount,
        userNotifications,
        setSearchFilters,
        searchfilters,
        toast,
        showToast,
        closeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
