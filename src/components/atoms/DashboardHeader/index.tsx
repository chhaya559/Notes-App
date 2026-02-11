import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";
import Modal from "react-native-modal";
import {
  useClearAllNotificationMutation,
  useGetNotificationsCountQuery,
  useGetNotificationsQuery,
  useMarkNoificationReadMutation,
  useReadAllNotificationMutation,
} from "@redux/api/noteApi";

export default function DashboardHeader() {
  // const navigation = useNavigation<any>();

  // const [notifications, setNotifications] = useState<any[]>([]);
  // const [unreadCount, setUnreadCount] = useState(0);
  // const [showNotifications, setShowNotifications] = useState(false);

  // function toggleNotificationsVisibility() {
  //   setShowNotifications((prev) => !prev);
  // }
  // const { data: countResponse, refetch: refetchCount } =
  //   useGetNotificationsCountQuery(undefined, {
  //     refetchOnFocus: true,
  //     refetchOnMountOrArgChange: true,
  //   });
  // const { data: notificationsResponse, refetch: refetchNotifications } =
  //   useGetNotificationsQuery(undefined, {
  //     refetchOnFocus: true,
  //     refetchOnMountOrArgChange: true,
  //   });

  // useFocusEffect(
  //   useCallback(() => {
  //     refetchCount();
  //     refetchNotifications();
  //   }, []),
  // );

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     const data = remoteMessage?.data;
  //     if (!data) return;

  //     const newNotification = {
  //       id: data.id ?? Date.now().toString(),
  //       title: data.title ?? "",
  //       noteTitle: data.noteTitle ?? "",
  //       isRead: false,
  //     };

  //     setNotifications((prev) => [newNotification, ...prev]);
  //     setUnreadCount((prev) => prev + 1);
  //   });

  //   return unsubscribe;
  // }, []);

  // function readNotification(notificationId: string) {
  //   setNotifications((prev) =>
  //     prev.map((item) =>
  //       item.id === notificationId && !item.isRead
  //         ? { ...item, isRead: true }
  //         : item,
  //     ),
  //   );

  //   const target = notifications.find(
  //     (item) => item.id === notificationId && !item.isRead,
  //   );

  //   if (target) {
  //     setUnreadCount((prev) => Math.max(prev - 1, 0));
  //   }
  // }

  // function readAll() {
  //   setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  //   setUnreadCount(0);
  // }

  // function clearAll() {
  //   setNotifications([]);
  //   setUnreadCount(0);
  // }

  const navigation = useNavigation<any>();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const [markNotificationRead] = useMarkNoificationReadMutation();
  const [readApi] = useReadAllNotificationMutation();
  const [deleteApi] = useClearAllNotificationMutation();

  function toggleNotificationsVisibility() {
    setShowNotifications((prev) => !prev);
  }

  useFocusEffect(
    useCallback(() => {
      refetchCount();
      refetchNotifications();
    }, []),
  );

  useEffect(() => {
    if (notificationsResponse?.data?.notifications) {
      const serverNotifications = notificationsResponse.data.notifications.map(
        (n: any) => ({
          ...n,
          isRead: n.isRead ?? false,
        }),
      );
      setNotifications((prev) => {
        const ids = new Set(prev.map((n) => n.id));
        const merged = [
          ...prev,
          ...serverNotifications.filter((n) => !ids.has(n.id)),
        ];
        return merged.sort(
          (a, b) => (b.createdAt || Date.now()) - (a.createdAt || Date.now()),
        );
      });
    }

    setUnreadCount(countResponse?.data?.unreadCount ?? 0);
  }, [notificationsResponse, countResponse]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const data = remoteMessage?.data;
      Alert.alert("new notficaition");
      if (!data) return;

      const newNotification = {
        id: data.id ?? Date.now().toString(),
        title: data.title ?? "",
        noteTitle: data.noteTitle ?? "",
        isRead: false,
        createdAt: Date.now(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return unsubscribe;
  }, []);

  async function readNotification(notificationId: string) {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId && !item.isRead
          ? { ...item, isRead: true }
          : item,
      ),
    );

    const target = notifications.find(
      (item) => item.id === notificationId && !item.isRead,
    );
    if (target) setUnreadCount((prev) => Math.max(prev - 1, 0));

    try {
      await markNotificationRead({ id: notificationId }).unwrap();
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  }

  async function readAll() {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    try {
      await readApi().unwrap();
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  }

  async function clearAll() {
    try {
      await deleteApi().unwrap();
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  }

  return (
    <>
      <View style={styles.outer}>
        <TouchableOpacity onPress={toggleNotificationsVisibility}>
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

      <Modal
        isVisible={showNotifications}
        backdropOpacity={0.8}
        onBackdropPress={toggleNotificationsVisibility}
        onBackButtonPress={toggleNotificationsVisibility}
        useNativeDriver
      >
        <View style={styles.modal}>
          <TouchableOpacity
            onPress={toggleNotificationsVisibility}
            activeOpacity={0.7}
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
          >
            <AntDesign name="close" color="#5757f8" size={22} />
          </TouchableOpacity>

          <Text
            style={{
              fontWeight: "700",
              marginBottom: 10,
              textAlign: "center",
              color: "#5757f8",
              fontSize: 16,
            }}
          >
            Notifications
          </Text>

          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => readNotification(item.id)}
              >
                <Text style={{ fontWeight: "500", margin: 3, marginLeft: 0 }}>
                  {item.title}
                </Text>
                <Text style={{ fontWeight: "400" }}>{item.noteTitle}</Text>

                {!item.isRead && (
                  <Entypo
                    name="dot-single"
                    size={29}
                    color="#1500ffff"
                    style={{ position: "absolute", right: 5, top: 7 }}
                  />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Ionicons
                  name="notifications-off-circle"
                  size={200}
                  color="#E0E7FF"
                  style={styles.notification}
                />
                <Text style={styles.noNotification}>No notifications</Text>
                <Text style={styles.text}>You're all caught up!</Text>
              </View>
            }
          />

          {notifications.length > 0 && (
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.pressable} onPress={readAll}>
                <Text
                  style={{ color: "#fff", fontSize: 16, textAlign: "center" }}
                >
                  Read All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.pressable} onPress={clearAll}>
                <Text
                  style={{ color: "#fff", fontSize: 16, textAlign: "center" }}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}
