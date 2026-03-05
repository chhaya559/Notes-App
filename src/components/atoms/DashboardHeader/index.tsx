import React, { useCallback, useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";

import { useGetNotificationsCountQuery } from "@redux/api/noteApi";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

import useTheme from "@hooks/useTheme";
import useStyles from "@hooks/useStyles";

export default function DashboardHeader() {
  const navigation = useNavigation<any>();

  const { toggleTheme, darkMode, Colors } = useTheme();
  const { dynamicStyles } = useStyles(styles);

  const isGuest = useSelector((state: RootState) => state.auth.isGuest);

  const profileImage = useSelector(
    (state: RootState) => state.auth.profileImageUrl,
  );

  const { data: countResponse, refetch } = useGetNotificationsCountQuery(
    undefined,
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );
  useEffect(() => {
    // Foreground notification
    const unsubscribeForeground = messaging().onMessage(() => {
      refetch();
    });

    // App opened from notification
    const unsubscribeOpened = messaging().onNotificationOpenedApp(() => {
      refetch();
    });

    // App opened from killed state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          refetch();
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, [refetch]);

  const unreadCount = countResponse?.data?.unreadCount;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    const unsubscribe = messaging().onMessage(() => {
      refetch();
    });

    return unsubscribe;
  }, [refetch]);

  return (
    <View style={dynamicStyles.outer}>
      {/* NOTIFICATIONS */}

      <TouchableOpacity
        onPress={() => navigation.navigate("Notifications")}
        style={{ opacity: isGuest ? 0.5 : 1 }}
        disabled={isGuest}
      >
        <Ionicons
          name="notifications-circle-outline"
          size={32}
          color={Colors.iconPrimary}
        />

        {unreadCount > 0 && (
          <View style={dynamicStyles.badge}>
            <Text style={dynamicStyles.badgeText}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* THEME BUTTON */}

      <TouchableOpacity onPress={toggleTheme}>
        {darkMode ? (
          <MaterialIcons
            name="dark-mode"
            size={28}
            color={Colors.iconPrimary}
          />
        ) : (
          <Entypo name="light-up" size={26} color={Colors.iconPrimary} />
        )}
      </TouchableOpacity>

      {/* PROFILE */}

      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <View style={dynamicStyles.profileCover}>
          <Image
            key={profileImage}
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../../../assets/default.png")
            }
            style={dynamicStyles.profile}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
