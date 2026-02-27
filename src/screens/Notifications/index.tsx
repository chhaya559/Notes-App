import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
export default function Notifications() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isFetching, refetch } = useGetNotificationsQuery(
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
    console.log(item, "itemitemitem");
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
            color={Colors.danger}
            style={dynamicStyles.delete}
          />
        </TouchableOpacity>
      </Reanimated.View>
    );
  }
  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isReadPressed, setIsReadPressed] = useState(false);
  const [isClearPressed, setIsClearPressed] = useState(false);

  const filteredNotifications =
    filter === "all"
      ? allNotifications
      : allNotifications.filter((item) => !item.isRead);

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (!isFetching) {
      setFirstLoad(false);
    }
  }, [isFetching]);

  if (isFetching && firstLoad) {
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
      {allNotifications.length > 0 && (
        <View style={dynamicStyles.buttonsWrapper}>
          <View style={dynamicStyles.buttons}>
            {/* ALL FILTER */}
            <TouchableOpacity
              style={[
                dynamicStyles.touchable,
                filter === "all" && dynamicStyles.activeTouchable,
              ]}
              onPress={() => {
                setFilter("all");
              }}
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

            {/* UNREAD FILTER */}
            <TouchableOpacity
              style={[
                dynamicStyles.touchable,
                filter === "unread" && dynamicStyles.activeTouchable,
              ]}
              onPress={() => {
                setFilter("unread");
              }}
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
              onPress={() => {
                openDetails(item);
              }}
              style={dynamicStyles.card}
            >
              <Text style={dynamicStyles.reminderName}>{item.title}</Text>
              <Text style={dynamicStyles.reminderText}>{item.noteTitle}</Text>
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
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          // !isLoading && (
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
          //  )
        }
        ListFooterComponent={
          filteredNotifications.length > 0 ? (
            <View style={dynamicStyles.operations}>
              <TouchableOpacity
                style={
                  isReadPressed
                    ? dynamicStyles.activeOperation
                    : dynamicStyles.operationsButton
                }
                onPress={() => {
                  readAll();
                }}
                onPressIn={() => setIsReadPressed(true)}
                onPressOut={() => setIsReadPressed(false)}
              >
                <Text style={[dynamicStyles.operationsText]}>Read All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  isClearPressed
                    ? dynamicStyles.activeOperation
                    : dynamicStyles.operationsButton
                }
                onPress={() => {
                  clearAll();
                }}
                onPressIn={() => setIsClearPressed(true)}
                onPressOut={() => setIsClearPressed(false)}
              >
                <Text style={[dynamicStyles.operationsText]}>Clear All</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      <Modal
        isVisible={showDetailedNotification}
        backdropOpacity={0.5}
        onBackdropPress={() => setShowDetailedNotification(false)}
        onBackButtonPress={() => setShowDetailedNotification(false)}
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
