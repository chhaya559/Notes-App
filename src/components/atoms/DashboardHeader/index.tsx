import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";

export default function DashboardHeader() {
  const navigation = useNavigation<any>();

  // Local state for notifications & unread count
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Toggle modal visibility
  function toggleNotificationsVisibility() {
    setShowNotifications((prev) => !prev);
  }

  // FCM listener for foreground messages
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const data = remoteMessage.data;

      if (!data) return;

      const newNotification = {
        id: data.id ?? Date.now().toString(),
        title: data.title,
        noteTitle: data.noteTitle,
        isRead: false,
      };

      // Add to top of notifications
      setNotifications((prev) => [newNotification, ...prev]);

      // Update unread count
      setUnreadCount((prev) => prev + 1);

      // Optional: show alert
      Alert.alert("New Notification", newNotification.title);
    });

    return unsubscribe;
  }, []);

  // Mark single notification as read
  function readNotification(notificationId: string) {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item
      )
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  }

  // Mark all notifications as read
  function readAll() {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
  }

  // Clear all notifications
  function clearAll() {
    setNotifications([]);
    setUnreadCount(0);
  }

  return (
    <>
      {/* Header icons */}
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

      {/* Notifications Modal */}
      <Modal
        isVisible={showNotifications}
        backdropOpacity={0.8}
        onBackdropPress={toggleNotificationsVisibility}
        onBackButtonPress={toggleNotificationsVisibility}
        useNativeDriver
      >
        <View style={styles.modal}>
          {/* Close button */}
          <TouchableOpacity
            onPress={toggleNotificationsVisibility}
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

          {/* Notification list */}
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
              notifications.length === 0 ? (
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

          {/* Action buttons */}
          {notifications.length > 0 && (
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.pressable} onPress={readAll}>
                <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>
                  Read All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.pressable} onPress={clearAll}>
                <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>
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
