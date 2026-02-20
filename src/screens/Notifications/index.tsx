import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import styles from "./styles";
import {
  useClearAllNotificationMutation,
  useGetNotificationsQuery,
  useReadAllNotificationMutation,
  useMarkNoificationReadMutation,
  useDeleteNotificationMutation,
} from "@redux/api/noteApi";
import { useFocusEffect } from "@react-navigation/native";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { cosineDistance } from "drizzle-orm";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
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
  const [deleteNotificationApi] = useDeleteNotificationMutation();
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
  async function deleteNotification(id: string) {
    try {
      const respone = await deleteNotificationApi({ id: id }).unwrap();
      console.log(respone, "response from delete notification");
    } catch (error) {
      console.log("Error deleting: ", error);
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

  function RightAction(translation: SharedValue<number>, item: any) {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        translateX: translation.value + 80,
      };
    });

    return (
      <Reanimated.View style={[animatedStyle, dynamicStyles.swipe]}>
        <TouchableOpacity onPress={() => deleteNotification(item.id)}>
          <MaterialIcons
            name="delete-outline"
            size={38}
            color="#5757f8"
            style={dynamicStyles.delete}
          />
        </TouchableOpacity>
      </Reanimated.View>
    );
  }
  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();
  return (
    <View style={dynamicStyles.container}>
      <FlatList
        data={allNotifications}
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ReanimatedSwipeable
            enableTrackpadTwoFingerGesture
            renderRightActions={(progress, translation) =>
              RightAction(translation, item)
            }
            rightThreshold={10}
          >
            <TouchableOpacity
              onPress={() => openDetails(item)}
              style={dynamicStyles.card}
            >
              <Text style={dynamicStyles.reminderName}>{item.title}</Text>
              <Text style={dynamicStyles.reminderText}>{item.noteTitle}</Text>
              {!item.isRead && (
                <Entypo
                  name="dot-single"
                  size={26}
                  color={Colors.icon}
                  style={{ position: "absolute", right: 5, top: 7 }}
                />
              )}
            </TouchableOpacity>
          </ReanimatedSwipeable>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching && page > 1 ? (
            <Text
              style={{
                textAlign: "center",
                padding: 10,
                color: Colors.textSecondary,
              }}
            >
              Loading more...
            </Text>
          ) : null
        }
        ListEmptyComponent={
          // !isLoading && (
          <View style={dynamicStyles.emptyComponent}>
            <Ionicons
              name="notifications-off-circle"
              size={200}
              color={Colors.icon}
            />
            <Text style={dynamicStyles.noText}>No notifications</Text>
            <Text style={dynamicStyles.emptyMessage}>
              You're all caught up!
            </Text>
          </View>
          //  )
        }
      />

      {allNotifications.length > 0 && (
        <View style={dynamicStyles.buttons}>
          <TouchableOpacity style={dynamicStyles.pressable} onPress={readAll}>
            <Text
              style={{ color: Colors.icon, fontSize: 16, textAlign: "center" }}
            >
              Read All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={dynamicStyles.pressable} onPress={clearAll}>
            <Text
              style={{ color: Colors.icon, fontSize: 16, textAlign: "center" }}
            >
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
        <View style={dynamicStyles.modal}>
          <TouchableOpacity
            onPress={() => setShowDetailedNotification(false)}
            style={dynamicStyles.close}
          >
            <AntDesign name="close" size={20} color={Colors.icon} />
          </TouchableOpacity>
          <Ionicons
            name="notifications-circle"
            size={70}
            color={Colors.icon}
            style={dynamicStyles.icon}
          />

          <Text style={dynamicStyles.title}>{selectedNotification?.title}</Text>
          <Text style={dynamicStyles.message}>
            {selectedNotification?.message}
          </Text>
          <Text style={dynamicStyles.messageDescription}>
            {selectedNotification?.description}
          </Text>
        </View>
      </Modal>
    </View>
  );
}
