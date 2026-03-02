import { StyleSheet } from "react-native";
import { ThemeColors } from "@theme/constants";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    outer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      height: 56,
    },

    icon: {
      position: "absolute",
      right: 60,
      top: 4,
    },
    profileCover: {
      height: 40,
      width: 40,
      borderRadius: 20,
      backgroundColor: "white",
      borderWidth: 2,
      borderColor: Colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },

    profile: {
      height: 35,
      width: 35,
      borderRadius: 17,
      resizeMode: "cover",
    },
    image: {
      // position: "absolute",
      // right: 15,
      // top: 7,
    },
    badge: {
      position: "absolute",
      top: -3,
      right: -3,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: Colors.iconSoftBg,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
    },

    badgeText: {
      color: Colors.textPrimary,
      fontSize: 10,
      fontWeight: "700",
    },
    close: {
      position: "absolute",
      top: -480,
      right: 5,
    },
    modal: {
      padding: 10,
      borderRadius: 12,
      height: 500,
      backgroundColor: "#fefeffff",
      shadowOpacity: 0.7,
    },

    buttons: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
  });

export default styles;
