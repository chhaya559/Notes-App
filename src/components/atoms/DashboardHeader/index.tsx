import React, { useCallback, useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";
import { useGetNotificationsCountQuery } from "@redux/api/noteApi";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import useTheme from "@hooks/useTheme";
import useStyles from "@hooks/useStyles";

export default function DashboardHeader() {
  const navigation = useNavigation<any>();
  const { toggleTheme, darkMode, Colors } = useTheme();
  const { dynamicStyles } = useStyles(styles);

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
    <View style={dynamicStyles.outer}>
      <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
        <Ionicons
          name="notifications-circle-outline"
          color={Colors.iconPrimary}
          size={30}
        />

        {unreadCount > 0 && (
          <View style={dynamicStyles.badge}>
            <Text style={dynamicStyles.badgeText}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleTheme}>
        {darkMode ? (
          <MaterialIcons
            name="dark-mode"
            size={26}
            color={Colors.iconPrimary}
          />
        ) : (
          <Entypo name="light-up" size={24} color={Colors.iconPrimary} />
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <View style={dynamicStyles.profileCover}>
          <Image
            key={profileImage}
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../../../assets/default.png")
            }
            style={dynamicStyles.profile}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
