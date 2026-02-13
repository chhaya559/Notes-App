import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import {
  useClearAllNotificationMutation,
  useReadAllNotificationMutation,
} from "@redux/api/noteApi";

export default function Notifications({ route }: any) {
  const { notifications } = route.params;
  const [Notifications, setNotifications] = useState(notifications);
  const [showDetailedNotification, setShowDetailedNotification] =
    useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [readApi] = useReadAllNotificationMutation();
  const [deleteApi] = useClearAllNotificationMutation();

  useEffect(() => {
    setNotifications(notifications);
  }, [notifications]);

  function openDetails(item: any) {
    setSelectedNotification(item);
    setShowDetailedNotification(true);
  }

  async function readAll() {
    try {
      await readApi().unwrap();
      setNotifications((prev: any) =>
        prev.map((n: any) => ({ ...n, isRead: true })),
      );
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  }

  async function clearAll() {
    try {
      await deleteApi().unwrap();
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={Notifications}
        bounces={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openDetails(item)}
            style={styles.card}
          >
            <Text>{item.title}</Text>
            <Text>{item.noteTitle}</Text>

            {!item.isRead && (
              <Entypo
                name="dot-single"
                size={26}
                color="#5757f8"
                style={{ position: "absolute", right: 5, top: 7 }}
              />
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View>
            <Ionicons
              name="notifications-off-circle"
              size={200}
              color="#E0E7FF"
            />
            <Text>No notifications</Text>
            <Text>You're all caught up!</Text>
          </View>
        }
      />

      {Notifications.length > 0 && (
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

      <Modal
        isVisible={showDetailedNotification}
        backdropOpacity={0.5}
        onBackdropPress={() => setShowDetailedNotification(false)}
      >
        <View style={styles.modal}>
          <TouchableOpacity
            onPress={() => setShowDetailedNotification(false)}
            style={styles.close}
          >
            <AntDesign name="close" size={22} color="#5757f8" />
          </TouchableOpacity>

          <Text style={styles.title}>{selectedNotification?.title}</Text>
          <Text style={styles.message}>{selectedNotification?.message}</Text>
          <Text style={styles.message}>
            {selectedNotification?.description}
          </Text>
        </View>
      </Modal>
    </View>
  );
}
