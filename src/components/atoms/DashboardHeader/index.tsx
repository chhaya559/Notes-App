import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import styles from "./styles";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  useClearAllNotificationMutation,
  useGetNotificationByIdMutation,
  useGetNotificationsCountQuery,
  useGetNotificationsQuery,
  useMarkNoificationReadMutation,
  useReadAllNotificationMutation,
} from "@redux/api/noteApi";
import { useCallback, useEffect, useState } from "react";
import Modal from "react-native-modal";

export default function DashboardHeader() {
  const navigation = useNavigation<any>();
  const [showNotifications, setShowNotifications] = useState(false);
  // const [notifications, setNotifications] = useState([]);

  const { data: countResponse, refetch: refetchCount } =
    useGetNotificationsCountQuery(undefined, {
      // pollingInterval: 700,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });

  const {
    data: notificationsResponse,
    isFetching: isNotificationsFetching,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery(undefined, {
    // pollingInterval: 700,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [markNotificationRead] = useMarkNoificationReadMutation();

  const unreadCount = countResponse?.data?.unreadCount ?? 0;
  const notifications = notificationsResponse?.data?.notifications ?? [];
  const hasNotifications = notifications.length > 0;

  useFocusEffect(
    useCallback(() => {
      refetchCount();
      refetchNotifications();
    }, []),
  );

  function toggleNotificationsVisibility() {
    setShowNotifications((prev) => !prev);
  }
  const [getSingleNotification] = useGetNotificationByIdMutation();
  async function getDetailedNotification(notificationId: string) {
    try {
      await getSingleNotification(notificationId).unwrap();
    } catch (error) {
      console.log(error);
    }
  }

  async function readNotification(notificationId: string) {
    try {
      await markNotificationRead({ id: notificationId }).unwrap();
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  }
  const [deleteApi] = useClearAllNotificationMutation();
  async function clearAll() {
    try {
      const response = await deleteApi().unwrap();
      console.log(response);
    } catch (error) {
      console.log("Error clearing notifications", error);
    }
  }
  const [readApi] = useReadAllNotificationMutation();
  async function readAll() {
    try {
      const response = await readApi().unwrap();
      console.log(response);
    } catch (error) {
      console.log("Error clearing notifications", error);
    }
  }

  return (
    <>
      <View style={styles.outer}>
        <TouchableOpacity onPress={() => setShowNotifications(true)}>
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
        onBackdropPress={() => setShowNotifications(false)}
        onBackButtonPress={() => setShowNotifications(false)}
        useNativeDriver
      >
        <View style={styles.modal}>
          {/* CLOSE BUTTON – moved to top & touch-safe */}
          <TouchableOpacity
            onPress={() => setShowNotifications(false)}
            activeOpacity={0.7}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1000,
            }}
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
              <View>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    readNotification(item.id);
                    getDetailedNotification(item.id);
                  }}
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
              </View>
            )}
            ListEmptyComponent={
              !isNotificationsFetching ? (
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
              ) : null
            }
          />

          {hasNotifications && (
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
