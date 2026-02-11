import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";
import {
  useGetNotificationsCountQuery,
  useGetNotificationsQuery,
} from "@redux/api/noteApi";

export default function DashboardHeader() {
  const navigation = useNavigation<any>();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: countResponse, refetch: refetchCount } =
    useGetNotificationsCountQuery(undefined, {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });

  const { data: notificationsResponse, refetch: refetchNotifications } =
    useGetNotificationsQuery(undefined, {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });

  useFocusEffect(
    useCallback(() => {
      refetchCount();
      refetchNotifications();
    }, [refetchCount, refetchNotifications]),
  );

  useEffect(() => {
    if (notificationsResponse?.data?.notifications) {
      const serverNotifications = notificationsResponse.data.notifications.map(
        (n: any) => ({
          ...n,
          message: n.message ?? "",
          isRead: n.isRead ?? false,
        }),
      );

      setNotifications((prev) => {
        const ids = new Set(prev.map((n) => n.id));
        const merged = [
          ...prev,
          ...serverNotifications.filter((n: any) => !ids.has(n.id)),
        ];

        return merged.sort(
          (a, b) =>
            new Date(b.createdAt || Date.now()).getTime() -
            new Date(a.createdAt || Date.now()).getTime(),
        );
      });
    }

    setUnreadCount(countResponse?.data?.unreadCount ?? 0);
  }, [notificationsResponse, countResponse]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const data = remoteMessage?.data || remoteMessage?.notification;

      if (!data) return;

      const newNotification = {
        id: data?.id ?? Date.now().toString(),
        title: data.title ?? "",
        noteTitle: data?.noteTitle ?? "",
        message: data?.message ?? "",
        isRead: false,
        createdAt: Date.now(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.outer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Notifications", {
            notifications,
          })
        }
      >
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
        <FontAwesome name="user-circle" color="#5757f8" size={34} />
      </TouchableOpacity>
    </View>
  );
}
