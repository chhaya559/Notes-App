import { Ionicons } from "@expo/vector-icons";
import useStyles from "@hooks/useStyles";
import useTheme from "@hooks/useTheme";
import styles from "@screens/Notifications/styles";
import { ActivityIndicator, Text, View } from "react-native";

type props = {
  isFetching: boolean;
  page: number;
  isLoading: boolean;
  filteredNotifications: any;
};
export default function NotificationsEmptyComponent({
  isFetching,
  isLoading,
  page,
  filteredNotifications,
}: Readonly<props>) {
  const { dynamicStyles } = useStyles(styles);
  const { Colors } = useTheme();
  if (isFetching && page === 1 && !isLoading) {
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
          {"You're all caught up!"}
        </Text>
      </View>
    );
  }

  return null;
}
