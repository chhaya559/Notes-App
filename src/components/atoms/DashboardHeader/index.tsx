import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";
import {
  useGetNotificationsCountQuery,
  useGetNotificationsQuery,
} from "@redux/api/noteApi";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import style from "@screens/GuestConversion/styles";

export default function DashboardHeader() {
  const navigation = useNavigation<any>();

  const profileImage = useSelector(
    (state: RootState) => state.auth.profileImageUrl,
  );
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: countResponse, refetch: refetchCount } =
    useGetNotificationsCountQuery(undefined, {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });

  useFocusEffect(
    useCallback(() => {
      refetchCount();
    }, [refetchCount]),
  );

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const data = remoteMessage?.data || remoteMessage?.notification;

      if (!data) return;
      setUnreadCount((prev) => prev + 1);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.outer}>
      <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
        <Ionicons
          name="notifications-circle-outline"
          color="#5757f8"
          size={40}
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <View style={styles.profileCover}>
          <Image
            key={profileImage}
            source={{ uri: profileImage }}
            style={styles.profile}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
