import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import {
  useClearAllNotificationMutation,
  useGetNotificationsQuery,
  useReadAllNotificationMutation,
  useMarkNoificationReadMutation,
} from "@redux/api/noteApi";
import { useFocusEffect } from "@react-navigation/native";

export default function Notifications() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isFetching, refetch } = useGetNotificationsQuery(
    { pageNumber: page, pageSize },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [readAllApi] = useReadAllNotificationMutation();
  const [clearAllApi] = useClearAllNotificationMutation();
  const [markReadApi] = useMarkNoificationReadMutation();

  const [showDetailedNotification, setShowDetailedNotification] =
    useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  useEffect(() => {
    if (data) {
      const newNotifications = data?.data?.notifications ?? data;

      if (page === 1) {
        setAllNotifications(newNotifications);
      } else {
        setAllNotifications((prev) => [...prev, ...newNotifications]);
      }
      if (newNotifications.length < pageSize) {
        setHasMore(false);
      }
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  async function openDetails(item: any) {
    setSelectedNotification(item);
    setShowDetailedNotification(true);

    if (!item.isRead) {
      try {
        await markReadApi({ id: item.id }).unwrap();
      } catch (err) {
        console.log("Failed to mark as read", err);
      }
    }
  }

  async function readAll() {
    try {
      await readAllApi().unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  }

  async function clearAll() {
    try {
      await clearAllApi().unwrap();
      setAllNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  }

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={allNotifications}
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
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
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching && page > 1 ? (
            <Text style={{ textAlign: "center", padding: 10 }}>
              Loading more...
            </Text>
          ) : null
        }
        ListEmptyComponent={
          // !isLoading && (
          <View style={styles.emptyComponent}>
            <Ionicons
              name="notifications-off-circle"
              size={200}
              color="#E0E7FF"
            />
            <Text style={styles.noText}>No notifications</Text>
            <Text style={styles.emptyMessage}>You're all caught up!</Text>
          </View>
          //  )
        }
      />

      {allNotifications.length > 0 && (
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
            <AntDesign name="close" size={20} color="#5757f8" />
          </TouchableOpacity>
          <Ionicons
            name="notifications-circle"
            size={70}
            color="#E0E7FF"
            style={styles.icon}
          />

          <Text style={styles.title}>{selectedNotification?.title}</Text>
          <Text style={styles.message}>{selectedNotification?.message}</Text>
          <Text style={styles.messageDescription}>
            {selectedNotification?.description}
          </Text>
        </View>
      </Modal>
    </View>
  );
}
