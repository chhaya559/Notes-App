import React, { useCallback, useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";
import { useGetNotificationsCountQuery } from "@redux/api/noteApi";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

export default function DashboardHeader() {
  const navigation = useNavigation<any>();

  const profileImage = useSelector(
    (state: RootState) => state.auth.profileImageUrl,
  );

  const { data: countResponse, refetch } = useGetNotificationsCountQuery(
    undefined,
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const unreadCount = countResponse?.data.unreadCount ?? countResponse ?? 0;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async () => {
      refetch();
    });

    return unsubscribe;
  }, [refetch]);

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
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../../../assets/default.png")
            }
            style={styles.profile}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
