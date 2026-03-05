import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
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
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
import RightAction from "@components/atoms/RightActionNotificatin";
import { useNetInfo } from "@react-native-community/netinfo";

export default function Notifications() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isFetching, isLoading, refetch } = useGetNotificationsQuery(
    { pageNumber: page, pageSize },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );
  console.log(data, "datadatadata");

  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [deleteNotificationApi] = useDeleteNotificationMutation();
  const [readAllApi] = useReadAllNotificationMutation();
  const [clearAllApi] = useClearAllNotificationMutation();
  const [markReadApi] = useMarkNoificationReadMutation();

  const [showDetailedNotification, setShowDetailedNotification] =
    useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isReadPressed, setIsReadPressed] = useState(false);
  const [isClearPressed, setIsClearPressed] = useState(false);

  useEffect(() => {
    if (data?.data?.notifications) {
      const newNotifications = data.data.notifications.map((n: any) => ({
        id: n.id ?? n.Id,
        noteId: n.noteId ?? n.NoteId,
        noteTitle: n.noteTitle ?? n.NoteTitle,
        title: n.title ?? n.Title,
        message: n.message ?? n.Message,
        isRead: n.isRead ?? n.IsRead,
        createdAt: n.createdAt ?? n.CreatedAt,
      }));

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
  console.log(allNotifications, "allallallall");

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMore(true);
      refetch();
    }, [refetch]),
  );

  async function openDetails(item: any) {
    setSelectedNotification(item);
    setShowDetailedNotification(true);

    if (!item.isRead) {
      try {
        await markReadApi({ id: item.id }).unwrap();

        setAllNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
        );
      } catch (err) {
        console.log("Failed to mark as read", err);
      }
    }
  }

  async function readAll() {
    try {
      await readAllApi().unwrap();

      setAllNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        })),
      );

      refetch();
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  }

  async function deleteNotification(id: string) {
    try {
      await deleteNotificationApi({ id }).unwrap();

      setAllNotifications((prev) => prev.filter((item) => item.id !== id));
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
  const { isConnected } = useNetInfo();

  const loadMore = () => {
    if (isFetching || !hasMore) return;
    setPage((prev) => prev + 1);
  };

  const filteredNotifications =
    filter === "all"
      ? allNotifications
      : allNotifications.filter((item) => !item.isRead);

  let footerContent = null;

  if (isFetching && page > 1) {
    footerContent = (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  } else if (filteredNotifications.length > 0) {
    footerContent = (
      <View style={dynamicStyles.operations}>
        <TouchableOpacity
          style={
            isReadPressed
              ? dynamicStyles.activeOperation
              : dynamicStyles.operationsButton
          }
          onPress={readAll}
          onPressIn={() => setIsReadPressed(true)}
          onPressOut={() => setIsReadPressed(false)}
        >
          <Text style={dynamicStyles.operationsText}>Read All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            isClearPressed
              ? dynamicStyles.activeOperation
              : dynamicStyles.operationsButton
          }
          onPress={clearAll}
          onPressIn={() => setIsClearPressed(true)}
          onPressOut={() => setIsClearPressed(false)}
        >
          <Text style={dynamicStyles.operationsText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      {isConnected === false ? (
        <View style={dynamicStyles.offline}>
          <Text style={dynamicStyles.OfflineText}>No Internet Connection</Text>
          <Text style={dynamicStyles.SecondaryText}>
            Notifications are only available online
          </Text>
        </View>
      ) : (
        <>
          {allNotifications.length > 0 && (
            <View style={dynamicStyles.buttonsWrapper}>
              <View style={dynamicStyles.buttons}>
                <TouchableOpacity
                  style={[
                    dynamicStyles.touchable,
                    filter === "all" && dynamicStyles.activeTouchable,
                  ]}
                  onPress={() => setFilter("all")}
                >
                  <Text
                    style={[
                      dynamicStyles.text,
                      filter === "all" && dynamicStyles.activeText,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    dynamicStyles.touchable,
                    filter === "unread" && dynamicStyles.activeTouchable,
                  ]}
                  onPress={() => setFilter("unread")}
                >
                  <Text
                    style={[
                      dynamicStyles.text,
                      filter === "unread" && dynamicStyles.activeText,
                    ]}
                  >
                    Unread
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <FlatList
            data={filteredNotifications}
            bounces={false}
            keyExtractor={(item, index) =>
              item?.id?.toString() || index.toString()
            }
            renderItem={({ item }) => (
              <ReanimatedSwipeable
                renderRightActions={(progress, translation) => (
                  <RightAction
                    translation={translation}
                    item={item}
                    deleteNotification={deleteNotification}
                    dynamicStyles={dynamicStyles}
                  />
                )}
                rightThreshold={10}
              >
                <TouchableOpacity
                  onPress={() => openDetails(item)}
                  style={dynamicStyles.card}
                >
                  <Text style={dynamicStyles.reminderName}>{item.title}</Text>
                  <Text style={dynamicStyles.reminderText}>
                    {item.noteTitle}
                  </Text>

                  {!item.isRead && (
                    <Entypo
                      name="dot-single"
                      size={26}
                      color={Colors.primary}
                      style={{ position: "absolute", right: 5, top: 7 }}
                    />
                  )}
                </TouchableOpacity>
              </ReanimatedSwipeable>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={() => {
              if (isFetching && page === 1) {
                return (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 80,
                    }}
                  >
                    <ActivityIndicator size="large" color={Colors.primary} />
                  </View>
                );
              }

              if (!isFetching && filteredNotifications.length === 0) {
                return (
                  <View style={dynamicStyles.emptyComponent}>
                    <Ionicons
                      name="notifications-off-circle"
                      size={200}
                      color={Colors.iconPrimary}
                    />
                    <Text style={dynamicStyles.noText}>No notifications</Text>
                    <Text style={dynamicStyles.emptyMessage}>
                      You're all caught up!
                    </Text>
                  </View>
                );
              }

              return null;
            }}
            ListFooterComponent={footerContent}
          />
        </>
      )}

      {/* Modal */}
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
            <AntDesign name="close" size={22} color={Colors.iconPrimary} />
          </TouchableOpacity>

          <Ionicons
            name="notifications-circle"
            size={50}
            color={Colors.iconPrimary}
            style={dynamicStyles.icon}
          />

          <Text style={dynamicStyles.title}>{selectedNotification?.title}</Text>
          <Text style={dynamicStyles.message}>
            Reminder for Note: {selectedNotification?.noteTitle}
          </Text>
          <Text style={dynamicStyles.message}>
            {selectedNotification?.message}
          </Text>
        </View>
      </Modal>
    </View>
  );
}
